import { Router } from "express";
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, addPostToBlogById } from "../controllers/blog.controller.js";
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Routes for '/api/v1/blogs'
router.route('/')
    .get(getAllBlogs)
    .post(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        // upload.single('thumbnail'), // Middleware to handle file upload
        createBlog                  // Controller function to create a new blog
    );

// Routes for '/api/v1/blogs/:id'
router.route('/:id')
    .get(
        verifyjwt,      // Middleware to verify JWT token
        getBlogById     // Controller function to get a blog by ID
    )
    .put(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        updateBlog                  // Controller function to update a blog by ID
    )
    .delete(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        deleteBlog                  // Controller function to delete a blog by ID
    )
    .post(
        verifyjwt,                  // Middleware to verify JWT token
        authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
        upload.single('thumbnail'), // Middleware to handle file upload
        addPostToBlogById           // Controller function to add a post to a blog by ID
    );

export default router;
