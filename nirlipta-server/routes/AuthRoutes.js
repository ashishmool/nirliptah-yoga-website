const express = require("express");
const router = express.Router();
const { login, register, registerMobile, resetPasswordRequest, resetPassword, validateSession, uploadImage} = require("../controller/AuthController");
const { authenticateToken, authorizeRole} = require("../security/Auth");
const upload = require("../config/mobileUploads");

router.post("/login", login);
router.post("/register", register);
router.post("/register-mobile", registerMobile);

router.post("/uploadImage", upload, uploadImage);


router.get("/validate-session", authenticateToken, validateSession); // Use authenticateToken middleware


router.post("/reset-password-request", resetPasswordRequest); // Route for requesting a password reset
router.post("/reset-password", resetPassword); // Route for resetting the password


// router.post("/register", authenticateToken, authorizeRole("ADMIN"), register);

module.exports = router;
