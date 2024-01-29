import {Router} from "express";
import {changePassword, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateProfile } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const userRouter=Router();

// route for new registration of user
userRouter.route("/register").post(
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
userRouter.route("/login").post(loginUser)

// route for logout the user
userRouter.route("/logout").post(
    verifyJWT,
    logoutUser
)
//to regenarate the access token after expiry
userRouter.route("/refresh-token").post(
    refreshAccessToken
)

//to change the password of the user
userRouter.route("/change-password").patch(
    verifyJWT,
    changePassword,
    logoutUser
)

//to show the details of current user
userRouter.route("/current-user").get(
    verifyJWT,
    getCurrentUser
)

userRouter.route("/update-profile").post(
    verifyJWT,
    updateProfile
)

userRouter.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),//same as field name on frontend),
    updateAvatar
)

userRouter.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverimage"),
    updateCoverImage
)

userRouter.route("/c/:username").get(
    verifyJWT,
    getUserProfile
)

userRouter.route("/watch-history").get(
    verifyJWT,
    getWatchHistory
)


export default userRouter;