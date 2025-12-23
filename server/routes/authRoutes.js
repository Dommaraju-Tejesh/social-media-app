const express = require("express");
const router = express.Router();
const { signup, login, enable2FA } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/enable-2fa", protect, enable2FA);

module.exports = router;
