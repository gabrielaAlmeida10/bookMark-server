require("dotenv").config();

const express = require("express");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());


app.use("/api/books", bookRoutes); 
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});