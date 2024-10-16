import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()

        //Check if user exists and return it
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exist"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();

        //If email is already registered
        if (existingUserByEmail){
            //If email is verified
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email"
                    },
                    {
                        status: 400
                    }
                )
            }
            //Email is used but not verified giving option to set password again
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else {
            //New user all together
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: false,
                messages: []
            })

            await newUser.save()
        }

        //Good coding practice Email response is send for both the cases new user and unauth user

        //Helpers makes it easy
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            ) 
        }
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },
            {
                status: 201
            }
        )

    }catch (error) {
        console.log('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
    
}
