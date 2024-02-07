const db = require("../../db.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllGenres(limitParam, startIndex, endIndex) {
  try {
    return prisma.genres.findMany({
      take: limitParam,
      skip: startIndex,
    });
  } catch (error) {
    throw new Error(`Error in getAllBooks: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function addGenre(genreBody) {
  try {
    return prisma.genres.create({
      data: {
        genre_name: genreBody.name,
      },
    });
  } catch (error) {
    throw new Error(`Error in addBooks: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function updateGenreById(genreId, updatedGenre) {
  try {
    return prisma.genres.update({
      where: {
        genre_id: parseInt(genreId),
      },
      data: {
        genre_name: updatedGenre.name,
      },
    });
  } catch (error) {
    throw new Error(`Error in updateBookById: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function deleteGenreById(genreId) {
  try {
    return prisma.genres.delete({
      where: {
        genre_id: parseInt(genreId),
      },
    });
  } catch (error) {
    throw new Error(`Error in deleteBookById: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  getAllGenres,
  addGenre,
  updateGenreById,
  deleteGenreById,
};
