const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/main/products", productRoutes);
app.use("/api/v1/main/categories", categoriesRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
});
