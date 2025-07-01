const express = require("express");
const { logger } = require("../utils/logger");
const { authorize } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const router = express.Router();

logger.info("Request to authRoutes has entered");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/profile", authorize, authController.getProfile);

logger.info("Request to authRoutes has exited");

module.exports = router;
