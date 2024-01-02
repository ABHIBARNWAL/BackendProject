import mongoose from "mongoose";

const subscriptionSchema=new mongoose.Schema(
    {
        // whom the user has suscribe to
        subscriber:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        // the channel of the user
        channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    },
    {
        timestamps:true
    }
)

export const Subscription=mongoose.model("Subscription", subscriptionSchema);