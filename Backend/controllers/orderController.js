const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/AsyncHandling");
const { logger } = require("../utils/logger");
const { downloadFile, uploadFile } = require("../utils/PinataHandling");
const { createResponse } = require("../utils/ResponseHandling"); 



const addOrder = asyncHandler(async (req, res) => {
  logger.info("Request to addOrder has entered");
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    logger.error("Product ID and quantity are required");
    return createResponse(res, 400, "Product ID and quantity are required", [], false);
  }

  logger.info("Checking if product exists");
  if (!(await Product.findById(productId))) {
    logger.error("Product does not exist");
    return createResponse(res, 404, "Product does not exist", [], false);
  }
  logger.info("Product exists");

  logger.info("Checking if user is a buyer");
  if (req.user.category !== "Buyer") {
    logger.error("Only buyers can add orders");
    return createResponse(res, 403, "Only buyers can add orders", [], false);
  }
  logger.info("User is a buyer");

  logger.info("Adding order to database with pending status"); 
  const buyer = req.user.id;
  const product = await Product.findById(productId); 
  if(product.quantityAvailable<quantity){
       logger.info("there are not sufficient unit availble for this Product");   
       return  createResponse(res, 403, "Not Availble to this quantity", [], false); 
  }    
   product.quantityAvailable-=quantity; // update the product availblity..
   awit product.save(); // save the updates...

  const order = await Order.create({
    product,
    quantity,
    buyer,
    seller: product.seller,
    deliveryAdmin: product.deliveryAdmin,
    current_owner: product.seller,
  }); 
  logger.info("Order added successfully");

  logger.info("Updating Delivery admin's order entries");
  const deliveryAdmin = await User.findById(product.deliveryAdmin);
  deliveryAdmin.product_request_queue.push(order._id);
  await deliveryAdmin.save();
  logger.info("Order request made to delivery Admin successfully");

  return createResponse(res, 201, "Order request made to delivery Admin successfully", order, true);
});

