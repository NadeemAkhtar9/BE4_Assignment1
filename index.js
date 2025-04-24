const express = require("express")
const app = express()

const {initializeDatabase} = require("./db/db.connect")
const Book = require("./models/book.model")

app.use(express.json()) 

const cors = require("cors");
app.use(cors());

app.use(cors({
    origin: "https://hqk6p6.csb.app", // Allow CodeSandbox
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

initializeDatabase()

/* app.get("/books",(req,res)=>{
    res.send("Hello")
}) */

// Create a new book data in the books Database

  async function createBook(newBook){
    try{
        const book = new Book(newBook); 
        const savedBook = await book.save();
        return savedBook;
    }
    catch(error){
        throw error;
    }
}

app.post("/books",async (req,res)=>{
    try{
        const savedBook = await createBook(req.body)
        res.status(200).json({message: "Book added successfully.",book:savedBook})
    }
    catch(error){
        res.status(500).json({error: "Failed to add book.",details: error.message})
    }
})
// api to get all the books
async function readAllBooks(){
    try{
        const allBooks = await Book.find()
        return allBooks 
    }
    catch (error) {
        throw error
    }
  }
  //readAllHotels()

app.get("/books",async (req,res)=>{
    try{
        const books = await readAllBooks()
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "No Books found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Books."})
    }
})
// api to get a book details by its title
async function readBookByTitle(bookTitle){
    try{    
        const book = await Book.findOne({title:bookTitle})
        return book
    }
    catch(error){
        throw error
    }
  }
  //readBookByTitle("Shoe Dog")
  app.get("/books/:bookTitle",async (req,res)=>{
    try{
        const books = await readBookByTitle(req.params.bookTitle)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "No Books found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Books."})
    }
})
//API to get details of all the books by an author
async function readBookByAutor(bookAuthor){
    try{    
        const book = await Book.find({author:bookAuthor})
        return book
    }
    catch(error){
        throw error
    }
  }
  //readBookByAutor("Charles Duhigg")
  app.get("/books/author/:bookAuthor",async (req,res)=>{
    try{
        const books = await readBookByAutor(req.params.bookAuthor)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "No Books found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Books."})
    }
})
//API to get all the books which are of "Business" genre.
async function readBookByGenre(bookGenre){
    try{    
        const book = await Book.find({genre:bookGenre})
        return book
    }
    catch(error){
        throw error
    }
  }
  //readBookByGenre("Shoe Dog")
  app.get("/books/genre/:bookGenre",async (req,res)=>{
    try{
        const books = await readBookByGenre(req.params.bookGenre)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "No Books found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Books."})
    }
})
// API to get all the books which was released in the year 2012.
async function readBookByPublishYear(publishedYear){
    try{    
        const book = await Book.find({publishedYear:publishedYear})
        return book
    }
    catch(error){
        throw error
    }
  }
  //readBookByPublishYear(1925)
  app.get("/books/year/:publishedYear",async (req,res)=>{
    try{
        const books = await readBookByPublishYear(req.params.publishedYear)
        if(books.length != 0){
            res.json(books)
        }
        else{
            res.status(404).json({error: "No Books found."})
        }
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch Books.",details: error.message})
    }
})
// update  rating using id in the database

async function updateBook(bookId,dataToUpdate){
    try{
      const updatedBook = await Book.findByIdAndUpdate(bookId,dataToUpdate,{new:true})
      return updatedBook
    }
    catch(error){
      console.log("Error in updating Book")
    }
  }
  app.post("/books/:bookId",async (req,res)=>{
    try{
      const updatedBook = await updateBook(req.params.bookId,req.body)
      if(updatedBook){
        res.status(200).json({message: "Book updated successfully.",updatedBook:updatedBook})
      }
      else{
        res.status(404).json({error: "Book does not exist."})
      }
    }
    catch(error){
      res.status(404).json({error: "Failed to update Book."})
    }
  })
  // update rating with the help of its title
  async function updateBookByTitle(bookTitle,dataToUpdate){
    try{
      const updatedBook = await Book.findOneAndUpdate({title:bookTitle},dataToUpdate,{new:true})
      return updatedBook
    }
    catch(error){
      console.log("Error in updating Book")
    }
  }
  app.post("/books/title/:bookTitle",async (req,res)=>{
    try{
      const updatedBook = await updateBookByTitle(req.params.bookTitle,req.body)
      if(updatedBook){
        res.status(200).json({message: "Book updated successfully.",updatedBook:updatedBook})
      }
      else{
        res.status(404).json({error: "Book does not exist."})
      }
    }
    catch(error){
      res.status(404).json({error: "Failed to update Book."})
    }
  })
//  API to delete a book with the help of a book id 
async function deleteBook(bookId){
    try{
        const deletedBook = await Book.findByIdAndDelete(bookId)
        return deletedBook
    }
    catch(error){
        console.log(error)
    }
}
app.delete("/books/:bookId",async (req,res)=>{
    try{
        const deletedBook = await deleteBook(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: "Book deleted successfully."})
        }
        else{
            res.status(404).json({message: "Book not found."})
        }
    }
    catch(error){
        res.status(500).json({error: "Failed to delete Book."})
    }
})
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});