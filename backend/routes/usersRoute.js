const router = require("express").Router();
const { getAllUsersCtrl, getUserProfileCtrl, updatetUserProfileCtrl, getUsersCountCtrl, profilePhotoUploadCtrl, deletetUserProfileCtrl } = require("../Controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const {  verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization } = require("../middlewares/verifyToken");


// /api/users/profile
router.get("/profile", verifyTokenAndAdmin,getAllUsersCtrl );

// /api/users/profile/:id
router.route("/profile/:id")
        .get(validateObjectId,getUserProfileCtrl)
        .put(validateObjectId,verifyTokenAndOnlyUser,updatetUserProfileCtrl)
        .delete(validateObjectId,verifyTokenAndAuthorization,deletetUserProfileCtrl);

// /api/users/profile/profile-photo-upload
router.route("/profile/profile-photo-upload")
        .post(verifyToken,photoUpload.single("image"),profilePhotoUploadCtrl);

// /api/users/count
router.get("/count", verifyTokenAndAdmin,getUsersCountCtrl );

module.exports = router;