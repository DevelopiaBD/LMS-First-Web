import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiContext } from "../../../Utils/ApiContext";
import "./PaymentForm.css";
import { AlertPopUp } from "../../../Utils/AlertPopUp";
import LoadingAnim from "../LoadingAnim";
import ErrorIndicates from "../ErrorIndicates";

const PaymentForm = () => {
  const { id: courseId } = useParams();
  const { user, singleCourseData, GetSingleCourse, createPayment, ApiLoading, ApiError } =
    useApiContext();

  // যদি লগইন করা না থাকে
  if (!user?._id) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000);
    return (
      <AlertPopUp
        type="error"
        message="Please Register First. If already registered then login."
        show={true}
      />
    );
  }

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    amount: "",
    paymentMethod: "bkash",
    transactionId: "",
  });

  useEffect(() => {
    GetSingleCourse(courseId);
  }, [courseId]);

  useEffect(() => {
    if (user && singleCourseData) {
      setFormData({
        student: user._id || "",
        course: courseId || "",
        amount: singleCourseData?.price || "",
        paymentMethod: "bkash",
        transactionId: "", // user input দেবে
      });
    }
  }, [user, singleCourseData, courseId]);

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup({ show: false, type: "", message: "" });

    try {
      const res = await createPayment(formData);

      if (res.ok && res.success) {
        setPopup({ show: true, type: "success", message: res.message || "Payment successful ✅" });
      } else {
        setPopup({ show: true, type: "error", message: res.message || "Payment failed ❌" });
      }
    } catch (err) {
      setPopup({ show: true, type: "error", message: "Payment failed ❌" });
    } finally {
      setLoading(false);
    }
  };


  useEffect(()=>{

    if(popup.type==="success"){
      const timer = setTimeout(() => {
        window.location.href = "/dashboard/";
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [popup.type])

  if (ApiLoading) {
    return <LoadingAnim />;
  }

  if (ApiError) {
    return <ErrorIndicates />;
  }

  return (
    <div className="payment-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <h2 className="payment-title">Complete Your Payment</h2>

        <div className="payment-field">
          <label>Student ID</label>
          <input type="text" name="student" value={formData.student} readOnly />
        </div>

        <div className="payment-field">
          <label>Course ID</label>
          <input type="text" name="course" value={formData.course} readOnly />
        </div>

        <div className="payment-field">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="payment-field">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
          </select>
        </div>

        <div className="payment-field">
          <label>Transaction ID</label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            placeholder="Enter transaction ID"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="payment-btn">
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>

      {/* Popup dynamically show হবে */}
      {popup.show && <AlertPopUp type={popup.type} message={popup.message} show={popup.show} />}
    </div>
  );
};

export default PaymentForm;
