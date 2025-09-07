const express = require("express");
const { userRegistration, userLogin, checkCourseAccess, refreshToken, getUserProfile, logoutUser } = require("../controllers/userController");
const {auth} = require("../middlewares/auth")
// const roleAuth = require("../middlewares/roleAuth")
const router = express.Router();



// Registser User
router.get("/user/profile", auth, getUserProfile);
// router.get("/instructor")

router.get("/:courseId/verify/", auth, checkCourseAccess)



router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);



// Admin ROute...................
// router.post("/")


module.exports = router;