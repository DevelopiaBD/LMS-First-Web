import React, { useState, useEffect } from "react";

const PageFadeWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow CSS transition to kick in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`pageFade ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
};

export default PageFadeWrapper;
