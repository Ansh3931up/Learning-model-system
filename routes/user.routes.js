import { Router } from "express";
import {register,login,logout,getProfile} from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyjwt } from "../middleware/auth.middleware.js";
const router=Router();

router.route("/register").post(upload.single("avatar"),register);
router.route("/login").post(login);
router.route("/logout").post(verifyjwt,logout);
router.route("/me").post(verifyjwt,getProfile);

export default router;