
import { Router } from "express";
import { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,addLectureToCourseById } from "../controllers/course.controller.js";
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const routers = Router();

// Routes for '/api/v1/courses'
routers.route('/')
    .get(getAllCourses)
    .post(
        verifyjwt,          // Middleware to verify JWT token
        authorizedRoles('ADMIN'),    // Middleware to authorize based on roles
        upload.single('thumbnail'), // Middleware to handle file upload
        createCourse        // Controller function to create a new course
    );

// Routes for '/api/v1/courses/:id'
routers.route('/:id')
    .get(
        verifyjwt,      // Middleware to verify JWT token
        getCourseById   // Controller function to get a course by ID
    )
    .put(
        verifyjwt,          // Middleware to verify JWT token
        authorizedRoles('ADMIN'),    // Middleware to authorize based on roles
        updateCourse        // Controller function to update a course by ID
    )
    .delete(
        verifyjwt,          // Middleware to verify JWT token
        authorizedRoles('ADMIN'),    // Middleware to authorize based on roles
        deleteCourse        // Controller function to delete a course by ID
    )
    .post(
        verifyjwt,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        addLectureToCourseById
    );

export default routers;
