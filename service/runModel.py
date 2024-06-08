import os
import sys
import numpy as np
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

def preprocess_input_data(data, tokenizer, max_length):
    tokenizer.fit_on_texts(data)
    sequences = tokenizer.texts_to_sequences(data)
    padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post',truncating='post')
    return np.array(padded_sequences)

# Load the saved model
saved_model = load_model('service/obfuscation_detection_model.h5')
dir_path = "server/uploads"
dir = os.listdir(dir_path)
file_name = dir[len(dir)-1]
# Load a new file for prediction
new_file_path = os.path.join(dir_path, file_name)
# new_file_content = [str(open(new_file_path, 'rb').read())]
new_file_content = [str(open(new_file_path, 'rb').read())]
max_length = 856576
# Preprocess the input data
tokenizer = Tokenizer()
new_file_sequences = preprocess_input_data(new_file_content, tokenizer, max_length)

# Make predictions
prediction = saved_model.predict(new_file_sequences)

# Interpret the prediction
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