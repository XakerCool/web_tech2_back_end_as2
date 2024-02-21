const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorsController.js");

router.get("/", authorController.getAllAuthors);
router.post("/addAuthor", authorController.addAuthor);
router.put("/:id/update", authorController.updateAuthorById);
router.delete("/:id/delete", authorController.deleteAuthorById);

module.exports = router;
