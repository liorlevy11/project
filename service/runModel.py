import os
import sys
import numpy as np
import logging
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Logging configuration, DO NOT REMOVE
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def preprocess_input_data(data, tokenizer, max_length):
    tokenizer.fit_on_texts(data)
    sequences = tokenizer.texts_to_sequences(data)
    padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post', truncating='post')
    return np.array(padded_sequences)


# Define a dictionary mapping model names to their file paths
model_paths = {
    "default": "obfuscation_detection_model.h5", # Default model to use if no valid model is selected
    "model1": "model1.h5",
    "model2": "model2.h5",
    "model3": "model3.h5"
}

is_obfuscated_models = {"default", "model1"}
which_obfuscator_models = {"model2", "model3"}

print("Starting model prediction script")

# Parse command-line arguments to get the selected model
selected_model = sys.argv[1] if len(sys.argv) > 1 else "default"

print(f"Selected model: {selected_model}")

# Load the corresponding saved model based on the selected model
model_path = model_paths.get(selected_model, model_paths["default"])
print(f"Loading model from: {model_path}")

# Load the saved model
saved_model = load_model(model_path)

# Get the most recent file in the 'uploads' directory
dir_path = "server/uploads"
try:
    dir_files = os.listdir(dir_path)
    if not dir_files:
        raise FileNotFoundError("No files found in the uploads directory.")
    file_name = dir_files[-1]
    new_file_path = os.path.join(dir_path, file_name)
    print(f"Loading file for prediction: {new_file_path}")
except Exception as e:
    logging.error(f"Error accessing uploads directory: {e}")
    sys.exit(1)

# Load the file content for prediction
try:
    with open(new_file_path, 'rb') as file:
        new_file_content = [str(file.read())]
except Exception as e:
    print(f"Error reading file: {e}")
    sys.exit(1)

max_length = 856576
# Preprocess the input data
tokenizer = Tokenizer()
new_file_sequences = preprocess_input_data(new_file_content, tokenizer, max_length)
print("Preprocessed input data")

# Make predictions
prediction = saved_model.predict(new_file_sequences)
print(f"Prediction: {prediction}")

# Interpret the prediction
if selected_model in is_obfuscated_models:
  if prediction >= 0.5:
      print(f'''Obfuscation Analysis Report

        Thank you for submitting your file for our obfuscation detection analysis. We have completed the examination of your code, and here are the results:
        
        Detection Summary:
        - File name : {file_name}
        - Obfuscated Code Detected: Yes
        - Confidence Level: {prediction[0][0]}
        
        
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
        - File name : {file_name}
        - Obfuscated Code Detected: No
        - Confidence Level: {1-prediction[0][0]}
        
        
        Details:
        Our analysis has identified patterns and techniques commonly associated with code obfuscation. The detected obfuscation techniques include:
        
        - String Encoding
        - Variable Renaming
        
        Recommendations:
        If the presence of obfuscated code is unexpected or unauthorized, we recommend a thorough review of your codebase. Obfuscated code can sometimes be an indicator of malicious intent or may simply be a method to protect intellectual property. If this analysis was for security purposes, consider consulting with a cybersecurity expert to understand the implications of the findings.
        
        
        Thank you for using our Obfuscation Detection Service.''')
elif selected_model in which_obfuscator_models:
    #idk how u implemented it so i just put it here as a placeholder example
    if prediction == 2:
        print(f'''Obfuscation Analysis Report

        Thank you for submitting your file for our obfuscation detection analysis. We have completed the examination of your code, and here are the results:
        
        Detection Summary:
        - File name : {file_name}
        - Obfuscation Technique Detected: Obfuscator 2
        
        Details:
        Our analysis has identified patterns and techniques specific to Obfuscator 2. This obfuscation technique is known for:
        
        - String Encryption
        - Control Flow Obfuscation
        
        Recommendations:
        Understanding the specific obfuscation technique used can help in devising strategies to deobfuscate the code. If you are looking to reverse-engineer or analyze the code further, consider researching methods to reverse the effects of Obfuscator 2. Additionally, consulting with a cybersecurity expert or reverse-engineering specialist can provide valuable insights into the deobfuscation process.
        
        
        Thank you for using our Obfuscation Detection Service.''')
else:
    print("Invalid model selected. Please choose a valid model for prediction.")
    sys.exit(1)

