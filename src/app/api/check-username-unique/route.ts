export const dynamic = 'force-dynamic';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    // if(request.method != 'GET'){
    //     return Response.json({
    //         success:false,
    //         message: 'Method not allowed'
    //     }, {status:405})
    // }

    await dbConnect()
    // localhost:3000/api/ccc?username=one?email=one@one.com

    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //validate with zod
        //safeParse compares with provided schema, it needs an object with parameters in it to be checked
        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json({
                success:false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, {status:400})
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message: 'Username is already taken'
            }, {status:400})
        }

        return Response.json({
            success:true,
            message: 'Username is unique'
        }, {status:200})

    }catch (error){
        console.log("Error checking username", error)
        return Response.json({
                success: false,
                message: "Error Checking username"
            },{status:500}
        )
    }
}