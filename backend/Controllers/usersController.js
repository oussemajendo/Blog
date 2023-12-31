const asyncHandler = require("express-async-handler");
const {  User, ValidateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {cloudinaryRemoveImage,cloudinaryUploadImage,cloudinaryRemoveMultipleImage}= require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");

/**----------------------------------------------------------------
 * @desc  Get All Users Profile
 * @Route /api/users/profile
 * @method GET
 * @access private (only admin)
 ---------------------------------------------------------------- */
 module.exports.getAllUsersCtrl =asyncHandler(async(req,res)=>{
      const users = await User.find().select("-password").populate("posts");
      res.status(200).json(users);
 });

 /**----------------------------------------------------------------
 * @desc  Get User Profile
 * @Route /api/users/profile/:id
 * @method GET
 * @access public 
 ---------------------------------------------------------------- */
 module.exports.getUserProfileCtrl =asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password").populate("posts");
    if(!user){
        return res.status(404).json({ message: "user not found"});
    }
    res.status(200).json(user);
});

/**----------------------------------------------------------------
 * @desc  Update User Profile
 * @Route /api/users/profile/:id
 * @method PUT
 * @access private (only user himself) 
 ---------------------------------------------------------------- */
 module.exports.updatetUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
    },
    { new: true }
  ).select("-password")
  .populate("posts");
  res.status(200).json(updateUser);
});

/**----------------------------------------------------------------
 * @desc  Get Users Count
 * @Route /api/users/count
 * @method GET
 * @access private (only admin)
 ---------------------------------------------------------------- */
 module.exports.getUsersCountCtrl =asyncHandler(async(req,res)=>{
  const count = await User.count();
  res.status(200).json(count);
});

/**----------------------------------------------------------------
 * @desc  Profile Photo Upload
 * @Route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 ---------------------------------------------------------------- */
 module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // Validation
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  // Upload to Cloudinary
  const result = await cloudinaryUploadImage(req.file.path);

  // Get the User from DB
  const user = await User.findById(req.user.id);

  // Delete the old profile photo if it exists
  if (user.profilePhoto && user.profilePhoto.publicId) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // Change the profile photo field in DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  // Send response to the client
  res.status(200).json({
    message: "Your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  // Remove the temporary file from the server
  fs.unlinkSync(req.file.path);
});

 /**----------------------------------------------------------------
 * @desc  Delete User Profile (Account)
 * @Route /api/users/profile/:id
 * @method Delete
 * @access private (only admin or user)
 ---------------------------------------------------------------- */
 module.exports.deletetUserProfileCtrl = asyncHandler(async (req, res) => {
  //Get the user from DB
  const user = await User.findById(req.params.id);
  if(!user){
    res.status(404).json({ message : "user not found"});
  };
  //Get all posts from DB
  const posts = await Post.find({ user: user._id });

  // Get the public ids from the posts
  const publicIds = posts?.map((post) => post.image.publicId);

  //Delete all posts image from cloudinary that belong to user 
  if(publicIds?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicIds);
  }

  //Delete the profile picture from cloudinary 
  if(user.profilePhoto.publicId === null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //Delete user posts & comments
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  //Delete the user by himself
    await User.findByIdAndDelete(req.params.id);

  //Send the response to the client
  res.status(200).json({ message: " the user profile has been deleted "})
 });