const express = require("express");
const router = express.Router();

const { CreateLectureVideo, getSignedVideoUrlUserLecture, getLecturesForInstructor, updateLectureVideo, deleteLectureVideo, deleteTrushVideos } = require("../controllers/lectureController");
const { upload } = require("../utils/cloudinary");
const roleAuth = require("../middlewares/roleAuth");
const {auth} = require("../middlewares/auth");
const optionalAuth = require("../middlewares/authVideo");

// auth, roleAuth(['instructor', 'admin', 'student'])


router.get("/delete/trush", (req, res)=>{res.status(200).json({message:"Delete Trush ........."})});

router.get("/:lectureId/instructor/:courseId", auth, roleAuth(['instructor', 'admin']), getLecturesForInstructor )
router.get("/:id/:courseid/stream", optionalAuth, getSignedVideoUrlUserLecture);

router.put("/update/:lectureId", auth, roleAuth(['instructor', 'admin']), updateLectureVideo);
router.post("/create", auth, roleAuth(['instructor', 'admin']), upload.single("video"), CreateLectureVideo);

router.delete("/delete/trush", auth, deleteTrushVideos);
router.delete("/delete/:id", auth, roleAuth(['instructor', 'admin']), deleteLectureVideo);
// auth, roleAuth(['instructor', 'admin']),


module.exports = router;