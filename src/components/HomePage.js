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
  const [model, setModel] = useState("default"); // Initialize with default model
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

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleRunModel = async (model = "default") => {
    if (file && email) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      formData.append("model", model); // Include the selected model in the form data

      try {
        const response = await axios.post(
          "http://localhost:3001/upLoadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResult(response.data.message);
      } catch (error) {
        console.error("Error uploading file:", error);
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

          <div className="model-select-container">
            <h2>Select Model</h2>
            <select value={model} onChange={handleModelChange} className="form-control">
              <option value="default">Default Model</option>
              <option value="model1">Model 1</option>
              <option value="model2">Model 2</option>
              <option value="model3">Model 3</option>
              {/* Add more models as needed */}
            </select>
          </div>

          <div className="run-model-container">
            <button
              onClick={() => handleRunModel(model)}
              className="btn btn-primary btn-block"
            >
              Run the ML Model with the given file
            </button>
          </div>

          {result && (
            <div className="result-container">
              <h2>Upload Result</h2>
              <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
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
