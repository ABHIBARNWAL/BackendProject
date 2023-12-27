import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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
    ,registerUser)
// route for login of user 
router.route("/login").post(loginUser)

// route for logout the user
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

router.route("/refresh-token").post(
    refreshAccessToken
)
export default router;