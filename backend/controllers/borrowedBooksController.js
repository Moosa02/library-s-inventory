const Books = require("../models/book");
const bcrypt = require("bcrypt");
const authMiddleware = require("../auth/authMiddleware");
const User = require("../models/user")


const borrowBook = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            console.log("not  averified user")
            return res.status(404).json({ message: "user not found" });
        }

        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.borrowed) {
            return res.status(400).json({ message: "Book already borrowed" });
        }

        book.borrowed = true;
        book.borrowedBy = verifiedUser._id;
        await book.save();

        res.status(200).json({ message: "Book borrowed successfully", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            console.log("not  averified user")
            return res.status(404).json({ message: "user not found" });
        }

        const bookId = req.params.id;
        const book = await Books.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!book.borrowed || !book.borrowedBy.equals(verifiedUser._id)) {
            return res.status(400).json({ message: "You have not borrowed this book" });
        }

        book.borrowed = false;
        book.borrowedBy = null;
        await book.save();

        res.status(200).json({ message: "Book returned successfully", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const viewBorrowedBooks = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const user = await authMiddleware.verifyToken(token); // Ensure verifyToken is an async function

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        const verifiedUser = await User.findById(user.userId);

        if (!verifiedUser) {
            console.log("not  averified user")
            return res.status(404).json({ message: "user not found" });
        }


        const books = await Books.find({ borrowedBy: verifiedUser._id });

        if (books.length === 0) {
            return res.status(404).json({ message: "No books borrowed by this user" });
        }

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { viewBorrowedBooks,returnBook, borrowBook };

