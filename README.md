# 🧭 Problem Statement

The Amazon rainforest is the world’s largest tropical forest and a crucial carbon sink, but it's rapidly shrinking due to deforestation caused by illegal logging, agriculture, and infrastructure expansion.

However, current deforestation tracking is often reactive, not predictive. Governments, NGOs, and conservationists need foresight to act before large-scale forest loss occurs.


# 🎯 Our Focus

We aim to predict future tree loss in the Amazon rainforest (e.g., 2026) using past satellite images. Our application visualizes this as a heatmap over an interactive map of the Amazon, helping users identify high-risk areas before it's too late.

# 💡 Key Features
📍 Map-based UI of the Amazon rainforest

🌡️ Heatmap of predicted tree loss

🛰️ Uses real satellite data + pretrained ML models

🕒 Year slider


# 🛠️ Tech Stack

Frontend: React

Backend:	Python, FastAPI, Marshmallow, Rasterio, GeoTIFF, DeepForest

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

