import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage({ onLogout }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", { email });
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRunModel = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email); // Include the email in the form data

      try {
        const response = await axios.post('http://localhost:3001/upLoadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResult(response.data.message); // Assuming the response contains a message
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      alert("Please select a file to upload ");
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <header className="header-container">
          <h1>Detect an Obfuscated Code</h1>
        </header>
  
        <div className="auth-form-container">
          <div className="file-upload-container">
            <h2>Upload file</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
  
          <div className="run-model-container">
            <button
              onClick={handleRunModel}
              className="btn btn-primary btn-block"
            >
              Run the ML Model with the given file
            </button>
          </div>
  
          {result && (
            <div className="result-container">
              <h2>Upload Result</h2>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
            </div>
          )}
        </div>
  
        <footer className="footer-container">
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-block"
          >
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;