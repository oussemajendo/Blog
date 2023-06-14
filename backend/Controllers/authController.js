const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {  User,ValidateRegisterUser,ValidateLoginUser } = require("../models/User");


/**----------------------------------------------------------------
 * @desc Register New User
 * @Route /api/auth/register
 * @method POST
 * @access public
 ---------------------------------------------------------------- */

 module.exports.registerUserCtrl =asyncHandler(async(req,res)=>{
    //Validation
    const {error}= ValidateRegisterUser(req.body);
    if(error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    //is user already exists
    let user = await User.findOne({ email: req.body.email });
    if(user){
      return res.status(400).json({ message: "User Already Exists"});
    } 
    //hash the password 
    const Salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, Salt);
    //new user and save it 
    user = new User ({
      username : req.body.username,
      email : req.body.email,
      password : hashedPassword ,
    });
   await user.save();

           // TO Do -sending email (verify account)

    //send response to client 
    res.status(201).json({ message: "you registered successufully, Please log in " });
 });
/**----------------------------------------------------------------
 * @desc Login User
 * @Route /api/auth/login
 * @method POST
 * @access public
 ---------------------------------------------------------------- */
 module.exports.loginUserCtrl =asyncHandler(async(req,res)=>{
      //Validation
      const {error}= ValidateLoginUser(req.body);
      if(error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      //is user exist
      const user = await User.findOne({ email: req.body.email });
    if(!user){
      return res.status(400).json({ message: "invalid email or password"});
    }
      //check the password
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if(!isPasswordMatch){
        return res.status(400).json({ message: "invalid email or password"});
        
        // TO Do -sending email (verify account if not verified)
      }
      //generate token(jwt)
      const token = user.generateAuthToken();

      //response to client
      res.status(200).json({
        _id : user._id,
        isAdmin : user.isAdmin,
        profilePhoto : user.profilePhoto,
        token,
        username : user.username,
      });
 });
