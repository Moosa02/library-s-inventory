let express = require("express");
let router= express.Router();

const bookController = require("../controllers/booksController");

router.post('/addBook',bookController.addBook)
router.put('/updateBook/:id',bookController.updateBook)
router.delete('/deleteBook/:id',bookController.deleteBook)

module.exports = router;