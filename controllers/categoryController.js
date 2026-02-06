const fs = require("fs");
const path = require("path");

const getCategories = () => {
  const data = fs.readFileSync(path.join(__dirname, "../data/categories.json"));
  return JSON.parse(data);
};

exports.getAllCategories = (req, res, next) => {
  try {
    const categories = getCategories();

    res.status(200).json({
      succes: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = (req, res, next) => {
  try {
    const categories = getCategories();
    const category = categories.find(
      (c) => c.categoryId === parseInt(req.params.id),
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Kategoriya topilmadi",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
