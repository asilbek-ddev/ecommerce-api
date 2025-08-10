const categories = require("../data/categories")

const getAllCategories = (req, res) => {
    res.json(categories)
}

module.exports = { getAllCategories }