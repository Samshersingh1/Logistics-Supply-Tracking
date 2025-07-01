const asyncHandler = require("../utils/AsyncHandling");
const { logger } = require("../utils/logger");
const { createResponse } = require("../utils/ResponseHandling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = asyncHandler(async (req, res) => {
  const { name, username, email, password, city, category } = req.body;

  if (await User.findOne({ email })) {
    return createResponse(res, 400, "Email already exists");
  }
  if (await User.findOne({ username })) {
    return createResponse(res, 400, "Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name, username, email, password: hashedPassword, city, category
  });

  return createResponse(res, 201, "User Registered successfully", user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return createResponse(res, 400, "Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    city: user.city,
    category: user.category
  };

  return createResponse(res, 200, "User logged in", { user: userWithoutPassword });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return createResponse(res, 200, "User logged out");
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return createResponse(res, 404, "User not found");
  return createResponse(res, 200, "Profile fetched", { user });
});

module.exports = { signup, login, logout, getProfile };
