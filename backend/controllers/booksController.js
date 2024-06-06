const Book = require("../models/book");


const addBook = async (req, res) => {


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


const viewBooks = async(req,res)=>{

    try{

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

        console.log("IN VIEW BOOKS")
        const {searchWord} = req.body
        console.log(searchWord)

        if(searchWord == undefined){
           const books = await Book.find();
           console.log("IN IF CONDITION",books);
           if (books.length === 0) {
            return res.status(404).json({ message: "Unable to find books" });
        } else {
            return res.status(200).json(books);
        }

        }
        else{
           console.log(searchWord)
           const books = await Book.find({
            $or: [
                { title: searchWord },
                { genre: searchWord },
                { author: searchWord }
              ]
          });
           console.log("IN ELSE CONDITION",books);
           if (books.length === 0) {
            return res.status(404).json({ message: "Unable to find books" });
        } else {
            return res.status(200).json(books);
        }

        }
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }

}




module.exports = { addBook, updateBook, deleteBook, viewBooks };