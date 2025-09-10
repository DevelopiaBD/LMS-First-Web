import React, { useState, useRef, useEffect } from "react";
import "./ProfilePage.css";
import { NavLink } from "react-router-dom";
import { useApiContext } from "../../../Utils/ApiContext";

const ProfilePage = ({ userData }) => {
  const { user, UpdateUserProfile } = useApiContext();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Prefill form for update mode
  useEffect(() => {
    if (user) {
      setFormdata({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "***********",
      });
      setProfileImagePreview(user.profileImg || null);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
      setProfileImageFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData বানানো
    const data = new FormData();
    data.append("name", formdata.name);
    data.append("email", formdata.email);
    data.append("phone", formdata.phone);
    if (formdata.password) data.append("password", formdata.password);
    if (profileImageFile) data.append("profileImg", profileImageFile); // Multer field name match

    // API call
    await UpdateUserProfile(data);
  };

  return (
    <div className="DashboradProfileContainer">
      <div className="formDivRegistration">
        <form onSubmit={handleSubmit}>
          <h2>Profile Update</h2>

          {/* Profile Image */}
          <div
            className="profileImageWrapper"
            onClick={triggerFileSelect}
            style={{
              position: "relative",
              width: "120px",
              height: "120px",
              margin: "0 auto 20px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              border: "2px dashed #ccc",
            }}
          >
            {!profileImagePreview && (
              <div
                className="cameraIcon"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem",
                  color: "#888",
                }}
              >
                📷
              </div>
            )}
            {profileImagePreview && (
              <img
                src={profileImagePreview}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {/* Hover overlay */}
            <div
              className="hoverOverlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0,0,0,0.3)",
                color: "#fff",
                fontSize: "2rem",
                opacity: 0,
                transition: "opacity 0.3s",
              }}
            >
              📷
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            name="profileImg"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />

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
          />

          <button type="submit" className="submitReg">
            Update Profile
          </button>

          {/* <div
            className="linkToPrev"
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <p style={{ color: "var(--hyperTheme)" }}>Already Registered?</p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
