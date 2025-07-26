from deepforest import main
import os

# Load model
model = main.deepforest()
model.load_model(model_name="weecology/deepforest-tree", revision="main")

# File paths
tile_2000 = "amazon_2000.tif"
tile_2020 = "amazon_2020.tif"

# Ensure files exist
if not os.path.exists(tile_2000):
    raise FileNotFoundError(f"{tile_2000} not found!")
if not os.path.exists(tile_2020):
    raise FileNotFoundError(f"{tile_2020} not found!")

# Run predictions
preds_2000 = model.predict_tile(tile_2000, patch_size=400)
preds_2020 = model.predict_tile(tile_2020, patch_size=400)

# Compare tree counts
count_2000 = len(preds_2000)
count_2020 = len(preds_2020)

loss_percent = round((1 - count_2020 / count_2000) * 100, 2) if count_2000 > 0 else 0

print(f"2000 tree count: {count_2000}")
print(f"2020 tree count: {count_2020}")
print(f"Estimated tree loss: {loss_percent}%")

import rasterio

with rasterio.open("amazon_2000.tif") as src:
    print("Shape:", src.shape)
    print("Bands:", src.count)
    print("Dtype:", src.dtypes)
