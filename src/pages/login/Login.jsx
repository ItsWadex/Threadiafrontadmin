import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axios from "axios";

function Login() {
  const [loginData, setLoginData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    axios
      .post("/api/admin/login", loginData)
      .then((response) => {
        console.log(response);
        if (response.data.status) {
          setErrorMessage("");
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("isAdmin", response.data.data.isAdmin);
          localStorage.setItem("isLoggedIn", response.data.data.isLoggedIn);
          localStorage.setItem("isSubAdmin", response.data.data.isSubAdmin);
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setErrorMessage("Invalid email or password");
        }
      })
      .catch((error) => {
        setErrorMessage("Invalid email or password");
      });
  }

  return (
    <div id="login-page">
      <nav className="navbar">
        <h1>Threadia</h1>
      </nav>
      <div id="Login-box">
        <h1>Admin Login Page</h1>
        <form
          onChange={(e) =>
            setLoginData({ ...loginData, [e.target.name]: e.target.value })
          }
        >
          <input name="email" type="email" placeholder="Email" />
          <div className="password-container">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="password-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button onClick={handleLogin} type="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
