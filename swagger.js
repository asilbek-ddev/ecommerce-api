const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Face E-commerce API",
      version: "1.0.0",
      description: "Face API mahsulotlar va categoriyalar",
      contact: {
        name: "email",
        email: "asilbekegamnazarov999@email.com",
      },
    },
    servers: [
      {
        url: "https://ecommerce-uzum-api.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./routes/*.js", "./controllers/*.js", "./server.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
