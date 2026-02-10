import kagglehub
import os

# Set target directory
target_dir = os.path.join(os.getcwd(), "dataset")

# Download dataset directly into dataset/
path = kagglehub.dataset_download(
    "paultimothymooney/chest-xray-pneumonia",
    path=target_dir
)

print("Dataset downloaded to:", path)
