const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../models/bookModel");

const listBooks = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livros" });
  }
};

const createBook = async (req, res) => {
  const book = req.body;
  const imageFile = req.files["imageFile"] ? req.files["imageFile"][0] : null;
  const bookFile = req.files["bookFile"] ? req.files["bookFile"][0] : null;

  try {
    const newBook = await addBook(book, imageFile, bookFile);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editBook = async (req, res) => {
  const bookId = req.params.id;
  const updatebBookData = req.body;

  const imageFile = req.files["imageFile"] ? req.files["imageFile"][0] : null;
  const bookFile = req.files["bookFile"] ? req.files["bookFile"][0] : null;

  console.log("ID do livro:", bookId);
  console.log("Dados para atualização:", updatebBookData);

  try {
    const update = await updateBook(bookId, updatebBookData, imageFile, bookFile);
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
