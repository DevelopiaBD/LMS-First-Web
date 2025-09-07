const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    // ইউজার লগইন না থাকলেও next() করে দিবে
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.warn("Invalid token but continuing as guest");
  }

  next();
};

module.exports = optionalAuth;
