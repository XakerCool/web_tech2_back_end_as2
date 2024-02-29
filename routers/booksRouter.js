const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController");
const bookMiddleware = require("../middleware/books.js");

router.get("/", bookController.getAllBooks);
// router.post("/add", bookController.addBook);
router.post("/add", bookMiddleware.isAuthenticated, bookController.addBook);
router.put(
  "/:id/update",
  bookMiddleware.isAuthenticated,
  bookController.updateBook,
);
router.delete(
  "/:id/delete",
  bookMiddleware.isAuthenticated,
  bookController.deleteBook,
);

module.exports = router;
