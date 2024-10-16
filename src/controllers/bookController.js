const { getAllBooks } = require("../models/bookModel");

const listBooks = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching for books", error });
  }
};

module.exports = { listBooks };
