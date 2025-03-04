import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerifitationEmail";
import { ApiResponce } from "@/types/ApiResponce";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponce> {
    try {

        await resend.emails.send(
            {
                from: "you@example.com",
                to: email,
                subject: "Mystry message | Verification code",
                react: VerificationEmail({username,otp:verifyCode})
            }
        )

        return {
            success: true,
            message: "Verification email send sucessfully"
        }

    } catch (error) {
        console.error("Error sending verification email")
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}