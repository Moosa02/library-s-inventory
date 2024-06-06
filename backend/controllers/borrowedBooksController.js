const Books = require("../models/book");
const bcrypt = require("bcrypt");
const authMiddleware = require("../auth/authMiddleware");
const User = require("../models/user")
const logger = require('../logger');

const borrowBook = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            logger.warn("Unauthorized access attempt: No token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            logger.warn("Unauthorized access attempt: Invalid token");
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            logger.warn("Unauthorized access attempt: User not verified");
            return res.status(404).json({ message: "user not found" });
        }

        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
            logger.warn(`Book not found: ID ${bookId}`);
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.borrowed) {
            logger.warn(`Book already borrowed: Title ${book.title}`);
            return res.status(400).json({ message: "Book already borrowed" });
        }

        book.borrowed = true;
        book.borrowedBy = verifiedUser._id;
        await book.save();

        logger.info(`Book borrowed successfully: Title ${book.title}, User ${user.name}`);
        res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (error) {
        logger.error("Error borrowing book", error);
        res.status(500).json({ error: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            logger.warn("Unauthorized access attempt: No token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            logger.warn("Unauthorized access attempt: Invalid token");
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            logger.warn("Unauthorized access attempt: User not verified");
            return res.status(404).json({ message: "user not found" });
        }

        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
            logger.warn(`Book not found: ID ${bookId}`);
            return res.status(404).json({ message: "Book not found" });
        }


        if (!book.borrowed || !book.borrowedBy.equals(verifiedUser._id)) {
            logger.warn(`You have not borrowed following book: Title ${book.title}`);
            return res.status(400).json({ message: "You have not borrowed this book" });
        }

        book.borrowed = false;
        book.borrowedBy = null;
        await book.save();

        logger.info(`Book returned successfully: Title ${book.title}, User ${user.name}`);
        res.status(200).json({ message: "Book returned successfully", book });
    } catch (error) {
        logger.error("Error borrowing book", error);
        res.status(500).json({ error: error.message });
    }
};


const viewBorrowedBooks = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            logger.warn("Unauthorized access attempt: No token provided");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            logger.warn("Unauthorized access attempt: Invalid token");
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            logger.warn("Unauthorized access attempt: User not verified");
            return res.status(404).json({ message: "user not found" });
        }


        const books = await Books.find({ borrowedBy: verifiedUser._id });

        if (books.length === 0) {
            logger.warn(`No books have been borrowed by the user: ${user.name}`);
            return res.status(404).json({ message: "No books borrowed by this user" });
        }

        logger.info(`The boooks borrowed by the user: ${user.name} are following: ${books} `)
        res.status(200).json(books);
    } catch (error) {
        logger.error("Error borrowing book", error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = { viewBorrowedBooks,returnBook, borrowBook };

