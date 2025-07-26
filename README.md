# 🧭 Problem Statement

The Amazon rainforest is the world’s largest tropical forest and a crucial carbon sink, but it's rapidly shrinking due to deforestation caused by illegal logging, agriculture, and infrastructure expansion.

However, current deforestation tracking is often reactive, not predictive. Governments, NGOs, and conservationists need foresight to act before large-scale forest loss occurs.


# 🎯 Our Focus

We aim to predict future tree loss in the Amazon rainforest (e.g., 2026) using past deforestation patterns, tree detection, and satellite data. Our app visualizes this as a heatmap over an interactive map of the Amazon, helping users identify high-risk areas before it's too late.

# 💡 Key Features
📍 Map-based UI of the Amazon rainforest

🌡️ Heatmap of predicted tree loss (2026)

📊 Tree density statistics and loss per region

🛰️ Uses real satellite data + pretrained ML models

🕒 Year slider (future years coming soon; currently fixed to 2026)


# 🛠️ Tech Stack

Frontend: React, Leaflet.js or Mapbox, Deck.gl (heatmap)

Backend:	Python, FastAPI, DeepForest, GeoPandas, Rasterio

ML Model:	weecology/deepforest-tree (pretrained model), Data	Global Forest Watch GeoTIFFs, Google Earth Engine

# 🧠 Model Strategy
### ✅ Pretrained Model: weecology/deepforest-tree
Detects individual tree crowns in high-resolution aerial/satellite imagery

No training required — we use predict_tile() to handle large .tif raster tiles

Counts bounding boxes per tile to measure tree density

Compare multiple years to infer loss trends

### 🛰️ Satellite Data
Source: Global Forest Watch, Hansen Dataset (GEE or API)

Format: GeoTIFFs — raster images of tree cover per year

Download or fetch tiles covering Amazon regions (e.g., by lat/lon bounding boxes)

