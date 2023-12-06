// require('dotenv').config()

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path: './env'
})


connectDB()
/* ConnectDB is asyncronous function that's why it will return Promise */

.then(() => {
    app.on("error",(err)=>{
        console.log("Error: ",err)
        throw err;
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})









/*
-- This is one of the approach and better approach keep this connection in another folder

import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";

const app=express();
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.log("Error: ",error)
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening on: ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("error: ",error);
        throw error;
    }
})()

*/