const express = require("express");
const multer = require("multer");
const { registerUser, login, logout, updateProfilePictureController } = require("../controllers/userController");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/registerUser", upload.fields([{ name: 'profilePicture', maxCount: 1 }]), registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:userId/profile-picture", upload.single("profileImage"), updateProfilePictureController);


module.exports = router;
