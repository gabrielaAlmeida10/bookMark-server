const { collection, addDoc, doc, setDoc } = require("firebase/firestore");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
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
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

const logoutUser = async () => {
  await signOut(auth);
};

module.exports = { createUser, loginUser, logoutUser };
