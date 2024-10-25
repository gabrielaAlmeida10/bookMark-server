require("dotenv").config();

const express = require("express");
const { db } = require("./firebase"); 
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const multer = require("multer");

const app = express();
const upload = multer();

app.use(express.json());
app.use(upload.fields([{name: 'profilePicture', maxCount: 1}])) //Lida com upload de foto de perfil


app.use("/api/books", bookRoutes); 
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});