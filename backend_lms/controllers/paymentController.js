const Payment = require("../model/PaymentModel");
const User = require("../model/UserModel");

const createPayment = async (req, res) => {
  try {
    const { student, course, amount, paymentMethod, transactionId, paidAt } = req.body;

    console.log("🔹 Incoming payment data:", { student, course, amount, paymentMethod, transactionId });

    // 1️⃣ Field validation
    if (!student || !course || !amount || !paymentMethod || !transactionId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2️⃣ Check if student exists
    const existingStudent = await User.findById(student);
    if (!existingStudent) {
      return res.status(401).json({ success: false, message: "Invalid Student, Try Later" });
    }
    console.log("✅ Student found:", existingStudent._id, existingStudent.role);

    // 3️⃣ Check if student already paid for this course
    const existingPayment = await Payment.findOne({ student, course });
    if (existingPayment) {
      return res.status(400).json({ success: false, message: "Already Enrolled, Check Dashboard" });
    }

    // 4️⃣ Create new Payment
    const newPayment = new Payment({
      student,
      course,
      amount,
      paymentMethod,
      transactionId,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
    });

    let savedPayment;
    try {
      savedPayment = await newPayment.save();
      console.log("✅ Payment saved:", savedPayment._id);
    } catch (err) {
      if (err.code === 11000 && err.keyPattern?.transactionId) {
        return res.status(400).json({
          success: false,
          message: "Transaction ID already exists. Please use a unique one.",
        });
      }
      return res.status(400).json({ success: false, message: "Payment save failed", error: err.message });
    }

    // 5️⃣ Enroll course if not already
    const alreadyEnrolled = existingStudent.enrolledCourses.some(
      (enrollment) => enrollment.courseId.toString() === course.toString()
    );

    if (!alreadyEnrolled) {
      // 🔹 Auto fill phone if missing
      if (!existingStudent.phone) {
        existingStudent.phone = "N/A"; // শুধু empty হলে set হবে
      }

      existingStudent.enrolledCourses.push({ courseId: course, completed: 0 });
      await existingStudent.save();
      console.log("✅ Student enrolledCourses updated");
    } else {
      console.log("ℹ️ Student already enrolled in this course, skipping update");
    }

    // 6️⃣ Return success
    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment: savedPayment,
    });

  } catch (error) {
    console.error("❌ Payment creation failed:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createPayment };
