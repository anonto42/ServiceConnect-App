import UserModel from "@/model/User";
import mongoDBConnecnt from "@/db/connectMongoDB";
import { messageType } from "@/model/User";

export async function POST(request: Request) {
    await mongoDBConnecnt();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as messageType)
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message send successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("An unexpected error occurd: ", error)
        return Response.json(
            {
                success: false,
                message: "Error added message"
            },
            {
                status: 500
            }
        )
    }
    
}