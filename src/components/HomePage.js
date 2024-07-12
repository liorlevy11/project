import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage({ email, onLogout, onFormSwitch }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [model, setModel] = useState("default");
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

  const handleRunModel = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      formData.append("model", model);

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

        if (response.data.message === null) {
          setResult("The file upload returned null result");
        } else {
          setResult(response.data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      alert("Please select a file to upload");
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
            <input type="file" onChange={handleFileChange} className="form-control" />
          </div>

          <div className="model-select-container">
            <h2>Select Model</h2>
            <select value={model} onChange={handleModelChange} className="form-control">
              <option value="default">Default Model</option>
              <option value="model1">Model 1</option>
              <option value="model2">Model 2</option>
              <option value="model3">Model 3</option>
            </select>
          </div>

          <div className="run-model-container">
            <button onClick={handleRunModel} className="btn btn-primary btn-block">
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
          <button onClick={handleLogout} className="btn btn-secondary btn-block">
            Logout
          </button>
          <button
            onClick={() => {
              navigate(`/MalCheck?email=${email}`);
              onFormSwitch("MalCheck", email);
            }}
            className="btn btn-secondary btn-block"
          >
            Malicious Check
          </button>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
