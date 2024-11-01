const { updateEmail } = require("firebase/auth");
const { auth } = require("../firebase");
const {
  createUser,
  loginUser,
  logoutUser,
  updateProfilePicture,
  updateUser,
 // deleteUser,
} = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const profilePicture = req.files ? req.files["profilePicture"][0] : null;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  try {
    const userData = { name, email, password };
    const newUser = await createUser(userData, profilePicture);
    res
      .status(201)
      .json({ message: "User registered successfully! ", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await loginUser(email, password);

    res
      .status(200)
      .json({ message: "User logged in successfully!  ", userData });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await logoutUser();
    res.status(200).json({ message: "User logged out successfully! " });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateProfilePictureController = async (req, res) => {
  try {
    console.log("req.params:", req.params);
    const userId = req.params.userId;

    const profileImage = req.file;

    console.log("User ID:", userId); // Agora deve mostrar o ID correto
    console.log("Profile Image:", profileImage); // Verifica o recebimento correto do arquivo


    if (!userId) {
      return res.status(400).json({ error: "User ID está indefinido." });
    }
    if (!profileImage) {
      return res.status(400).json({ error: "Nenhuma imagem enviada!" });
    }

    const profileImageUrl = await updateProfilePicture(userId, profileImage);

    res
      .status(200)
      .json({ message: "Foto de perfil atualizada!", profileImageUrl });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


const editUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email } = req.body;
    const profileImage = req.file;

    console.log("User ID:", userId);

    const userData = {};

    if (name) userData.name = name;

    const user = auth.currentUser;
    if (email && user) {
      await updateEmail(user, email);
      userData.email = email;
    }

    const updateMessage = await updateUser(userId, userData);

    let profileImageUrl;
    if (profileImage) {
      profileImageUrl = await updateProfilePicture(userId, profileImage);
      userData.profilePictureUrl = profileImageUrl;
    }

    res.status(200).json({
      message: updateMessage,
      profileImageUrl: profileImageUrl || "Imagem não alterada",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// const deleteUserController = async (req, res) => {
//   try {
//     console.log('Cabeçalhos recebidos:', req.headers); // Verifique os cabeçalhos recebidos

//       const authHeader = req.headers.authorization; // obtém o cabeçalho de autorização

//       if (!authHeader) {
//           return res.status(401).json({ error: 'Token de autenticação não fornecido' });
//       }

//       const idToken = authHeader.split(' ')[1]; // obtém o token após "Bearer"

//       // Chame a função para deletar o usuário
//       await deleteUser(idToken);
//       res.status(200).json({ message: 'Usuário deletado com sucesso' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message });
//   }
// };

module.exports = {
  registerUser,
  login,
  logout,
  updateProfilePictureController,
  editUserController,
  //deleteUserController,
};

