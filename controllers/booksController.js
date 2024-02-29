const bookService = require("./services/bookService.js");
const HttpStatus = require("http-status");
const axios = require("axios");

const twilio = require("twilio");
const {
  warnLog,
  infoLog,
  errorLog,
} = require("../middleware/service/redisLogger");
const accountSid = "AC8a5b0b60727eb6e9650faecf04b3b058";
const authToken = "56cf5dc4b371aac598d019a88530a2e3";
const client = new twilio.Twilio(accountSid, authToken);

exports.getAllBooks = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to get all books list",
      path,
      req.socket.remoteAddress,
    );
    const priceParam = req.query.price;
    const priceOption = req.query.option;
    const limitParam = parseInt(req.query.limit) || 10;
    const pageParam = parseInt(req.query.page) || 1;

    const startIndex = (pageParam - 1) * limitParam;
    const endIndex = pageParam * limitParam;

    const books = await bookService.getAllBooks(
      priceParam,
      priceOption,
      limitParam,
      startIndex,
      endIndex,
    );

    const response = {
      totalBooks: books.length,
      books: books,
      currentPage: pageParam,
      totalPages: Math.ceil(books.length / limitParam),
    };

    res.status(HttpStatus.OK).json(response);
    await infoLog("User got all books list", path, req.socket.remoteAddress);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.addBook = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to add new book to db",
      path,
      req.socket.remoteAddress,
    );
    const book = req.body;
    await bookService.addBook(book);
    // const message = "New book was created";

    // const targetNumber = "+77755762752"; // Replace with the actual phone number

    try {
      // await client.messages.create({
      //   body: message,
      //   from: "whatsapp:+16814994220", // Replace with your Twilio phone number
      //   to: `whatsapp:${targetNumber}`,
      // });

      res.json({ success: true, message: "Book added successfully" });
      await infoLog(
        "User added new book to db",
        path,
        req.socket.remoteAddress,
      );
    } catch (error) {
      console.error("Twilio error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send WhatsApp notification",
      });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.updateBook = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const bookId = req.params.id;

    await warnLog(
      "User try to update book with id: " + bookId,
      path,
      req.socket.remoteAddress,
    );

    const updateBook = req.body;

    const message = bookService.updateBookById(bookId, updateBook);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User updated book with id: " + bookId,
      path,
      req.socket.remoteAddress,
    );
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.deleteBook = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const bookId = req.params.id;

    await warnLog(
      "User try to delete book with id: " + bookId,
      path,
      req.socket.remoteAddress,
    );

    const message = bookService.deleteBookById(bookId);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User deleted book with id: " + bookId,
      path,
      req.socket.remoteAddress,
    );
  } catch (error) {
    await errorLog(error.message, path, req.socket.remoteAddress);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};
