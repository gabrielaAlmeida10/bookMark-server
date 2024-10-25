const express = require("express");
const multer = require("multer");
const { registerUser, login, logout } = require("../controllers/userController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/registerUser", registerUser);
router.post("/login", login);
router.post("/logou", logout);

module.exports = router;
