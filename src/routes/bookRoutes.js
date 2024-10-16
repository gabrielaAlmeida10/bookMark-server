// src/routes/bookRoutes.js
const express = require('express');
const { getAllBooks } = require('../models/bookModel'); // Importa a função do modelo

const router = express.Router();

// Define a rota para obter todos os livros
router.get('/books', async (req, res) => {
  try {
    const books = await getAllBooks(); // Chama a função do modelo
    res.json(books); // Retorna a lista de livros como JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
});

// Exporta o roteador para ser utilizado em app.js
module.exports = router;
