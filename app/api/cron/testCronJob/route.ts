import { NextResponse } from "next/server";
import { handleAPIError } from "@/app/lib/api/handleError";
import { sendEmail } from "@/app/lib/email";

export const dynamic = "force-dynamic"; // Force dynamic (server) route instead of static page
export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    await sendEmail({
      to: "m.galenda5@gmail.com",
      subject: `Testing cron job ${new Date().toLocaleString()}`,
      html: `
            <h1>Testing a cron job!</h1>
          `,
    });
    return NextResponse.json({success: true});
  } catch (error) {
    return handleAPIError(error);
  }
}
