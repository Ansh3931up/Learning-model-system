import { Router } from "express";
import {getAllPaycard,getPaycardById, createCard, updateCard, deleteCard, addPostToCardById  } from "../controllers/paymentList.controller.js";
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Routes for '/api/v1/blogs'
router.route('/')
    .get(getAllPaycard)
    .post(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        // upload.single('thumbnail'), // Middleware to handle file uploadS
        createCard                 // Controller function to create a new blog
    );

// Routes for '/api/v1/blogs/:id'
router.route('/:id')
    .get(
        verifyjwt,      // Middleware to verify JWT token
        getPaycardById     // Controller function to get a blog by ID
    )
    .put(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        updateCard                  // Controller function to update a blog by ID
    )
    .delete(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        deleteCard                  // Controller function to delete a blog by ID
    )
    .post(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        upload.single('thumbnail'), // Middleware to handle file upload
        addPostToCardById           // Controller function to add a post to a blog by ID
    );

export default router;
