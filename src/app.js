require("dotenv").config();

const express = require("express");
const { db } = require("./firebase"); 
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(express.json());
app.use("/api", bookRoutes); 

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});