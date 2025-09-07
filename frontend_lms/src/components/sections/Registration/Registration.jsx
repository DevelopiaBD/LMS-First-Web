import React, { useState } from "react";
import "./Registration.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useApiContext } from "../../../../Utils/ApiContext";

const Registration = () => {
  const { UserRegistration } = useApiContext();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration form submitted:", formdata);
    
    UserRegistration(formdata)
    
  };

  return (
    <div className="RegistrationContainer">
      <div className="formDivRegistration">
        <form onSubmit={handleSubmit}>
          <h2>Registration Form</h2>

          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            value={formdata.name}
            placeholder="Name"
            required
          />

          <input
            type="email"
            name="email"
            onChange={handleInputChange}
            value={formdata.email}
            placeholder="Email"
            required
          />

          <input
            type="tel"
            name="phone"
            onChange={handleInputChange}
            value={formdata.phone}
            placeholder="Phone"
            minLength={11}
            required
          />

          <input
            type="password"
            name="password"
            onChange={handleInputChange}
            value={formdata.password}
            placeholder="Password"
            required
          />

          <button type="submit" className="submitReg">
            Submit
          </button>

          <div
            className="linkToPrev"
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <p style={{ color: "var(--hyperTheme)" }}>Already Registered?</p>
            <NavLink to="/login">Login now</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
