const express = require("express");
const { logger } = require("./utils/logger");
const router = express.Router();

router.get("/", (req, res) => {
  logger.info("✅ Root route hit");
  res.send("✅ Backend is working");
});

router.use("/auth", require("./routes/AuthRoutes"));
router.use("/product", (req, res) => res.send("Product route placeholder"));
router.use("/order", (req, res) => res.send("Order route placeholder"));
router.use("/web3", (req, res) => res.send("Web3 route placeholder"));

module.exports = router;
