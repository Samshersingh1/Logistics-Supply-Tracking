const express = require("express");
const { logger, requestsLogger } = require("./utils/logger.js");   // for showup somewthing in terminals....
const connectDB = require("./config/db.js");      
const cookieParser = require("cookie-parser");   
require("dotenv").config(); 

const app = express();
const port = process.env.PORT || 3000; 

connectDB(); 

app.use(express.json());
app.use(cookieParser()); 
app.use(requestsLogger);

app.use("/", require("./route")); // route.js in root

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
}); 


