require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const connectDb = require("./utils/databaseConfig");

const uploadFiles = multer({});
const app = express();

// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "blog api",
//       description: "node blog api",
//       contact: { name: "sreevardhanreddi@gmail.com" },
//     },
//   },
//   apis: ["./routes/*.js"],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(uploadFiles.any());
app.use(logger("combined"));

app.use(express.static(path.join((__dirname, "media"))));

const adminRoutes = require("./routes/admin");
const commonRoutes = require("./routes/common");
const authRoutes = require("./routes/auth");

app.use("/admin/", adminRoutes);
app.use("/auth/", authRoutes);
app.use("/common/", commonRoutes);

const PORT = process.env.PORT || 8080;

connectDb();

app.listen(PORT, () => {
  console.log(`listening on ${PORT} ...`);
});
