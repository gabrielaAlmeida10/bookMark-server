// src/models/bookModel.js
const { db } = require('../firebase'); 
const { collection, getDocs } = require('firebase/firestore'); 


const getAllBooks = async () => {
  const snapshot = await getDocs(collection(db, 'books')); 
  return snapshot.docs.map(doc => doc.data());
};

module.exports = { getAllBooks };
