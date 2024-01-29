import express, { urlencoded }  from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({
    limit:"16kb"
}))
app.use(urlencoded({
    extended:true,
    limit:"16kb"
}))

// to serve file from local directory i.e. public
app.use(express.static("public"))
app.use(cookieParser())


//Routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";



//Router declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter)
// http:localhost:8000/api/v1/users/register
export {app};