// import React, { useState, useEffect } from "react";
// import "./CalenderView.css";

// const Calendar = () => {
//   // 🔥 Highlighted dates variable at the top (easily reusable)
//   const [highlightedDates, setHighlightedDates] = useState(() => {
//     const saved = localStorage.getItem("highlightedDates");
//     return saved ? JSON.parse(saved) : ["2025-08-23"]; // example default highlight
//   });

//   const [currentDate, setCurrentDate] = useState(new Date());

//   // Sync with localStorage
//   useEffect(() => {
//     localStorage.setItem("highlightedDates", JSON.stringify(highlightedDates));
//   }, [highlightedDates]);

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const weeks = [];
//   let day = 1 - firstDay;

//   // 🔥 Always render 6 weeks → stable height
//   for (let i = 0; i < 6; i++) {
//     const week = [];
//     for (let j = 0; j < 7; j++) {
//       if (day > 0 && day <= daysInMonth) {
//         const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//         week.push(
//           <td
//             key={j}
//             className={`day-cell ${highlightedDates.includes(dateStr) ? "highlight" : ""}`}
//             onClick={() =>
//               setHighlightedDates((prev) =>
//                 prev.includes(dateStr)
//                   ? prev.filter((d) => d !== dateStr)
//                   : [...prev, dateStr]
//               )
//             }
//           >
//             {day}
//           </td>
//         );
//       } else {
//         week.push(<td key={j} className="empty"></td>);
//       }
//       day++;
//     }
//     weeks.push(<tr key={i}>{week}</tr>);
//   }

//   return (
//     <div className="calendar-container">
//       <div className="calendar-header">
//         <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>◀</button>
//         <h2>
//           {currentDate.toLocaleString("default", { month: "long" })} {year}
//         </h2>
//         <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>▶</button>
//       </div>
//       <table className="calendar-table">
//         <thead>
//           <tr>
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//               <th key={d}>{d}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>{weeks}</tbody>
//       </table>
//     </div>
//   );
// };

// export default Calendar;







import React, { useState, useEffect } from "react";
import "./CalenderView.css";

// =========================
// Config & Helpers
// =========================
const pad2 = (n) => String(n).padStart(2, "0");
const toISODate = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const MONTHS = new Intl.DateTimeFormat(undefined, { month: "long" });
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// =========================
// Highlighted dates variable
// =========================
const LOCAL_KEY = "highlightedDates";
let initialHighlights = [];
try {
  const stored = JSON.parse(localStorage.getItem(LOCAL_KEY));
  if (Array.isArray(stored)) initialHighlights = stored;
} catch (_) {}

const Calendar = () => {
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [highlighted, setHighlighted] = useState(new Set(initialHighlights));
  const [datesInput, setDatesInput] = useState("");

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(highlighted)));
  }, [highlighted]);

  // Toggle highlight
  const toggleHighlight = (dateISO) => {
    setHighlighted((prev) => {
      const next = new Set(prev);
      if (next.has(dateISO)) next.delete(dateISO);
      else next.add(dateISO);
      return next;
    });
  };

  // Navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else setViewMonth(viewMonth + 1);
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const applyInputDates = () => {
    const parsed = datesInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
    setHighlighted((prev) => new Set([...prev, ...parsed]));
    setDatesInput("");
  };

  const clearAll = () => setHighlighted(new Set());

  // Render month grid
  const renderCalendar = () => {
    const firstDay = new Date(Date.UTC(viewYear, viewMonth, 1));
    const startWeekday = firstDay.getUTCDay();
    const daysInMonth = new Date(
      Date.UTC(viewYear, viewMonth + 1, 0)
    ).getUTCDate();

    const cells = [];

    // Empty slots
    for (let i = 0; i < startWeekday; i++) {
      cells.push(<div key={`e${i}`} className="cell empty" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateISO = toISODate(viewYear, viewMonth, d);
      const weekday = new Date(Date.UTC(viewYear, viewMonth, d)).getUTCDay();
      const isHighlighted = highlighted.has(dateISO);

      cells.push(
        <div
          key={dateISO}
          className={`cell ${weekday === 0 || weekday === 6 ? "weekend" : ""} ${
            isHighlighted ? "highlight" : ""
          }`}
          onClick={() => toggleHighlight(dateISO)}
        >
          <div className="date-num">
            {d}
            {viewYear === today.getFullYear() &&
              viewMonth === today.getMonth() &&
              d === today.getDate() && <span className="today-dot" />}
          </div>
          <div className="meta">{isHighlighted ? "" : ""}</div>
        </div>
      );
    }

    return cells;
  };

  const title = `${MONTHS.format(new Date(Date.UTC(viewYear, viewMonth, 1)))} ${
    viewYear
  }`;

  return (
    <div className="calendar-wrap">
      <header className="cal-header">
        <div className="cal-nav">
          <button className="btn btn-icon" onClick={prevMonth}>
            ⟨
          </button>
          <button className="btn btn-icon" onClick={goToday}>
            ●
          </button>
          <button className="btn btn-icon" onClick={nextMonth}>
            ⟩
          </button>
        </div>
        <div className="cal-title">{title}</div>
      </header>

      <div className="cal-body">
        <section className="month-grid">
          <div className="weekday-row">
            {WD.map((w) => (
              <div key={w} className="weekday">
                {w}
              </div>
            ))}
          </div>
          <div className="day-grid">{renderCalendar()}</div>
        </section>

        <aside className="legend">
          <h3>Highlights</h3>
          {/* <small>
            Click days to toggle highlight. Paste dates (YYYY-MM-DD) separated by
            comma/space/newline.
          </small> */}
          <div className="tagsDiv">
            {Array.from(highlighted).length === 0 ? (
              <div className="tag">No highlighted dates</div>
            ) : (
              Array.from(highlighted)
                .sort()
                .map((d) => (
                  <div
                    key={d}
                    className="tag"
                    onClick={() => toggleHighlight(d)}
                  >
                    {d}
                  </div>
                ))
            )}
          </div>
          <textarea
            className="dates-input"
            value={datesInput}
            onChange={(e) => setDatesInput(e.target.value)}
          />
          <button className="btn" onClick={applyInputDates}>
            Apply Dates
          </button>
          <button className="btn danger" onClick={clearAll}>
            Clear All
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Calendar;
