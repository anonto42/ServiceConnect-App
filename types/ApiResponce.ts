import { messageType } from "@/model/User";

export interface ApiResponce {
    success: boolean;
    message: string;
    isAccesptingMessages?: boolean;
    messages?: Array<messageType>
}