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
app.use(express.static("public"))
app.use(cookieParser())


//Routes import
import router from "./routes/user.routes.js"



//Router declaration
app.use("/api/v1/users",router)
// http:localhost:8000/api/v1/users/register
export {app};