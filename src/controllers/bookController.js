const {
  getUserBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../models/bookModel");

const listBooks = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("User ID from middleware in controller:", userId); // Confirmando o userId no controller
    const books = await getUserBooks(userId);
    res.status(200).json(books);
  } catch (error) {
    console.error("Erro ao buscar livros:", error.message);
    res.status(500).json({ message: "Erro ao buscar livros" });
  }
};


const createBook = async (req, res) => {
  const book = req.body;
  const imageFile = req.files["imageFile"] ? req.files["imageFile"][0] : null;
  const bookFile = req.files["bookFile"] ? req.files["bookFile"][0] : null;

  try {
    const userId = req.userId;  // Obtendo o userId do middleware de autenticação
    const newBook = await addBook(book, imageFile, bookFile, userId);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const editBook = async (req, res) => {
  const bookId = req.params.bookId;
  const userId = req.userId;
  const updatedBookData = req.body;

  const imageFile = req.files["imageFile"] ? req.files["imageFile"][0] : null;
  const bookFile = req.files["bookFile"] ? req.files["bookFile"][0] : null;

  console.log("ID do livro:", bookId);
  console.log("Dados para atualização:", updatedBookData);

  try {
    const update = await updateBook(bookId, updatedBookData, imageFile, bookFile, userId);
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await deleteBook(bookId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { listBooks, createBook, editBook, removeBook };
