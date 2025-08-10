const products = require("../data/products");

const getAllProducts = (req, res) => {
    res.json(products)
}

module.exports = { getAllProducts }