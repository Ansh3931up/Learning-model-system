import ApiResponse from "../utilities/ApiResponse.js";
import ApiError from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { Course } from "../module/course.model.js";
import { uploadOnCloudinary } from "../utilities/cloudinary.js";

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).select('-lectures');

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "All courses present"));
});

const getCourseById = asyncHandler(async (req, res) => {
    // Example implementation, you should implement as per your requirement
    const id= req.user._id;
    console.log(id);
    if(!id){
        throw new ApiError(404,"you are not logged in")
    }
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, 'Course not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course found"));
});
const createCourse=asyncHandler(async(req,res)=>{
    const {title,description,category,createdby}=req.body;
    if([title,description,category,createdby].some((items)=>items?.trim=="")){ throw new ApiError(404, "incomplete information ");}
    console.log(req.file)
    const thumbnailLocalPath=req.file?.path;//ye req ka extra path files vala multer provide krata ha
    // // const coverImageLocalPath=req.files?.coverImage[0]?.path; 

   
    if(!thumbnailLocalPath){
    throw new ApiError(400,"thumbnail path is not found")
    }


    const { secure_url: thumbnailUrl } = await uploadOnCloudinary(thumbnailLocalPath);
    // // const coverImage= await uploadOnCloudinary(coverImageLocalPath);

    if(!thumbnailUrl){
    throw new ApiError(400,"thumbnail is enable to be storaed")
    }
    const newcourse=await Course.create({
        title,
        description,
        category,
        createdby,
        thumbnail:thumbnailUrl
    })
    const createdcourse=await Course.findById(newcourse._id);
    await newcourse.save()
    if(!createdcourse){
        throw new ApiError(404,"not created");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,newcourse,"Course created successfully"));
})
const updateCourse=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    console.log(id);
    const {title,description,category,createdby}=req.body;
    console.log(req.body);
    const new_course=await Course.findByIdAndUpdate(
        id,
        {
            $set:req.body

        },
        {
            runValidators:true,
            new:true
        }
    )
    await new_course.save();


    return res
        .status(200)
        .json(new ApiResponse(200,new_course,"updated successfully"));
})

const deleteCourse=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    await Course.findByIdAndDelete(id);    

    return res
        .status(200)
        .json(new ApiResponse(200,Course,"deleted successfully"));
})
const addLectureToCourseById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    console.log(req.body);
    const {title,description}=req.body;
    if(!title||!description){
        throw new ApiError(404,"title or description absent");
    }
    const course=await Course.findById(id);
    if(!course){
        throw new ApiError(404,"course not found");
    }
    const thumbnailLocalPath=req.file?.path;//ye req ka extra path files vala multer provide krata ha
    // // const coverImageLocalPath=req.files?.coverImage[0]?.path; 

   
    if(!thumbnailLocalPath){
    throw new ApiError(400,"thumbnail path is not found")
    }


    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    // // const coverImage= await uploadOnCloudinary(coverImageLocalPath);
console.log(thumbnail);
    if(!thumbnail){
    throw new ApiError(400,"thumbnail is enable to be storaed")
    }
    const lectureData={
        title,
        description,
        thumbnail
    }
    course.lectures.push(lectureData);
    course.numberoflectures=course.length;
    await course.save();
    
    return res
        .status(200)
        .json(new ApiResponse(200,Course,"deleted successfully"));
})

export { getAllCourses, getCourseById ,createCourse,updateCourse,deleteCourse,addLectureToCourseById};
