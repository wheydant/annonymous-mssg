import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
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

    const userId = user._id;

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser){
            return Response.json({
                success:false,
                message: 'Failed to update user status to accept messages'
            }, {status:500})
        }

        return Response.json({
            success:true,
            message: 'Message acceptance status updated successfully',
            updatedUser
        }, {status:200})

        
    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success:false,
            message: 'Failed to update user status to accept messages'
        }, {status:500})
    }
}

export async function GET(){
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

    const userId = user._id;

    try {
            const foundUser = await UserModel.findById(userId)
        
            if(!foundUser){
                return Response.json({
                    success:false,
                    message: 'User not found'
                }, {status:404})
            }
        
            return Response.json({
                success:true,
                message: 'Message acceptance status updated successfully',
                isAcceptingMessages: foundUser.isAcceptingMessage
            }, {status:200})
    } catch (error) {
        console.log("Error in getting Message Accepting Status", error)
        return Response.json({
            success:false,
            message: 'Error in getting Message Accepting Status'
        }, {status:500})
    }
}