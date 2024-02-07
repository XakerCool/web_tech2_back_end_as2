const genreService = require("../controllers/services/genresService.js");
const HttpStatus = require("http-status");

exports.getAllGenres = async (req, res) => {
  try {
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
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.addGenre = async (req, res) => {
  try {
    const genre = req.body;
    const message = await genreService.addGenre(genre);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.updateGenreById = (req, res) => {
  try {
    const genreId = req.params.id;
    const updateGenre = req.body;

    const message = genreService.updateGenreById(genreId, updateGenre);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

exports.deleteGenreById = (req, res) => {
  try {
    const genreId = req.params.id;

    const message = genreService.deleteGenreById(genreId);

    res.status(HttpStatus.OK).json(message);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
