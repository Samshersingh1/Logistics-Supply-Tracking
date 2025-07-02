const express = require("express");
const { logger } = require("./utils/logger");
const router = express.Router();

router.get("/", (req, res) => {
  logger.info("Root route hit");
  res.send("Backend is working");
}); 

router.use("/auth", require("./routes/AuthRoutes"));
router.use("/product", require("./routes/productRoutes"));
router.use("/order", require("./routes/orderRoutes"));
router.use("/web3", require("./routes/web3Routes"));

module.exports = router; 
