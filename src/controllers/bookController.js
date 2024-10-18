const { getAllBooks, addBook } = require('../models/bookModel');

const listBooks = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
};

const createBook = async (req, res) => {
  const book = req.body;
  const imageFile = req.files['imageFile'] ? req.files['imageFile'][0] : null;
  const bookFile = req.files['bookFile'] ? req.files['bookFile'][0] : null;

  try {
    const newBook = await addBook(book, imageFile, bookFile);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { listBooks, createBook };
