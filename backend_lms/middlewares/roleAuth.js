// role.js
// Usage: pass allowed roles array like ["admin", "instructor"]

const roleAuth =(allowedRoles = [])=> {
  return (req, res, next) => {
    // req.user আগেই auth middleware থেকে আসবে
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }
    
    console.log("This Is roll selecting", req.user);
        

    const userRole = req.user.role;

    // if(userRole==="instructor" && req.user.enrolledCourses?.length === 0 || req.user.enrolledCourses === 0) { 
    //   return res.status(403).json({ message: "Forbidden: You cannot access this resource" });
    // } 


    // যদি allowedRoles array খালি থাকে → সব রোল access পাবে
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
  };
};


module.exports = roleAuth
