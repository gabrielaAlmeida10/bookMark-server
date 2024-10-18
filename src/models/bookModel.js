const { collection, getDocs, addDoc } = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const { db } = require("../firebase");
const { storage } = require("../firebase");

const getAllBooks = async () => {
  const snapshot = await getDocs(collection(db, "books"));
  return snapshot.docs.map((doc) => doc.data());
};

const uploadFileStorage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

const addBook = async (book, imageFile, bookFile) => {
  try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadFileStorage(imageFile, `bookPicture/${imageFile.originalname}`);
    }

    let bookUrl = null;
    if (bookFile) {
      bookUrl = await uploadFileStorage(bookFile, `bookFile/${bookFile.originalname}`);
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

module.exports = { getAllBooks, addBook };
