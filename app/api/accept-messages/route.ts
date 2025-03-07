import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoDBConnecnt from "@/db/connectMongoDB";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await mongoDBConnecnt();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if( !session || !user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    };

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
        
    } catch (error) {
        console.log("Faild to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }

}