const express = require("express");
const multer = require("multer");
const {
  listBooks,
  createBook,
  editBook,
  removeBook,
} = require("../controllers/bookController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer();

router.get("/books", listBooks);

router.post(
  "/create",
  upload.fields([{ name: "imageFile" }, { name: "bookFile" }]),
  authMiddleware,
  createBook
);

router.put(
  "/books/:id",
  upload.fields([{ name: "imageFile" }, { name: "bookFile" }]),
  editBook
);

router.delete("/books/:id", removeBook);

module.exports = router;
