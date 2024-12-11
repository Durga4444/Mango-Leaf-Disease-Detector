import os
import sys
import io
import logging
from flask import Flask, request, render_template, redirect, url_for
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model

from werkzeug.utils import secure_filename
import numpy as np

# Set default encoding to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

# Initialize Flask app
app = Flask(__name__)

# Path to the saved model
MODEL_PATH = '.\\cnn_model.h5'

# Load the trained model
model = load_model(MODEL_PATH)

# Define the class labels (corresponding to your folders)
CLASS_LABELS = ['Anthracnose', 'Bacterial Canker', 'Cutting Weevil', 'Die Back', 'Gall Midge', 'Healthy']

# Ensure the folder to save uploaded images exists
UPLOAD_FOLDER = 'uploads/'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Enable logging
logging.basicConfig(level=logging.DEBUG)

# Function to preprocess image before prediction
def preprocess_image(image_path):
    img = load_img(image_path, target_size=(150, 150))  # Resize the image to match your training input
    img_array = img_to_array(img) / 255.0  # Normalize image
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


@app.route('/', methods=['GET', 'POST'])
def upload_predict():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            logging.error("No file part")
            return redirect(request.url)
        
        file = request.files['file']

        if file and file.filename != '':
            # Sanitize and save the uploaded file
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            logging.debug(f"File path: {file_path}")  # Log the file path

            try:
                file.save(file_path)
            except Exception as e:
                logging.error(f"Error saving file: {e}")
                return "Error saving file", 500

            # Preprocess the image
            try:
                img_array = preprocess_image(file_path)
                logging.debug(f"Image array shape: {img_array.shape}")  # Log image shape
            except Exception as e:
                logging.error(f"Error processing image: {e}")
                return "Error processing image", 500

            # Make prediction
            try:
                predictions = model.predict(img_array)
                predicted_class = CLASS_LABELS[np.argmax(predictions)]
                logging.debug(f"Predicted class: {predicted_class}")  # Log prediction
            except Exception as e:
                logging.error(f"Error making prediction: {e}")
                return "Error making prediction", 500

            # Return the result page with the prediction
            return render_template('result.html', prediction=predicted_class)

    # If the method is GET, just render the initial form page
    return render_template('index.html')


# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
