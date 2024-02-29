const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;

const logger = require("./middleware/service/redisLogger.js");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const bookRoutes = require("./routers/booksRouter.js");
const genresRoutes = require("./routers/genresRoutes.js");
const authorsRoutes = require("./routers/authorRouter.js");
const logsRoutes = require("./routers/logsRouter.js");
const usersRoutes = require("./routers/usersRouter.js");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/books", bookRoutes);
app.use("/genres", genresRoutes);
app.use("/authors", authorsRoutes);
app.use("/logs", logsRoutes);
app.use("/auth", usersRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, async () => {
  console.log(`Example app listening on port   ${port}`);
  await logger.connect();
});
