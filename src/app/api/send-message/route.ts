import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message: 'User not found'
            }, {status:404})
        }

        //is User accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message: 'User not accepting messages'
            }, {status:403})
        }

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)

        return Response.json({
            success:true,
            message: 'Message sent successfully'
        }, {status:200})

    } catch (error) {
        console.log("Error while sending message ",error)
        return Response.json({
            success:false,
            message: 'Error while sending message'
        }, {status:500})
    }
}