const bookService = require("./services/bookService.js");
const HttpStatus = require("http-status");
const axios = require("axios");

const twilio = require("twilio");
const accountSid = "AC8a5b0b60727eb6e9650faecf04b3b058";
const authToken = "56cf5dc4b371aac598d019a88530a2e3";
const client = new twilio.Twilio(accountSid, authToken);

exports.getAllBooks = async (req, res) => {
  try {
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
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const book = req.body;
    await bookService.addBook(book);
    const message = "New book was created";

    const targetNumber = "+77755762752"; // Replace with the actual phone number

    try {
      await client.messages.create({
        body: message,
        from: "whatsapp:+16814994220", // Replace with your Twilio phone number
        to: `whatsapp:${targetNumber}`,
      });

      res.json({ success: true, message: "Book added successfully" });
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
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateBook = req.body;

    const message = bookService.updateBookById(bookId, updateBook);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const message = bookService.deleteBookById(bookId);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
