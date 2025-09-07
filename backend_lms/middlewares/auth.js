const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");



const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Incoming token:", token);
  // console.log(token);
  
  if (!token){ 
    return res.status(401).json({ message: "No token, auth denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", isValidObjectId(decoded.id));

    req.user = decoded;

    next();


  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", tokenExpired: true });
    }
    res.status(401).json({ message: "Token invalid", error: err.message });
  }
};



// const checkToken = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     req.user=null;
//     next();

//   }
//   else{
    
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Token invalid", error: err.message });
//   }
//   }
// };



module.exports={
  auth
}