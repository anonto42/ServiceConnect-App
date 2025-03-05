import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
    
    await mongoDBConnecnt();
    
    try {
        const { username, email, password } = await request.json();
        const existinguserVerifiedByUserName = await UserModel.findOne(
            {
                username,
                isVerified:true
            }
        );

        if( existinguserVerifiedByUserName ){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },{
                    status:400
                }
            )
        };

        const existingUserByEmail = await UserModel.findOne({email});
        const varifyCode = Math.floor( 100000 + Math.random() * 900000 ).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email"
                    },{
                        status:400
                    }
                )    
            }else{
                const hasedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.varifyCode = varifyCode;
                existingUserByEmail.varifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
            const hasedPassword = await bcrypt.hash(password,10);
            const expiryData: Date = new Date()
            expiryData.setHours(expiryData.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                varifyCode,
                varifyCodeExpiry: expiryData,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponce = await sendVerificationEmail(email,username,varifyCode);

        if (!emailResponce.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponce.message
                },{
                    status:500
                }
            ) 
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully"
            },{
                status:200
            }
        )


    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}