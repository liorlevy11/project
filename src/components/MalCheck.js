import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MalCheck({ email, onLogout, onFormSwitch }) {
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

  const handleRunCheck = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      try {
        const response = await axios.post(
          "http://localhost:3001/checkFile",
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
          <h1>Malicious Code Check</h1>
        </header>

        <div className="auth-form-container">
          <div className="file-upload-container">
            <h2>Upload file</h2>
            <input type="file" onChange={handleFileChange} className="form-control" />
          </div>

          <div className="run-check-container">
            <button onClick={handleRunCheck} className="btn btn-primary btn-block">
              Run Malicious Check with the given file
            </button>
          </div>

          {result && (
            <div className="result-container">
              <h2>Check Result</h2>
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
              navigate(`/HomePage?email=${email}`);
              onFormSwitch("HomePage", email);
            }}
            className="btn btn-secondary btn-block"
          >
            Home Page
          </button>
        </footer>
      </div>
    </div>
  );
}

export default MalCheck;
