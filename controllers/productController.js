const fs = require("fs");
const path = require("path");

const getProducts = () => {
  try {
    const filePath = path.join(__dirname, "../data/products.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ JSON o'qishda xato:", error.message);
    return [];
  }
};

exports.getAllProducts = (req, res, next) => {
  try {
    let products = getProducts();

    const { categoryId } = req.query;
    if (categoryId) {
      products = products.filter((p) => p.categoryId === parseInt(categoryId));
    }

    const { minPrice, maxPrice } = req.query;
    if (minPrice) {
      products = products.filter((p) => p.sellPrice >= parseInt(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.sellPrice <= parseInt(maxPrice));
    }

    const { minRating } = req.query;
    if (minRating) {
      products = products.filter((p) => p.rating >= parseFloat(minRating));
    }

    const { search } = req.query;
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p) =>
        p.title.toLowerCase().includes(searchLower),
      );
    }

    const { brand } = req.query;
    if (brand) {
      const brands = brand.split(",");
      products = products.filter((p) => p.brand && brands.includes(p.brand));
    }

    const { color } = req.query;
    if (color) {
      const colors = color.split(",");
      products = products.filter((p) => p.color && colors.includes(p.color));
    }

    const { hasDiscount } = req.query;
    if (hasDiscount === "true") {
      products = products.filter((p) => p.sellPrice < p.fullPrice);
    }

    const { sortBy, order = "asc" } = req.query;

    if (sortBy) {
      products.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "price":
            aValue = a.sellPrice;
            bValue = b.sellPrice;
            break;

          case "rating":
            aValue = a.rating;
            bValue = b.rating;
            break;

          case "popularity":
            aValue = a.ordersQuantity;
            bValue = b.ordersQuantity;
            break;

          case "discount":
            aValue = ((a.fullPrice - a.sellPrice) / a.fullPrice) * 100;
            bValue = ((b.fullPrice - b.sellPrice) / b.fullPrice) * 100;
            break;

          case "newest":
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;

          default:
            aValue = a[sortBy];
            bValue = b[sortBy];
        }

        if (order === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    const stats = {
      totalProducts: products.length,
      priceRange: {
        min: Math.min(...products.map((p) => p.sellPrice)),
        max: Math.max(...products.map((p) => p.sellPrice)),
      },
      avgRating: (
        products.reduce((sum, p) => sum + p.rating, 0) / products.length
      ).toFixed(1),
      discountedCount: products.filter((p) => p.sellPrice < p.fullPrice).length,
    };

    const results = {
      success: true,
      count: products.length,
      stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
        totalProducts: products.length,
        hasNextPage: endIndex < products.length,
        hasPrevPage: page > 1,
      },
      data: paginatedProducts,
    };

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

exports.getFilterOptions = (req, res, next) => {
  try {
    const products = getProducts();
    const { categoryId } = req.query;

    let filteredProducts = products;
    if (categoryId) {
      filteredProducts = products.filter(
        (p) => p.categoryId === parseInt(categoryId),
      );
    }

    const brands = [
      ...new Set(filteredProducts.map((p) => p.brand).filter(Boolean)),
    ];

    const colors = [
      ...new Set(filteredProducts.map((p) => p.color).filter(Boolean)),
    ];

    const prices = filteredProducts.map((p) => p.sellPrice);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    const ratings = [5, 4.5, 4, 3.5, 3];

    const filterOptions = {
      success: true,
      data: {
        brands: brands.sort(),
        colors: colors.sort(),
        priceRange,
        ratings,
        sortOptions: [
          { value: "popularity", label: "Ommabopligi bo'yicha", order: "desc" },
          { value: "price", label: "Avval arzonlari", order: "asc" },
          { value: "price", label: "Avval qimmatlari", order: "desc" },
          { value: "rating", label: "Yuqori reyting", order: "desc" },
          { value: "discount", label: "Katta chegirma", order: "desc" },
          { value: "newest", label: "Yangilar", order: "desc" },
        ],
      },
    };

    res.status(200).json(filterOptions);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = (req, res, next) => {
  try {
    const products = getProducts();
    const product = products.find(
      (p) => p.productId === parseInt(req.params.id),
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Mahsulot topilmadi",
      });
    }

    const similarProducts = products
      .filter(
        (p) =>
          p.categoryId === product.categoryId &&
          p.productId !== product.productId,
      )
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        ...product,
        similarProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = (req, res, next) => {
  try {
    const products = getProducts();
    const categoryId = parseInt(req.params.categoryId);

    let categoryProducts = products.filter((p) => p.categoryId === categoryId);

    const { sortBy, order = "asc" } = req.query;
    if (sortBy) {
      categoryProducts.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "discount") {
          aValue = ((a.fullPrice - a.sellPrice) / a.fullPrice) * 100;
          bValue = ((b.fullPrice - b.sellPrice) / b.fullPrice) * 100;
        }

        if (order === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = categoryProducts.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      categoryId: categoryId,
      count: categoryProducts.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(categoryProducts.length / limit),
        totalProducts: categoryProducts.length,
      },
      data: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDiscountedProducts = (req, res, next) => {
  try {
    const products = getProducts();
    const discountedProducts = products.filter(
      (p) => p.sellPrice < p.fullPrice,
    );

    const withDiscount = discountedProducts.map((p) => ({
      ...p,
      discountPercentage: Math.round(
        ((p.fullPrice - p.sellPrice) / p.fullPrice) * 100,
      ),
    }));

    withDiscount.sort((a, b) => b.discountPercentage - a.discountPercentage);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = withDiscount.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      title: "Chegirmalar",
      count: withDiscount.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(withDiscount.length / limit),
        totalProducts: withDiscount.length,
      },
      data: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
};