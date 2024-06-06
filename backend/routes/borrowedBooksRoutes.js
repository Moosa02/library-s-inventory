let express = require("express");
let router= express.Router();

const borrowedBooksController = require("../controllers/borrowedBooksController");

router.post('/borrow/:id',  borrowedBooksController.borrowBook);
router.post('/returnBook/:id',  borrowedBooksController.returnBook);
router.get('/viewBorrowedBooks', borrowedBooksController.viewBorrowedBooks);

module.exports = router;