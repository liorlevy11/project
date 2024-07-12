import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import MalCheck from "./components/MalCheck";
import "./App.css";

function App() {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");

  const toggleForm = (formName, email) => {
    setCurrentForm(formName);
    setEmail(email);
  };

  const handleLogout = () => {
    setCurrentForm("login");
    setEmail("");
  };

  const renderForm = () => {
    if (currentForm === "login") {
      return <Login onFormSwitch={toggleForm} />;
    } else if (currentForm === "register") {
      return <Register onFormSwitch={toggleForm} />;
    } else if (currentForm === "HomePage") {
      return <HomePage email={email} onLogout={handleLogout} onFormSwitch={toggleForm} />;
    } else if (currentForm === "MalCheck") {
      return <MalCheck email={email} onLogout={handleLogout} onFormSwitch={toggleForm} />;
    } else {
      console.log("Invalid form name");
      return <div>Invalid form name</div>;
    }
  };

  return <div className="App">{renderForm()}</div>;
}

export default App;
