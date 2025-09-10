import React, { useState } from "react";
import "./Login.css";
import { NavLink } from "react-router-dom";
import { useApiContext } from "../../../../Utils/ApiContext";

const Login = () => {

  const {UserLogin} = useApiContext();

  const [logingData, setlogingData] = useState({
    email: "admin@gmail.com",
    password: "admin",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setlogingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", logingData);

    UserLogin(logingData);
    // No API call — just local handling
  };

  return (
    <div className="loginMain">
      <div className="formDivLogin">
        <form onSubmit={handleSubmit}>
          <h2>Log In</h2>

          <input
            type="email"
            name="email"
            onChange={handleInputChange}
            value={logingData.email}
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            value={logingData.password}
            placeholder="Password"
            required
          />

          <button type="submit" className="submitBtn">
            Submit
          </button>

          <div
            className="linkToPrev"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginTop: "1rem",
            }}
          >
            <p className="noAccountP" style={{ color: "var(--hyperTheme)" }}>No Account?</p>
            <NavLink to="/registration">Register now</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
