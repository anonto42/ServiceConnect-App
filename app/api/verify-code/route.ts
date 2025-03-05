import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel, { userType }  from "@/model/User";


export async function POST( request: Request ){
    await mongoDBConnecnt();
    try {
        const {username, code} = await request.json();
        const decodeUsername =decodeURIComponent(username);
        const user: userType | null = await UserModel.findOne({username:decodeUsername});

        if (!user) {
            Response.json(
                {
                    success:false,
                    message: "User not found"
                },{
                    status:400
                }
            )
        }

        const isCodeValid: boolean = user?.isVerified === code;
        const isCodeNotExpired: boolean = new Date(user?.varifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user?.isVerified = true
            await user?.save()

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },{
                    status:200
                }
            )
        }else if (!isCodeNotExpired){
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired"
                },{
                    status:400
                }
            )
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },{
                    status:400
                }
            )
        }
        
    } catch (error) {
        console.log("Error in verifying user",error)
        Response.json(
            {
                success:false,
                message: "Error in verifying user"
            },{
                status:500
            }
        )
    }
}