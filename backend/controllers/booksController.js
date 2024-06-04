const Book = require("../models/book");


const addBook = async (req, res) => {


    try {

        console.log(req.body)

        const { title, author, genre, borrowed, publicationYear } = req.body;

        // Create a new book instance
        const newBook = new Book({
           
            title,
            author,
            genre,
            borrowed,
            publicationYear
        });

        console.log(newBook._id)

        // Save the book to the database
        await newBook.save();

        // Send a success response
        return res.status(201).json(newBook);
    } catch (error) {
        // Send an error response
        return res.status(400).json({ error: error.message });
    }


}


const updateBook = async (req, res) => {

    try {
        const { id } = req.params; // Assuming the book ID is passed as a URL parameter
        const { title, author, genre, borrowed, publicationYear } = req.body;

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (title) {
            book.title = title;
        }
        if (author) {
            book.author = author;
        }
        if (genre) {
            book.genre = genre;
        }
        if (borrowed !== undefined) {
            book.borrowed = borrowed;
        }
        if (publicationYear) {
            book.publicationYear = publicationYear;
        }
        await book.save();

        // Send a success response
        res.status(200).json(book);

    }
    catch (err) {
        res.status(400).json({ error: error.message });
    }
}

const deleteBook = async(req,res)=>{


    try {
        const { id } = req.params; // Assuming the book ID is passed as a URL parameter
     

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
      }

      // Delete the book from the database
      await Book.deleteOne({ _id: id });

      // Return a success response
      return res.status(200).json({ message: 'Book deleted successfully' });

     
    }
    catch (err) {
        res.status(400).json({ error: error.message });
    }
}




module.exports = { addBook, updateBook, deleteBook };