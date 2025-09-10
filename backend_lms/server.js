const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes")
const courseRoutes = require("./routes/courseRoutes")
const lectureRoutes = require("./routes/lectureRoutes")
// const uploadRoutes = require("./routes/uploadRoutes")





const app = express();


// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Catch uncaught exceptions (synchronous errors)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  // Optionally exit process if needed
  // process.exit(1);
});

// Catch unhandled promise rejections (async errors)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});



const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // frontend URL
  credentials: true,               // cookies allow
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],    // allowed headers
};

app.use(cors(corsOptions));


// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));



// Routes
// Preflight OPTIONS request handle
// app.options("*", cors(corsOptions));

app.use("/api/auth", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/payments", paymentRoutes);




// app.use("/api/upload", uploadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${process.env.PORT}`);
});















// const dotenv = require("dotenv");
// dotenv.config();

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");

// const paymentRoutes = require("./routes/paymentRoutes");
// const userRoutes = require("./routes/userRoutes");
// const courseRoutes = require("./routes/courseRoutes");
// const lectureRoutes = require("./routes/lectureRoutes");

// const app = express();

// // -------------------------
// // Middlewares
// // -------------------------

// // JSON parser (works globally for APIs)
// app.use(express.json());

// // Logger
// app.use(morgan("dev"));

// // Cookies
// app.use(cookieParser());

// // ❌ Remove global urlencoded for large uploads
// // Small forms: add per route if needed

// // -------------------------
// // Error handlers for uncaught exceptions & unhandled promise rejections
// // -------------------------
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err.message);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// // -------------------------
// // CORS Config
// // -------------------------
// const corsOptions = {
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
// app.use(cors(corsOptions));

// // -------------------------
// // MongoDB Connect
// // -------------------------
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.error(err));

// // -------------------------
// // Routes
// // -------------------------

// // Small HTML form submissions (urlencoded) only on specific routes
// // Example: login route
// // app.use("/api/auth/login", express.urlencoded({ extended: true }));

// // File uploads (like lectures) → handled entirely by multer
// app.use("/api/auth", userRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/lectures", lectureRoutes);
// app.use("/api/payments", paymentRoutes);

// // -------------------------
// // Start server
// // -------------------------
// app.listen(process.env.PORT, () => {
//   console.log(`🚀 Server running on port http://localhost:${process.env.PORT}`);
// });

