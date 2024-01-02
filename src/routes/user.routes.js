import {Router} from "express";
import { changePassword, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateProfile } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router=Router();

// route for new registration of user
router.route("/register").post(
    upload.fields(
        [
            {
                name:'avatar',//same as field name on frontend
                maxCount:1
            },
            {
                name:'coverimage',//same as field name on frontend
                maxCount:1
            }
        ]
    )
    ,registerUser
)
// route for login of user 
router.route("/login").post(loginUser)

// route for logout the user
router.route("/logout").post(
    verifyJWT,
    logoutUser
)
//to regenarate the access token after expiry
router.route("/refresh-token").post(
    refreshAccessToken
)

//to change the password of the user
router.route("/change-password").patch(
    verifyJWT,
    changePassword,
    logoutUser
)

//to show the details of current user
router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
)

router.route("/update-profile").post(
    verifyJWT,
    updateProfile
)

router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),//same as field name on frontend),
    updateAvatar
)

router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverimage"),
    updateCoverImage
)

router.route("/channel").get(
    verifyJWT,
    getUserProfile
)

router.route("/watch-history").get(
    verifyJWT,
    getWatchHistory
)

export default router;