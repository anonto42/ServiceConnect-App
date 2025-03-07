import mongoose, { Schema, Document, model, models, Model } from "mongoose";

export interface userType extends Document {
    createdAt: string;
    username: string;
    email: string;
    password: string;
    varifyCode: string;
    varifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: messageType[];
};

export interface messageType extends Document {
    createdAt:Date;
    content:string;
};

const messageSchema: Schema<messageType> = new Schema(
    {
        content:{
            type:String,
            required:true
        },
    },
    {
        timestamps:true
    }
);

const userSchema: Schema<userType> = new Schema(
    {
        username: {
            type:String,
            required:[true,"User name is required"],
            trim:true,
            unique:true
        },
        email: {
            type:String,
            required:[true,"Emain is required"],
            unique:true,
            match:[/.+\@.+\..+/,"please use a valid email"]
        },
        password: {
            type:String,
            required:[true,"Password is required"]
        },
        varifyCode: {
            type: String,
            required:[true,"Varify code is required"]
        },
        varifyCodeExpiry: {
            type:Date,
            required:[true,"Varify code expiry is required"]
        },
        isAcceptingMessage: {
            type:Boolean,
            default:true
        },
        isVerified: {
            type:Boolean,
            default:false
        },
        messages: [ messageSchema ]
    },
    {
        timestamps:true
    }
);

const UserModel = ( models.User as Model<userType> ) || ( model<userType>("User",userSchema) );

export default UserModel;