const express = require("express");  // this is frame work to build api 
const { logger } = require("../utils/logger");  // this is to print something to the log
const { authorize } = require("../middleware/authMiddleware");  // this is middle t check wheter the user is valid or not before passing to any route 
const router = express.Router(); // this hepls to make route 
const upload = require('../middleware/uploadMiddleware');  // Multer middleware to handle file uploads, specifically images
// Uses memory storage (RAM) for uploaded files 

logger.info("Request to productRoutes.js has entered");

router.post(
    "/addProduct",  // endpoint for the fronted to visit
    authorize, //cheack the middleware
    upload.single('image'), // Accepts a single file with form field name `image`
    require("../controllers/productController").addProduct  // set the route to the file name 
);    

router.get(
  "/getProducts",
  authorize,
  require("../controllers/productController").getProducts
);

logger.info("Request to productRoutes.js has exited");

module.exports = router;
