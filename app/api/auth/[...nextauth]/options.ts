import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                email: { label:"Email", type:"text" },
                password: { label:"Password", type:"password" }
            },
            async authorize(credentials:any): Promise<any>{
                await mongoDBConnecnt();
                try {
                    const user = await UserModel.findOne(
                        {
                            $or:[
                                {email: credentials.identifier },
                                {username: credentials.identifier }
                            ]
                        }
                    );

                    if (!user) {
                        throw new Error("No user found with this email")
                    };
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    };
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (err) {
                    throw new Error("err")
                }
            }
        })
    ],
    pages:{
        signIn:"/sign-in",
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,
    callbacks:{
        async jwt({ token, user}){
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token}){
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.isVerified = token.isVerified;
            }
            return session
        }
    }
}