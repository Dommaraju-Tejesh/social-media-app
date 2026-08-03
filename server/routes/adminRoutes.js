const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

const { banUser, unbanUser } = require("../controllers/adminController");

// Ban User
router.put("/users/:id/ban", protect, banUser);

// Unban User
router.put("/users/:id/unban", protect, unbanUser);

// GET Admin Dashboard
router.get("/dashboard", protect, getDashboard);

module.exports = router;
