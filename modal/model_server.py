from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.cluster import DBSCAN, KMeans
import folium
import io

app = Flask(__name__)
CORS(app)

@app.route('/hotspots', methods=['POST'])
def generate_map():
    print("Received request on /hotspots endpoint")

    # Check if a file is included in the request
    file = request.files.get('csv_file')
    if not file:
        print("Error: No file part in the request.")
        return jsonify({"error": "No file uploaded."}), 400

    # Check file name and read file
    print("File detected, processing...")
    try:
        df = pd.read_csv(file)
        print("CSV file successfully loaded")
    except ValueError as e:
        print(f"CSV reading error: {e}")
        return jsonify({"error": "CSV file has missing or incorrect columns.", "details": str(e)}), 400
    except Exception as e:
        print(f"Error while reading CSV: {e}")
        return jsonify({"error": "Error reading file", "details": str(e)}), 400

    # Validate required columns
    required_columns = {'latitude', 'longitude', 'number_of_accidents'}
    missing_columns = required_columns - set(df.columns)
    if missing_columns:
        print(f"Missing required columns: {missing_columns}")
        return jsonify({"error": f"Missing columns: {', '.join(missing_columns)}"}), 400

    # Drop rows with NaN in latitude or longitude
    df = df.dropna(subset=['latitude', 'longitude'])

    # Expand data by duplicating rows based on accident frequency
    expanded_data = df.loc[df.index.repeat(df['number_of_accidents'])].reset_index(drop=True)

    # Get coordinates for clustering
    coordinates = expanded_data[['latitude', 'longitude']].values

    # Apply DBSCAN for identifying hotspots
    db = DBSCAN(eps=0.01, min_samples=3).fit(coordinates)
    expanded_data['dbscan_cluster'] = db.labels_

    # Map DBSCAN clusters back to the original dataset
    cluster_map = (
        expanded_data.groupby(['latitude', 'longitude'])['dbscan_cluster']
        .agg(lambda x: x.value_counts().index[0])
        .reset_index()
    )
    df = df.merge(cluster_map, on=['latitude', 'longitude'], how='left')

    # Number of ambulances for K-means clustering
    num_ambulances = int(request.form.get('num_ambulances', 1))

    # Apply K-means clustering for ambulance placement
    kmeans = KMeans(n_clusters=num_ambulances, random_state=42)
    expanded_data['ambulance_cluster'] = kmeans.fit_predict(coordinates)
    ambulance_positions = pd.DataFrame(kmeans.cluster_centers_, columns=['latitude', 'longitude'])
    ambulance_positions['ambulance_id'] = range(1, len(ambulance_positions) + 1)

    # Generate map centered on data
    map_center = [df['latitude'].mean(), df['longitude'].mean()]
    accident_map = folium.Map(location=map_center, zoom_start=12)

    # Plot all accident locations, scaled by accident frequency
    for _, row in df.iterrows():
        folium.CircleMarker(
            location=(row['latitude'], row['longitude']),
            radius=row['number_of_accidents'] / 10,
            color='blue',
            fill=True,
            fill_color='blue',
            fill_opacity=0.4,
            popup=f"Location: {row.get('location_name', 'Unknown')}<br>Number of Accidents: {row['number_of_accidents']}"
        ).add_to(accident_map)

    # Calculate DBSCAN centroids for plotting
    dbscan_centroids = (
        expanded_data[expanded_data['dbscan_cluster'] != -1]
        .groupby('dbscan_cluster')[['latitude', 'longitude']]
        .mean()
        .reset_index()
    )
    dbscan_centroids['number_of_accidents'] = (
        expanded_data[expanded_data['dbscan_cluster'] != -1]
        .groupby('dbscan_cluster')['number_of_accidents']
        .sum()
        .values
    )

    # Plot DBSCAN hotspot centroids
    for _, row in dbscan_centroids.iterrows():
        folium.Marker(
            location=(row['latitude'], row['longitude']),
            icon=folium.Icon(color='red', icon='info-sign', prefix='fa'),
            popup=f"Hotspot Cluster {int(row['dbscan_cluster'])}<br>Average Accidents: {row['number_of_accidents']:.2f}"
        ).add_to(accident_map)

    # Plot ambulance positions
    for _, row in ambulance_positions.iterrows():
        folium.Marker(
            location=(row['latitude'], row['longitude']),
            icon=folium.Icon(color='green', icon='ambulance', prefix='fa'),
            popup=f"Ambulance {int(row['ambulance_id'])}<br>Optimal Location"
        ).add_to(accident_map)

    # Save the map to an HTML file in memory
    map_html = io.BytesIO()
    accident_map.save(map_html, close_file=False)
    map_html.seek(0)

    print("Map generation successful, returning file")
    return send_file(map_html, mimetype='text/html', download_name='optimized_accident_hotspots_map.html')

if __name__ == '__main__':
    app.run(debug=True)