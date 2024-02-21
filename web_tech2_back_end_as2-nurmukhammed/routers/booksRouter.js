const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController");

router.get("/", bookController.getAllBooks);
router.post("/add", bookController.addBook);
router.put("/:id/update", bookController.updateBook);
router.delete("/:id/delete", bookController.deleteBook);

module.exports = router;
