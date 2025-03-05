import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UserNameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET( request: Request) {

    await mongoDBConnecnt();
    try {
        const { searchParams } = new URL( request.url );
        const queryParam = {
            username: searchParams.get("username")
        };
        // zod
        const result = UserNameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success:false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters"
                },{
                    status:400
                }
            )
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        if (existingVerifiedUser) {
            return Response.json({
                success:true,
                message:"Username is already taken"
            },{
                status:400
            })
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        },{
            status:400
        })
    } catch (error) {
        console.log(error,"Error on checking username")
        return Response.json(
            {
                message:"Error checking username",
                success:false
            },{
                status:500
            }
        )
    }
}