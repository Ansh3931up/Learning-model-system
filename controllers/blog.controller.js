import ApiResponse from "../utilities/ApiResponse.js";
import ApiError from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { Blog } from "../module/blog.model.js"; // Updated import for Blog model
import { uploadOnCloudinary } from "../utilities/cloudinary.js";

const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).select('-posts'); // Assuming 'posts' is analogous to 'lectures' in Blog model

    return res
        .status(200)
        .json(new ApiResponse(200, blogs, "All blogs present"));
});

const getBlogById = asyncHandler(async (req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, 'Blog not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, blog, "Blog found"));
});

const createBlog = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { title, description,thumbnail } = req.body;

    if ([title, description,thumbnail].some(items => items?.trim() === "")) {
        throw new ApiError(404, "Incomplete information");
    }

    const newBlog = await Blog.create({
        title,
        description,
    
     
        thumbnail    });

    if (!newBlog) {
        throw new ApiError(404, "Blog not created");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newBlog, "Blog created successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // const { title, description } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $set: req.body },
        { runValidators: true, new: true }
    );

    await updatedBlog.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBlog, "Updated successfully"));
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, "Blog deleted successfully"));
});

const addPostToBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title or description missing");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found");
    }

    const { secure_url: thumbnailUrl } = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnailUrl) {
        throw new ApiError(400, "Failed to upload thumbnail to Cloudinary");
    }

    const postData = {
        title,
        description,
        thumbnail: thumbnailUrl
    };

    blog.posts.push(postData); // Assuming 'posts' is analogous to 'lectures' in Blog model
    blog.numberofposts = blog.posts.length; // Update numberofposts

    await blog.save();

    return res.status(200).json(new ApiResponse(200, blog, "Post added successfully"));
});

export { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, addPostToBlogById };
