const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "No token, unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -twoFactorSecret"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 🚫 Global ban check
    if (user.isBanned) {
      return res.status(403).json({
        message: "Account banned",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);

    res.status(401).json({
      message: "Token invalid",
    });
  }
};

module.exports = { protect };