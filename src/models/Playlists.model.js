import { Schema, model }  from "mongoose";

 const playlistSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        videos:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        playlistType:{
            type:String,
            enum:['Public','Private'],
            default:'Private'
        }

    },
    {
        timestamps:true
    }
 );

export const Playlist=model('Playlist',playlistSchema);

