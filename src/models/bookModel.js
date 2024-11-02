const {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const { db } = require("../firebase");
const { storage } = require("../firebase");

const getUserBooks = async (userId) => {
  try {
    console.log("User ID being used in query:", userId); // Confirmando o userId
    const userBooksQuery = query(
      collection(db, "books"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(userBooksQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw new Error("Erro ao buscar livros do usuário: " + error.message);
  }
};


const uploadFileStorage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

const addBook = async (book, imageFile, bookFile, userId) => {
  try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadFileStorage(
        imageFile,
        `bookPicture/${userId}/${imageFile.originalname}`
      );
    }

    let bookUrl = null;
    if (bookFile) {
      bookUrl = await uploadFileStorage(
        bookFile,
        `bookFile/${userId}/${bookFile.originalname}`
      );
    }

    const bookData = {
      ...book,
      imageUrl,
      bookUrl,
    };

    const docRef = await addDoc(collection(db, "books"), bookData);
    return {
      id: docRef.id,
      ...bookData,
    };
  } catch (error) {
    throw new Error("Erro ao adicionar o livro: " + error.message);
  }
};

const updateBook = async (bookId, updatedBookData, imageFile, bookFile) => {
  try {
    const bookRef = doc(db, "books", bookId);

    if (imageFile) {
      const imageUrl = await uploadFileStorage(
        imageFile,
        `bookPicture/${imageFile.originalname}`
      );
      updatedBookData.imageUrl = imageUrl;
    }

    if (bookFile) {
      const bookUrl = await uploadFileStorage(
        bookFile,
        `bookFile/${bookFile.originalname}`
      );
      updatedBookData.bookFile = bookUrl;
    }

    // Atualiza os dados do livro no Firestore
    await updateDoc(bookRef, updatedBookData);
    return { id: bookId, ...updatedBookData };
  } catch (error) {
    throw new Error("Erro ao atualizar o livro: " + error.message);
  }
};

const deleteBook = async (bookId) => {
  try {
    const bookRef = doc(db, "books", bookId);
    await deleteDoc(bookRef);
    return { message: "Livro deletado com Sucesso!" };
  } catch (error) {
    throw new Error("Erro ao deletar o livro: " + error.message);
  }
};

module.exports = {
  getUserBooks,
  addBook,
  updateBook,
  deleteBook,
  uploadFileStorage,
};
