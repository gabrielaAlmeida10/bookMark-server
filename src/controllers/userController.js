const { createUser, loginUser, logoutUser, updateProfilePicture } = require("../models/userModel");

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
    res.status(200).json({ message: "User logged in successfully!  ", userData });
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

    console.log("User ID:", userId);  // Agora deve mostrar o ID correto
    console.log("Profile Image:", profileImage);  // Verifica o recebimento correto do arquivo

    if (!userId) {
      return res.status(400).json({ error: "User ID está indefinido." });
    }
    if (!profileImage) {
      return res.status(400).json({ error: "Nenhuma imagem enviada!" });
    }

    const profileImageUrl = await updateProfilePicture(userId, profileImage);
    res.status(200).json({ message: "Foto de perfil atualizada!", profileImageUrl });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


module.exports = { registerUser, login, logout, updateProfilePictureController };
