const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllAuthors(limitParam, startIndex, endIndex) {
  try {
    return prisma.authors.findMany({
      take: limitParam,
      skip: startIndex,
    });
  } catch (error) {
    throw new Error(`Error in getAllBooks: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function addAuthor(authorBody) {
  try {
    return prisma.authors.create({
      data: {
        name: authorBody.name,
        surname: authorBody.surname,
        birthday: new Date(authorBody.birthday),
      },
    });
  } catch (error) {
    throw new Error(`Error in addBooks: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function updateAuthorById(author_id, updatedAuthor) {
  try {
    return prisma.authors.update({
      where: {
        author_id: parseInt(author_id),
      },
      data: {
        name: updatedAuthor.name,
        surname: updatedAuthor.surname,
        birthday: new Date(updatedAuthor.birthday),
      },
    });
  } catch (error) {
    throw new Error(`Error in updateBookById: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}
async function deleteAuthorById(authorId) {
  try {
    return prisma.authors.delete({
      where: {
        author_id: parseInt(authorId),
      },
    });
  } catch (error) {
    throw new Error(`Error in deleteBookById: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = {
  getAllAuthors,
  addAuthor,
  updateAuthorById,
  deleteAuthorById,
};
