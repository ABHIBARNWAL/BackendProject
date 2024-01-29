import{model,Schema} from 'mongoose';

const dislikeSchema=new Schema(
    {
        dislike:{
            type:Boolean
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:'Video'
        },
        tweet:{
            type:Schema.Types.ObjectId,
            ref:'Tweet'
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    },
    {
        timestamps:true
    }
)

export const Dislike=model('Dislike',dislikeSchema);