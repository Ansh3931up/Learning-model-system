import ApiResponse from "../utilities/ApiResponse.js";
import ApiError from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
// import { Blog } from "../module/blog.model.js"; // Updated import for Blog model
import { Paycard } from "../module/paymentList.model.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";

const getAllPaycard = asyncHandler(async (req, res) => {
    console.log('allcard');
    const Cards = await Paycard.find({}).select('-posts'); // Assuming 'posts' is analogous to 'lectures' in Blog model
    console.log('allcard',Cards);
    return res
        .status(200)
        .json(new ApiResponse(200, Cards, "All Cards present"));
});

const getPaycardById = asyncHandler(async (req, res) => {
    const cardId = req.params.id;
    const card = await Paycard.findById(cardId);

    if (!card) {
        throw new ApiError(404, 'Card not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, card, "Card found"));
});

const createCard = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { title, description,thumbnail,price,preview } = req.body;

    if ([title, description,thumbnail,price,preview].some(items => items?.trim() === "")) {
        throw new ApiError(404, "Incomplete information");
    }

    const newCard = await Paycard.create({
        title,
        description,
        price, 
        thumbnail,preview    });

    if (!newCard) {
        throw new ApiError(404, "Card not created");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newCard, "Card created successfully"));
});

const updateCard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // const { title, description } = req.body;

    const updatedCard = await Paycard.findByIdAndUpdate(
        id,
        { $set: req.body },
        { runValidators: true, new: true }
    );

    await updatedCard.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCard, "Updated successfully"));
});

const deleteCard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Paycard.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, "Card deleted successfully"));
});

const addPostToCardById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description,price,preview } = req.body;

    if (!title || !description||!price||!preview) {
        throw new ApiError(400, "Title or description missing");
    }

    const Card = await Paycard.findById(id);

    if (!Card) {
        throw new ApiError(404, "Card not found");
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
        thumbnail: thumbnailUrl,
        price,preview
    };

    card.posts.push(postData); // Assuming 'posts' is analogous to 'lectures' in Blog model
    card.numberofposts = card.posts.length; // Update numberofposts

    await card.save();

    return res.status(200).json(new ApiResponse(200, card, "Post added successfully"));
});

export { getAllPaycard,getPaycardById, createCard, updateCard, deleteCard, addPostToCardById };
