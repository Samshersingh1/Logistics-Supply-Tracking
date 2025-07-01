const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/AsyncHandling");
const { createResponse } = require("../utils/ResponseHandling");
const User = require("../models/User");

const authorize = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return createResponse(res, 401, "Not authorized, no token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

module.exports = { authorize };
