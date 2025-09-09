const express = require("express");
const { createPayment } = require("../controllers/paymentController");

const router = express.Router();

// Create a payment
router.post("/", createPayment);

module.exports = router;
