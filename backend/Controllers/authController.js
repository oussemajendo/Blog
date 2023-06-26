const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {  User,ValidateRegisterUser,ValidateLoginUser } = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const VerificationToken = require("../models/VerificationToken");

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

           // Creating new VerificationToken & save it toDB
           const verificationToken = new VerificationToken({
            userId : user._id,
            token : crypto.randomBytes(32).toString("hex"),

           });
           await verificationToken.save();

           // Making the link
           const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

           // Putting the link into an html template
               const htmlTemplate = `
               <div> 
               <p>Click on the link below to verify your email </p>
               <a href="${link}">Verify</a>
               </div>
               `
           
           // Sending email to the user
              await sendEmail(user.email,"Verify Your Email",htmlTemplate);

           // Response to the client

          //send response to client 
          res.status(201)
          .json({ message: "we send to you an email, please verify your email address" });
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
        
      }
        
      if(!user.isAccountVerified) {
        let verificationToken = await  VerificationToken.findOne({
          userId : user._id
        });
        if(!verificationToken){
           verificationToken = await new VerificationToken({
            userId : user._id,
            token : crypto.randomBytes(32).toString("hex")
          });
          await verificationToken.save();
        }
   
        const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

 
            const htmlTemplate = `
            <div> 
            <p>Click on the link below to verify your email </p>
            <a href="${link}">Verify</a>
            </div>
            `
           await sendEmail(user.email,"Verify Your Email",htmlTemplate);

        return res
          .status(400)
          .json({ message: "we sent to you an email, please verify your email address" });
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


 /**----------------------------------------------------------------
 * @desc Verify User Account
 * @Route /api/auth/:userId/verify/:token
 * @method Get
 * @access public
 ---------------------------------------------------------------- */
 module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid link" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!verificationToken) {
    return res.status(400).json({ message: "Invalid link" });
  }

  user.isAccountVerified = true;
  await user.save();

  await VerificationToken.deleteOne({
    userId: user._id,
    token: req.params.token,
  });

  res.status(200).json({ message: "Your account has been verified" });
});
