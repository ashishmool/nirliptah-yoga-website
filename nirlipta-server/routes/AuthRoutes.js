const express = require("express");
const router = express.Router();
const { login, register, registerMobile, resetPasswordRequest, resetPassword, validateSession, uploadImage,   resetPasswordMobile,
    verifyOTPAndResetPassword,} = require("../controller/AuthController");
const { authenticateToken, authorizeRole} = require("../security/Auth");
const upload = require("../middleware/fileUploads");

router.post("/login", login);
router.post("/register", register);
router.post("/register-mobile", registerMobile);

router.post("/uploadImage", upload, uploadImage);


router.get("/validate-session", authenticateToken, validateSession); // Use authenticateToken middleware


router.post("/reset-password-request", resetPasswordRequest);

router.post("/reset-password", resetPassword);
router.post("/otp", resetPasswordMobile);
router.post("/set-new-password", verifyOTPAndResetPassword);


// router.post("/register", authenticateToken, authorizeRole("ADMIN"), register);

module.exports = router;
