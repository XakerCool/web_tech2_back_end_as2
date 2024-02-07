const authorService = require("../controllers/services/authorsService.js");
const HttpStatus = require("http-status");
const axios = require("axios");

exports.getAllAuthors = async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit) || 10;
    const pageParam = parseInt(req.query.page) || 1;

    const startIndex = (pageParam - 1) * limitParam;
    const endIndex = pageParam * limitParam;

    const authors = await authorService.getAllAuthors(
      limitParam,
      startIndex,
      endIndex,
    );

    const response = {
      totalAuthors: authors.length,
      authors: authors,
      currentPage: pageParam,
      totalPages: Math.ceil(authors.length / limitParam),
    };

    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.addAuthor = async (req, res) => {
  try {
    const author = req.body;
    const message = await authorService.addAuthor(author);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.updateAuthorById = (req, res) => {
  try {
    const authorId = req.params.id;
    const updateAuthor = req.body;

    const message = authorService.updateAuthorById(authorId, updateAuthor);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.deleteAuthorById = (req, res) => {
  try {
    const authorId = req.params.id;

    const message = authorService.deleteAuthorById(authorId);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
