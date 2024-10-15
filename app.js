const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore'); // Firestore
const { getStorage } = require('firebase/storage'); // Storage

// Configurações do Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase
const firebaseApp = initializeApp(firebaseConfig); // Renomeado para evitar conflito
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const app = express(); // Instância do Express

// Middleware para analisar JSON
app.use(express.json());

// Exemplo de rota que usa Firestore
app.get('/books', async (req, res) => {
  const snapshot = await db.collection('books').get();
  const books = snapshot.docs.map(doc => doc.data());
  res.send(books);
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
