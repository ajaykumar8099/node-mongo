const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/signup", userController.SignUp);
router.post("/email/verification/:id", userController.EmailOtpVerification);
router.post("/signin", userController.SignIn);
router.get("/allusers", userController.GetAllUsers);
router.get("/single/:id", userController.GetSingleUser);
router.put("/update/:id", userController.UpdateUser);
router.delete("/delete/:id", userController.DeleteUser);

module.exports = router;
