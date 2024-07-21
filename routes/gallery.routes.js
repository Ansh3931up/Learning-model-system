import { Router } from "express";

import { uploadImage, getgalleries, deleteGallery } from "../controllers/gallery.controller.js";
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router=Router();
console.log("gallery routes");
router.route('/uploadphoto').post(verifyjwt,authorizedRoles('ADMIN'),uploadImage);
router.route("/getgalleries").get(getgalleries);
router.route("/removephoto/:id").delete(verifyjwt,authorizedRoles('ADMIN'),deleteGallery);
export default router;