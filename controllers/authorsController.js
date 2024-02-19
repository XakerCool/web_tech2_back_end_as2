const authorService = require("../controllers/services/authorsService.js");
const HttpStatus = require("http-status");
const axios = require("axios");

const {
  infoLog,
  errorLog,
  warnLog,
} = require("../middleware/service/redisLogger.js");

exports.getAllAuthors = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to get all authors list",
      path,
      req.socket.remoteAddress,
    );
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

    await infoLog("User got all authors list", path, req.socket.remoteAddress);
  } catch (error) {
    await errorLog(error.message, path, req.socket.remoteAddress);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.addAuthor = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to add new author to db",
      path,
      req.socket.remoteAddress,
    );
    const author = req.body;
    const message = await authorService.addAuthor(author);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User added new author to db",
      path,
      req.socket.remoteAddress,
    );
  } catch (error) {
    await errorLog(error.message, path, req.socket.remoteAddress);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.updateAuthorById = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const authorId = req.params.id;
    const updateAuthor = req.body;

    await warnLog(
      "User try to update author with id " + authorId,
      path,
      req.socket.remoteAddress,
    );

    const message = authorService.updateAuthorById(authorId, updateAuthor);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User updated author with id " + authorId,
      path,
      req.socket.remoteAddress,
    );
  } catch (error) {
    await errorLog(error.message, path, req.socket.remoteAddress);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.deleteAuthorById = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const authorId = req.params.id;
    await warnLog(
      "User try to delete author with id " + authorId,
      path,
      req.socket.remoteAddress,
    );
    const message = authorService.deleteAuthorById(authorId);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User deleted author with id " + authorId,
      path,
      req.socket.remoteAddress,
    );
  } catch (error) {
    await errorLog(error.message, path, req.socket.remoteAddress);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
