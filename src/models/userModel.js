const { collection, addDoc, doc, setDoc, getDoc, updateDoc } = require("firebase/firestore");
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

const updateProfilePicture = async (userId, profileImage) => {
  if(!profileImage) throw new Error("Nenhuma imagem enviada!");
  if(!userId) throw new Error("User ID está indefinido.!");

  console.log("User ID recebido:", userId);

  //fazer upload para o firebase storage:
  const imagePath = `gs://bookmark-server-2e779.appspot.com/perfil/${userId}/${profileImage.originalname}`;
  const storageRef = ref(storage, imagePath);
  await uploadBytes(storageRef, profileImage.buffer);

  //obtém url pública da imagem
  const profileImageUrl = await getDownloadURL(storageRef);

  //atualiza o firestore com o novo link da imagem
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, {profilePictureUrl: profileImageUrl});

  return profileImageUrl;
}

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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

module.exports = { updateProfilePicture, createUser, loginUser, logoutUser };
