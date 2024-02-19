const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");

const logger = require("./middleware/service/redisLogger.js");
const prisma = new PrismaClient();
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const bookRoutes = require("./routers/booksRouter.js");
const genresRoutes = require("./routers/genresRoutes.js");
const authorsRoutes = require("./routers/authorRouter.js");
const logsRoutes = require("./routers/logsRouter.js");

app.use(bodyParser.json());

app.use("/books", bookRoutes);
app.use("/genres", genresRoutes);
app.use("/authors", authorsRoutes);
app.use("/logs", logsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
  console.log(`Example app listening on port   ${port}`);
  await logger.connect();
});
