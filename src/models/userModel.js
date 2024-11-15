const {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} = require("firebase/firestore");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const { auth, db, storage } = require("../firebase");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");

const uploadFileStorage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
};

const updateProfilePicture = async (userId, profileImage) => {

  if (!profileImage) throw new Error("Nenhuma imagem enviada!");
  if (!userId) throw new Error("User ID está indefinido.!");


  console.log("User ID recebido:", userId);

  //fazer upload para o firebase storage:
  const imagePath = `gs://bookmark-server-2e779.appspot.com/perfil/${userId}/${profileImage.originalname}`;
  const storageRef = ref(storage, imagePath);
  await uploadBytes(storageRef, profileImage.buffer);

  //obtém url pública da imagem
  const profileImageUrl = await getDownloadURL(storageRef);

  //atualiza o firestore com o novo link da imagem
  const userDocRef = doc(db, "users", userId);

  await updateDoc(userDocRef, { profilePictureUrl: profileImageUrl });

  return profileImageUrl;
};


const createUser = async (userData, profilePicture) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const userId = userCredential.user.uid;

    let profilePictureUrl = null;
    if (profilePicture) {
      profilePictureUrl = await uploadFileStorage(
        profilePicture,
        `perfil/${profilePicture.originalname}`
      );
    }
    const userRecord = {
      name: userData.name,
      email: userData.email,
      profilePictureUrl,
      createdAt: new Date(),
    };
    await setDoc(doc(db, "users", userId), userRecord);

    return {
      id: userId,
      ...userRecord,
    };
  } catch (error) {
    throw new Error("Erro ao cadastrar o usuário: " + error.message);
  }
};

const loginUser = async (email, password) => {
  try {

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();


    if (user) {
      const userRef = doc(collection(db, "users"), user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email,
          name: userData.name || null,
          profilePicture: userData.profilePictureUrl || null,
          token: token,
        };
      } else {
        throw new Error("User data not found in Firestore");
      }
    } else {
      throw new Error("User login failed");
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    throw new Error("Erro ao fazer login: " + error.message);
  }
};

const logoutUser = async () => {
  await signOut(auth);
};


const updateUser = async (userId, userData) => {
  if (!userId) throw new Error("User Id está indefinido!");

  const userDocRef = doc(db, "users", userId);

  await updateDoc(userDocRef, userData);

  return "Dados do usuário atualizados com sucesso!";
};

const deleteUserData = async (userId) => {
  try {
    // Deleta livros e avaliações do Firestore
    const booksQuery = query(collection(db, "books"), where("userId", "==", userId));
    const booksSnapshot = await getDocs(booksQuery);

    for (const bookDoc of booksSnapshot.docs) {
      const bookData = bookDoc.data();
      console.log(`Excluindo arquivos para o livro ${bookDoc.id}`);

      // Exclui a imagem do livro, se existir
      if (bookData.imageUrl) {
        const imageRef = ref(storage, `books/${userId}/${bookData.imageUrl}`); // Inclui o userId no caminho
        try {
          await deleteObject(imageRef);
          console.log(`Imagem excluída: ${bookData.imageUrl}`);
        } catch (err) {
          console.error(`Erro ao excluir imagem: ${bookData.imageUrl}`, err);
        }
      }

      // Exclui o arquivo do livro, se existir
      if (bookData.bookUrl) {
        const bookFileRef = ref(storage, `books/${userId}/${bookData.bookUrl}`); // Inclui o userId no caminho
        try {
          await deleteObject(bookFileRef);
          console.log(`Arquivo de livro excluído: ${bookData.bookUrl}`);
        } catch (err) {
          console.error(`Erro ao excluir arquivo de livro: ${bookData.bookUrl}`, err);
        }
      }

      // Deleta avaliações associadas ao livro
      const evaluationsQuery = query(
        collection(db, "evaluations"),
        where("bookId", "==", bookDoc.id)
      );
      const evaluationsSnapshot = await getDocs(evaluationsQuery);
      for (const evalDoc of evaluationsSnapshot.docs) {
        await deleteDoc(evalDoc.ref);
      }

      // Deleta o documento do livro
      await deleteDoc(bookDoc.ref);
    }

    // Deleta metas associadas ao usuário (se houver)
    const goalsQuery = query(collection(db, "goals"), where("userId", "==", userId));
    const goalsSnapshot = await getDocs(goalsQuery);
    for (const goalDoc of goalsSnapshot.docs) {
      await deleteDoc(goalDoc.ref);
    }

    // Exclui avaliações do usuário
    const evaluationsQuery = query(collection(db, "evaluations"), where("userId", "==", userId));
    const evaluationsSnapshot = await getDocs(evaluationsQuery);
    for (const evalDoc of evaluationsSnapshot.docs) {
      await deleteDoc(evalDoc.ref);
    }

    // Deleta o usuário do Firestore (se houver)
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);

  } catch (error) {
    throw new Error("Erro ao deletar dados do usuário: " + error.message);
  }
};

module.exports = {
  updateProfilePicture,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUserData
};

