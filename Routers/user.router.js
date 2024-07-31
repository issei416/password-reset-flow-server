import express from "express";
import { changePassword, checkString, forgotPassword, loginUser, registerUser } from "../Controllers/user.controller.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword)
router.post('/checkstring',checkString)
router.post('/changepassword', changePassword);



export default router