const { createUser, loginUser, logoutUser } = require("../models/userModel");

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
    const user = await loginUser(email, password);
    res.status(200).json({ message: "User logged in successfully!  ", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (res, req) => {
  try {
    await logoutUser();
    res.status(200).json({ message: "User logged out successfully! " });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, login, logout };
