from flask import Flask, request, render_template
import base64
import os
import cv2
import numpy as np

app = Flask(__name__)

# Folder to save the images
UPLOAD_FOLDER = 'C:\\Users\\acer\\OneDrive\\Desktop\\New folder\\On-Beat\\client\\'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/save_image', methods=['POST'])
def save_image():
    # Get base64 image data from the request
    img_data = request.form['snap'].split(',')[1]  # Extract base64 data
    img_bytes = base64.b64decode(img_data)  # Decode the base64 data

    # Save the image
    img_filename = 'snap.png'
    img_path = os.path.join(UPLOAD_FOLDER, img_filename)

    with open(img_path, 'wb') as img_file:
        img_file.write(img_bytes)

    # Compare with existing image
    compare_images(img_path, 'snap1.png')  # Compare with existing snap1.png

    return f"Image saved at {img_path}"

def compare_images(img1_path, img2_path):
    img1 = cv2.imread(img1_path)
    img2 = cv2.imread(img2_path)

    if img1 is None or img2 is None:
        print("Error: One of the images was not found.")
        return

    # Convert images to grayscale
    img1_gray = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img2_gray = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # Ensure both images are of the same size
    if img1_gray.shape != img2_gray.shape:
        img2_gray = cv2.resize(img2_gray, (img1_gray.shape[1], img1_gray.shape[0]))

    # Compute MSE (Mean Squared Error)
    mse_value = np.sum((img1_gray - img2_gray) ** 2) / img1_gray.size
    print("Mean Squared Error between the two images:", mse_value)

    # Optional: You can set a threshold for a match
    if mse_value < 1000:  # Adjust this threshold based on your requirement
        print("Images match closely.")
    else:
        print("Images do not match.")

if __name__ == '__main__':
    app.run(debug=True)
