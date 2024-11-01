
const axios = require("axios");
const {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
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

// const deleteUser = async (userId) => {
//   try {
//     const userDocRef = doc(collection(db, "users"), userId);
//     const userDoc = await getDoc(userDocRef);
//     if (!userDoc.exists()) {
//       throw new Error("Usuário não encontrado!");
//     }

//     const profilePictureUrl = userDoc.data().profilePictureUrl;
//     if (profilePictureUrl) {
//       const decodeUrl = decodeURIComponent(profilePictureUrl);
//       const filePath = decodeUrl.split("/o/")[1].split("?")[0];
//       const storageRef = ref(storage, filePath);
//       try {
//         await deleteObject(storageRef);
//       } catch (error) {
//         console.log("Erro ao excluir foto do perfil: ", error);
//       }
//     }

//     await deleteDoc(userDocRef);

//     const response = await fetch(
//       `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.FIREBASE_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           idToken: idToken,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Erro ao deletar o usuário: " + response.statusText);
//     }

//     return response.json();
//   } catch (error) {
//     throw new Error(`Erro ao excluir o usuário: ${error.message}`);
//   }
// };

module.exports = {
  updateProfilePicture,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
 // deleteUser,
};

