 const express = require("express");
const router = express.Router();
const {AllCoureses, createCoureses, getCourseById, getCourseByInstructor, updateCourseById, approveCourse} =  require('../controllers/courseController.js');
const roleAuth = require("../middlewares/roleAuth.js");
const {auth, checkToken} = require("../middlewares/auth.js");
const { upload } = require("../utils/cloudinary.js");
// const checkLimits = require("../middlewares/checkLimits.js");



// student course Get All Courses

router.get("/instructor", auth, roleAuth(['instructor', 'admin']), getCourseByInstructor)
router.get("/", AllCoureses)
router.get("/:id", getCourseById)
router.put("/update/:courseId", auth, roleAuth(['instructor', 'admin']),  upload.single("thumbnail"), updateCourseById)


// , roleAuth(['instructor']),
router.post("/create", auth,  roleAuth(['instructor', 'admin']), upload.single("thumbnail"), createCoureses)
router.post("/update-my-classes", auth,  roleAuth(['instructor', 'admin']), upload.single("thumbnail"), createCoureses)


// Admin Router
router.post("/approve/:id", auth, roleAuth(["admin"]), approveCourse)


router



module.exports = router;