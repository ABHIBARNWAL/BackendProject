import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { addVideotoWatchHistory, uploadVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const videoRouter=Router();

videoRouter.route("/upload-video").patch(
    verifyJWT,
    upload.fields(
        [
            {
                name:"videoFile",
                maxCount:1
            }
        ]
    ),
    uploadVideo
)

videoRouter.route("/:id").put(
    verifyJWT,
    addVideotoWatchHistory
)
export default videoRouter;