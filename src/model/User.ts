// Usually Document is not required but as using Typescript Type Safety needs to be checked using Document
import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    //Typescript String is written in small caps
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        //String in mongoose is Caps
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    //Typescript String is written in small caps
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        //String in mongoose is Caps
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        //trim: true,
        unique: true,

        //Checks if valid email address is entered or not https://regexr.com
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true,"Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true,"Verify Code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"Verify Code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

//Next JS runs on edge boot up using dedicated backend like express or flask it runs 1 time and whole backend is set but this doesnt apply to next JS so we have to check that if models are present or this is 1st time initialization.

//const UserModel = pre-existing thus models or new thus model

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;