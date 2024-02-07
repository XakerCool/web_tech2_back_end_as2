const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const bookRoutes = require("./routers/booksRouter.js");
const genresRoutes = require("./routers/genresRoutes.js");
const authorsRoutes = require("./routers/authorRouter.js");

app.use(bodyParser.json());

app.use("/books", bookRoutes);
app.use("/genres", genresRoutes);
app.use("/authors", authorsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
