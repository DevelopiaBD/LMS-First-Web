import React, { useState, useEffect } from "react";
import "./AlertPopUp.css"; // Import CSS file

export const AlertPopUp = ({ type = "success", message = "Default message", show }) => {
  const [visible, setVisible] = useState(show);
  const [count, setCount] = useState(7);

  useEffect(() => {
    setTimeout(() => {
        count===0?setCount(0):setCount(count - 1)
    }, 1000);
  }, [count]);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div className="overlay">
      <div className={`popup ${type}`}>
        <p>{message}</p>
        <p>Redirecting {count}....</p>
        <h2>{type} message</h2>
      </div>

      {/* CSS inline for simplicity */}
      <style>{`
       
      `}</style>
    </div>
  );
};

// export default function App() {
//   const [popup, setPopup] = useState({ show: false, type: "", message: "" });

//   const showAlert = (type, message) => {
//     setPopup({ show: true, type, message });
//   };

//   return (
//     <div style={{ padding: "40px", textAlign: "center" }}>
//       <h1>React Alert Popup Example</h1>
//       <button onClick={() => showAlert("success", "Successfully Saved!")}>
//         Show Success
//       </button>
//       <button onClick={() => showAlert("error", "Something went wrong!")}>
//         Show Error
//       </button>
//       <button onClick={() => showAlert("alert", "Warning! Check again.")}>
//         Show Alert
//       </button>

//       <AlertPopUp type={popup.type} message={popup.message} show={popup.show} />
//     </div>
//   );
// }
