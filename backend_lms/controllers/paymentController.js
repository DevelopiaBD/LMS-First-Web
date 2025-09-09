const Payment = require("../model/PaymentModel");
const User = require("../model/UserModel");


const createPayment = async (req, res) => {
    try {
        const { student, course, amount, paymentMethod, transactionId, paidAt } = req.body;
        
        
        if (!student || !course || !amount || !paymentMethod || !transactionId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        // addInEnrolled
    const existingStudent = await User.findById(student);

    if(!existingStudent){
        return res.status(401).json({
            message:"Invalid Student, Try Later",
            success:"false"
        })
    }


    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "Transaction already exists" });
    }



    // ✅ Create new payment
    const newPayment = await Payment.create({
      student,
      course,
      amount,
      paymentMethod,
      transactionId,
      paidAt: paidAt ? new Date(paidAt) : Date.now()
    });


    // ✅ Add course to student's enrolledCourses (with `completed: 0`)
    const alreadyEnrolled = existingStudent.enrolledCourses.some(
    (enrollment) => enrollment.courseId.toString() === course.toString()
    );

    if (!alreadyEnrolled) {
    existingStudent.enrolledCourses.push({
        courseId: course,
        completed: 0,
    });
    await existingStudent.save();
    }


    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: newPayment
    });

  } catch (error) {
    console.error("Payment creation failed:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createPayment };
