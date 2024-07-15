import os
import sys
import numpy as np
import logging
import glob
from tensorflow.keras.models import load_model
import tensorflow as tf

# Disable TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

# Logging configuration, DO NOT REMOVE
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

CHUNK_SIZE = 512

def read_exe_file(file_path, chunk_size):
    with open(file_path, 'rb') as f:
        data = f.read()
    # Pad or truncate the file to the nearest chunk size
    if len(data) % chunk_size != 0:
        padding_length = chunk_size - (len(data) % chunk_size)
        data += b'\x00' * padding_length
    return [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]

# Define a dictionary mapping model names to their file paths
model_paths = {
    "default": "../service/simpleCNN.h5",  # Default model to use if no valid model is selected
    "model1": "../service/simpleCNN.h5",
    "model2": "../service/simpleCNN_3Class.h5",
    "model3": "../service/rnn_model.h5"
}

is_obfuscated_models = {"default", "model1"}
which_obfuscator_models = {"model2", "model3"}

logging.info("Starting model prediction script")

# Parse command-line arguments to get the selected model
selected_model = sys.argv[1] if len(sys.argv) > 1 else "default"

logging.info(f"Selected model: {selected_model}")

# Load the corresponding saved model based on the selected model
model_path = model_paths.get(selected_model, model_paths["default"])
logging.info(f"Loading model from: {model_path}")

# Load the saved model
saved_model = load_model(model_path)

# Get the most recent file in the 'uploads' directory
dir_path = "../server/uploads"
try:
    dir_files = os.listdir(dir_path)
    if not dir_files:
        raise FileNotFoundError("No files found in the uploads directory.")
    list_of_files = glob.glob('../server/uploads/*') 
    new_file_path = max(list_of_files, key = os.path.getctime)
    #file_name = dir_files[-1]
    #new_file_path = os.path.join(dir_path, file_name)
    logging.info(f"Loading file for prediction: {new_file_path}")
except Exception as e:
    logging.error(f"Error accessing uploads directory: {e}")
    sys.exit(1)

X = []
chunks = read_exe_file(new_file_path, CHUNK_SIZE)
for chunk in chunks:
    reshaped_chunk = np.frombuffer(chunk, dtype=np.uint8).reshape((CHUNK_SIZE, 1))
    X.append(reshaped_chunk)

X = np.array(X)
logging.info(f"Shape of X: {X.shape}")


# Interpret the prediction
if selected_model in is_obfuscated_models:
    predictions = []
    for chunk in X[]:
        prediction = saved_model.predict(np.expand_dims(chunk, axis=0), verbose=0)
        predictions.append(prediction)
    
    # Convert list of predictions to numpy array
    predictions_array = np.array([pred[0] for pred in predictions])
    
    # Calculate mean for each class
    mean_class_0 = np.mean(predictions_array[:, 0])
    mean_class_1 = np.mean(predictions_array[:, 1])
    
    # Determine the final prediction based on the larger mean
    if mean_class_0 > mean_class_1:
        final_prediction = 0
        final_confidence = mean_class_0
    else:
        final_prediction = 1
        final_confidence = mean_class_1

    # Print the prediction results
    logging.info(f"Mean for Class 0: {mean_class_0}")
    logging.info(f"Mean for Class 1: {mean_class_1}")
    logging.info(f"Final Prediction: Class {final_prediction}")
    logging.info(f"Confidence Level: {final_confidence}")

    # Generate the final report
    if final_prediction == 0:
        print(f'''Obfuscation Analysis Report

        Thank you for submitting your file for our obfuscation detection analysis. We have completed the examination of your code, and here are the results:
        
        Detection Summary:
        - File name : {new_file_path}
        - Obfuscated Code Detected: No
        - Confidence Level: {1 - final_confidence}
        
        
        Details:
        Our analysis has identified patterns and techniques commonly associated with code obfuscation. The detected obfuscation techniques include:
        
        - String Encoding
        - Variable Renaming
        
        Recommendations:
        If the presence of obfuscated code is unexpected or unauthorized, we recommend a thorough review of your codebase. Obfuscated code can sometimes be an indicator of malicious intent or may simply be a method to protect intellectual property. If this analysis was for security purposes, consider consulting with a cybersecurity expert to understand the implications of the findings.
        
        
        Thank you for using our Obfuscation Detection Service.''')
    else:
        print(f'''Obfuscation Analysis Report

        Thank you for submitting your file for our obfuscation detection analysis. We have completed the examination of your code, and here are the results:
        
        Detection Summary:
        - File name : {new_file_path}
        - Obfuscated Code Detected: Yes
        - Confidence Level: {final_confidence}
        
        
        Details:
        Our analysis has identified patterns and techniques commonly associated with code obfuscation. The detected obfuscation techniques include:
        
        - String Encoding
        - Variable Renaming
        
        Recommendations:
        If the presence of obfuscated code is unexpected or unauthorized, we recommend a thorough review of your codebase. Obfuscated code can sometimes be an indicator of malicious intent or may simply be a method to protect intellectual property. If this analysis was for security purposes, consider consulting with a cybersecurity expert to understand the implications of the findings.
        
        
        Thank you for using our Obfuscation Detection Service.''')
elif selected_model in which_obfuscator_models:
    predictions = []
    confidence_levels = []
    for chunk in X[]:
        prediction = saved_model.predict(np.expand_dims(chunk, axis=0), verbose=0)
        predictions.append(np.argmax(prediction, axis=1)[0])
        confidence_levels.append(prediction[0][np.argmax(prediction, axis=1)[0]])
    
    # Compute the most frequent predicted class
    predicted_class = np.bincount(predictions).argmax()
    confidence_level = np.mean(confidence_levels)
    
    if predicted_class == 0:
        obfuscation_status = "No"
        details = "No significant obfuscation techniques detected."
    elif predicted_class == 1:
        obfuscation_status = "Yes"
        details = "Obfuscation techniques detected: First obfuscator"
    elif predicted_class == 2:
        obfuscation_status = "Yes (Second Level)"
        details = "Advanced obfuscation techniques detected: Second obfuscator"

    print(f'''Obfuscation Analysis Report

    Thank you for submitting your file for our obfuscation detection analysis. We have completed the examination of your code, and here are the results:
    
    Detection Summary:
    - File name : {new_file_path}
    - Obfuscated Code Detected: {obfuscation_status}
    - Confidence Level: {confidence_level}
    
    
    Details:
    {details}
    
    Recommendations:
    If the presence of obfuscated code is unexpected or unauthorized, we recommend a thorough review of your codebase. Obfuscated code can sometimes be an indicator of malicious intent or may simply be a method to protect intellectual property. If this analysis was for security purposes, consider consulting with a cybersecurity expert to understand the implications of the findings.
    
    
    Thank you for using our Obfuscation Detection Service.''')
else:
    logging.error("Invalid model selected. Please choose a valid model for prediction.")
    sys.exit(1)
