const bookValidate = require('../../middleware/bookValidate');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBooks = async (priceParam, priceOption, limitParam, startIndex, endIndex) => {
    try {
        return prisma.books.findMany({
            take: limitParam,
            skip: startIndex,
        });
    } catch (error) {
        throw new Error(`Error in getAllBooks: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
};

exports.addBook = async (bookBody) => {
    try {
        // const bookValidation = bookValidate.validate(bookBody);
        //
        // if (!bookValidation.valid) {
        //     return bookValidation.message;
        // }

        bookBody.publishYear += "T00:00:000Z";

        return prisma.books.create({
            data: {
                title: bookBody.title,
                publish_year: new Date(bookBody.publish_year),
                page_count: bookBody.page_count,
                price: bookBody.price,
            },
        });
    } catch (error) {
        throw new Error(`Error in addBooks: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}


exports.updateBookById = async (bookId, updatedBook) => {
    try {
        updatedBook.publishYear += "T00:00:00Z"
        return prisma.books.update({
            where: {
                book_id: parseInt(bookId)
            },
            data: {
                title: updatedBook.title,
                publish_year: new Date(updatedBook.publish_year),
                page_count: updatedBook.page_count,
                price: updatedBook.price,
            },
        })
    } catch (error) {
        throw new Error(`Error in updateBookById: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

exports.deleteBookById = async (bookId) => {
    try {
        return prisma.books.delete({
            where: {
                book_id: parseInt(bookId)
            }
        })
    } catch (error) {
        throw new Error(`Error in deleteBookById: ${error.message}`);
    } finally {
        await prisma.$disconnect();
    }
}