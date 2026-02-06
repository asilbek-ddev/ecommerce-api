const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger");

const productRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/main/products", productRoutes);
app.use("/api/v1/main/categories", categoriesRoutes);

app.use(
  "/api/v1/swagger",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlamoqda`);
});
