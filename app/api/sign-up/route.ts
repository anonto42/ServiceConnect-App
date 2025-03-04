import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
    
    await mongoDBConnecnt();
    
    try {
        const { username, email, password } = await request.json()
        
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