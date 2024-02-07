// genresRoutes.js
const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genresController.js');
const exampleModule = require('../controllers/services/genresService.js'); // Import the exampleModule

// Create a new genre
router.post('/add', genresController.addGenre);
router.get('/', genresController.getAllGenres);
router.put('/:id/update', genresController.updateGenreById);
router.delete('/:id/delete', genresController.deleteGenreById);




module.exports = router;