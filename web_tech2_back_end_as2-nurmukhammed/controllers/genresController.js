const genreService = require("../controllers/services/genresService.js");
const HttpStatus = require("http-status");
const {
  warnLog,
  infoLog,
  errorLog,
} = require("../middleware/service/redisLogger");

exports.getAllGenres = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to get all genres list",
      path,
      req.socket.remoteAddress,
    );
    const limitParam = parseInt(req.query.limit) || 10;
    const pageParam = parseInt(req.query.page) || 1;

    const startIndex = (pageParam - 1) * limitParam;
    const endIndex = pageParam * limitParam;

    const genres = await genreService.getAllGenres(
      limitParam,
      startIndex,
      endIndex,
    );

    const response = {
      totalGenres: genres.length,
      genres: genres,
      currentPage: pageParam,
      totalPages: Math.ceil(genres.length / limitParam),
    };

    res.status(HttpStatus.OK).json(response);
    await infoLog("User got all genres list", path, req.socket.remoteAddress);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.addGenre = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    await warnLog(
      "User try to add new genre to db",
      path,
      req.socket.remoteAddress,
    );
    const genre = req.body;
    const message = await genreService.addGenre(genre);

    res.status(HttpStatus.OK).json(message);
    await infoLog("User added new genre to db", path, req.socket.remoteAddress);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    await errorLog(error.message, path, req.socket.remoteAddress);
  }
};

exports.updateGenreById = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const genreId = req.params.id;

    await warnLog(
      "User try to update genre with id: " + genreId,
      path,
      req.socket.remoteAddress,
    );

    const updateGenre = req.body;

    const message = genreService.updateGenreById(genreId, updateGenre);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User updated genre with id: " + genreId,
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

exports.deleteGenreById = async (req, res) => {
  const fullPath = req.originalUrl;
  const path = new URL(fullPath, `http://${req.headers.host}`).pathname;
  try {
    const genreId = req.params.id;

    await warnLog(
      "User try to delete genre with id: " + genreId,
      path,
      req.socket.remoteAddress,
    );

    const message = genreService.deleteGenreById(genreId);

    res.status(HttpStatus.OK).json(message);
    await infoLog(
      "User deleted genre with id: " + genreId,
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
