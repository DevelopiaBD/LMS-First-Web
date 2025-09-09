const User = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Course = require("../model/CourseModel");
const dotenv = require("dotenv");
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);


const userRegistration = async (req, res) => {
  try {
    const { name, email, password , phone} = req.body;

    console.log("User Registration Data:", { name, email, password: "HIDDEN" });

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10); // cost factor 10
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      phone, // Assuming phone is a field in your User schema
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone, // Include phone if needed
        // Don't return password in response
      }
    });

  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};










// 

// -----------------------------
// LOGIN CONTROLLER
// -----------------------------
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Payload for JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Access Token (short lived)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2d", // expires in 30 sec
    });

    // Refresh Token (long lived)
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Send Refresh Token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production" ? true : false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message});
  }
};




// -----------------------------
// REFRESH TOKEN CONTROLLER
// -----------------------------
const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token, please login" });
    }

    // Verify Refresh Token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Create new access token
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2d", // আবার ছোট টাইম
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};





const getUserProfile = async(req, res)=>{
  try {
    console.log(req.user);
    
    res.status(200).json({
      user: req.user,
      message:"User Data Fetched Successfully"
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message:"User Data Fetch Error"
    })
    
  }
}


const checkCourseAccess = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const AccessVerify = await User.findById(user.id);

    if (!AccessVerify || !AccessVerify.enrolledCourses || AccessVerify.enrolledCourses.length === 0) {
      return res.status(403).json({ message: "No courses enrolled yet" });
    }

    const hasAccess = AccessVerify.enrolledCourses.some(
      (course) => course.courseId.toString() === courseId
    );

    if (!hasAccess) {
      return res.status(403).json({ message: "You do not have access to this course" });
    }

    console.log( "laqjxdlknhqsc sxdmn dlk .................",hasAccess);
    

    res.status(200).json({
      message: "Access verified",
      verify: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error verifying course access",
      error: error.message,
    });
  }
};






const logoutUser = (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true if in production + HTTPS
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};



module.exports = {
  userRegistration,
  userLogin,
  refreshToken,
  getUserProfile,
  checkCourseAccess,
  logoutUser
};
