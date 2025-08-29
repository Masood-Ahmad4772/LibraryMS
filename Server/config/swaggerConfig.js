const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "Book API",
         version: "1.0.0",
         description: "API documentation for the Book project",
      },
      servers: [
         {
            url: "http://localhost:5000/api", // Adjust based on your setup
         },
      ],
      components: {
         securitySchemes: {
            BearerAuth: {
               type: "http",
               scheme: "bearer",
               bearerFormat: "JWT",
            },
         },
      },
   },
   apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
   app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   console.log("Swagger UI available at http://localhost:5000/swagger");
};

module.exports = swaggerDocs;
