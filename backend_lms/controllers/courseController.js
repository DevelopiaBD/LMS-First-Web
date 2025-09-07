const Course = require('../model/CourseModel');
const Payment = require('../model/PaymentModel');
const User = require('../model/UserModel');
const { cloudinary } = require('../utils/cloudinary'); // ✅ Cloudinary utils import

// -------------------------
// Get all courses
// -------------------------
const AllCoureses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// -------------------------
// Update course by ID
// -------------------------
const updateCourseById = async (req, res) => {
  try {
    console.log("Your Request To Body", req.body);

    const courseId = req.params.courseId;
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    let thumbnailUrl = existingCourse.thumbnail;
    let thumbnailPublicId = existingCourse.thumbnailPublicId || "";

    if (req.file) {
      // পুরোনো thumbnail থাকলে Cloudinary থেকে ডিলিট করুন
      if (thumbnailPublicId) {
        await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" });
      }

      // Cloudinary নতুন ইমেজ স্টোর করলে path = secure_url, filename = public_id
      thumbnailUrl = req.file.path;
      thumbnailPublicId = req.file.filename;
      console.log("Uploaded New Thumbnail:", req.file);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: {
          ...req.body,
          instructor: {
            id: existingCourse.instructor.id,
            name: req.body.name
          },
          learningTags: req.body.learningTags.split(","),
          thumbnail: thumbnailUrl,
          thumbnailPublicId: thumbnailPublicId
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Updated Course Successfully",
      data: updatedCourse,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Serverside Error In Updating Course",
      error: error.message,
      success: false,
    });
  }
};

// -------------------------
// Create a new course
// -------------------------
const createCoureses = async (req, res) => {
  try {
    const { title, description, price, category, level, name, learningTags, ratings } = req.body;

    console.log(learningTags.split(","));

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        message: "User is not valid"
      });
    }

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const arrayOfTags = learningTags.split(",") || [];

    let thumbnailUrl = "";
    let thumbnailPublicId = "";
    if (req.file) {
      thumbnailUrl = req.file.path;       // secure_url
      thumbnailPublicId = req.file.filename; // public_id
    }

    const newCourse = new Course({
      title,
      description,
      ratings,
      learningTags: arrayOfTags,
      category: category || "",
      level: level || "Beginner",
      price,
      thumbnail: thumbnailUrl,
      thumbnailPublicId: thumbnailPublicId, // ✅ নতুন ফিল্ড
      instructor: {
        id: req.user.id,
        name: name
      },
      isApproved: false
    });

    const course = await newCourse.save();

    user.enrolledCourses.push({
      courseId: course._id,
      completed: 0,
    });

    const updateUser = await user.save();

    res.status(201).json({
      message: "Course created successfully",
      success: true,
      course: newCourse,
      updateUser
    });

  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({ message: "Error creating course", error: error.message, success: false });
  }
};

// -------------------------
// Get course by ID
// -------------------------
const getCourseById = async (req, res) => {
  try {
    console.log(req.user);

    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("lectures", "title order _id isFree notes");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
};

// -------------------------
// Get courses by Instructor
// -------------------------
const getCourseByInstructor = async (req, res) => {
  try {
    console.log("The Instructor: " + req.user.role);

    const course = await Course.find({ "instructor.id": req.user.id });

    res.status(200).json({
      message: "Course Datas",
      course
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Instructor Courses", error: error.message });
  }
};

// -------------------------
// Approve course
// -------------------------
const approveCourse = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("My Request Body", req.body);

    const courseVerify = await Course.findById(id);

    if (!courseVerify) {
      return res.status(404).json({
        message: "No Course Found"
      });
    }

    const updatedCOurse = await Course.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: req.body.isApproved
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Course Approved Successfully",
      success: true,
      updatedCOurse
    });

  } catch (error) {
    res.status(500).json({
      message: "Server side Approve Course Problem",
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  AllCoureses,
  createCoureses,
  getCourseById,
  getCourseByInstructor,
  updateCourseById,
  approveCourse,
};
