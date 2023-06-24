const express = require("express");
const userController = require("../controllers/userController");
const middleware = require("../middleware/authorization");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getme", middleware.verifyToken, userController.getMe);
router.post("/check-email", userController.checkEmail);
router.post("/check-username", userController.checkUsername);
router.put(
  "/upload",
  middleware.verifyToken,
  upload.single("image"),
  userController.uploadImage
);
router.delete("/delete", userController.delete);

module.exports = router;
