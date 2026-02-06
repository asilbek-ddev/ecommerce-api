const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getDiscountedProducts,
} = require("../controllers/productController");

router.get("/discounts", getDiscountedProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);
router.get("/", getAllProducts);

module.exports = router;
