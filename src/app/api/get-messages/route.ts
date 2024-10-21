import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    await dbConnect()

    //getServerSession needs auth Options to fetch session
    const session = await getServerSession(authOptions)

    //User from next-auth is only used to specify the type of user for Typescript
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message: 'Not Authenticated'
        }, {status:401})
    }

    //In options we are actually returning user._id as String for finding byId or findOne it works but here it strictly needs to be like this
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        //Aggregation pipeline important
        const user = await UserModel.aggregate([
            { $match: {id:userId} },
            { $unwind: '$messages'},
            { $sort : {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message: 'User not found'
            }, {status:404})
        }

        return Response.json({
            success:true,
            message: 'User found',
            messages: user[0].messages
        }, {status:200})
    } catch (error) {
        console.log("Failed to fetch messages ", error)
        return Response.json({
            success:false,
            message: 'Failed to fetch messages',
            // messages: user[0].messages
        }, {status:400})
    }
}