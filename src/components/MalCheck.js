import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function MalCheck({ onLogout, onFormSwitch }) {
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

  const handleRunCheck = async () => {
    if (file && email) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);
      console.log("formData", formData.get("file"));
      console.log("formData", formData.get("email"));

      try {

        const response = await fetch("http://localhost:3001/upLoadFileForMalCheck", {
          method: "POST",
          /*headers: {
            "Content-Type": "multipart/form-data",
          },*/
          body: formData,
        });
        const data = await response.json();
        setResult(data.message);
        if (!response.ok) {
          setResult("The file upload returned null result");
        } else {
          setResult(data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        if (!error?.response) {
          console.log("No Server Response");
        }
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
