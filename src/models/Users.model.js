import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
const jwt=jsonwebtoken()
const userSchema=new Schema({
    id:{
        unique:true,
        required:true,
        type:String
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    avatar:{
        type:String, //CloudnaryService
        required:true,
    },
    coverimage:{
        type:String,
        required:true
    },
    watchHistory:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video'
        }
    ],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=bcrypt.hash(this.password)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=async function()
{
    const accessToken=jwt.sign(
        {
            id:this.id,
            username:this.username,
            email:this.email,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return accessToken
}
userSchema.methods.generateRefreshToken=async function()
{
    const refreshToken=jwt.sign(
        {
            id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return refreshToken
}
export const User=mongoose.model('User',userSchema)