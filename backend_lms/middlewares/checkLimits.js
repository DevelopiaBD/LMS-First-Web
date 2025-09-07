const course = require("../model/CourseModel");


module.exports = async(req, res, next) => {

    const user = req.user; // Assuming user info is set by auth middleware
    const existingCourse = await course.find({ instructor: req.user.id });
    console.log(existingCourse.length);

    if( existingCourse.length > 2 ) {
      return res.status(400).json({ message: "You already have 3 courses Limit. Please Contact Admin for Increas Limit" });
    } 

    else{
        req.user = user
        next();
    }
    
}
