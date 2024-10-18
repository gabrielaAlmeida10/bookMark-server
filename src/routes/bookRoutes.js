const express = require('express');
const multer = require('multer');
const { listBooks, createBook } = require('../controllers/bookController');

const router = express.Router();
const upload = multer();

router.get('/books', listBooks);

router.post('/books', upload.fields([{ name: 'imageFile' }, { name: 'bookFile' }]), createBook);

module.exports = router;
