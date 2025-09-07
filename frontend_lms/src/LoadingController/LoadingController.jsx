import React, { useEffect, useState } from 'react';
import "./LoadingController.css"
import spinner from "/svgs/spinner.svg"
import check from "/svgs/check.svg"
import exclamation from "/svgs/exclamation.svg"

const LoadingController = ({ load = false, error = false, success = false, text }) => {
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    if (success || error) {
      setShowIcon(true);
      const timer = setTimeout(() => setShowIcon(false), 3000); // ৩ সেকেন্ড পরে টেক্সটে ফেরত
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  let content = null;

  if (load) {
    content = <img src={spinner} className="loadingSpin" alt="loading" />;
  } else if (success && showIcon) {
    content = <img src={check} className="checkSpin" alt="success" />;
  } else if (error && showIcon) {
    content = <img src={exclamation} className="errorSpin" alt="error" />;
  } else {
    content = <span>{text}</span>;
  }

  return <div className="LoadingController">{content}</div>;
};

export default LoadingController;
