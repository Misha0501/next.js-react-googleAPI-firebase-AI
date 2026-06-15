import { NextResponse } from "next/server";
import OpenAI from "openai";
import { openAISchema } from "@/app/lib/validations/openAI";
import {
  generateUserMessageContent,
  getOpenAICompletion,
  validateOpenAIResponse,
} from "@/app/api/generateDescription/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";
import { getDecodedIdToken } from "@/app/lib/getDecodedIdToken";
import { checkRateLimit } from "@/app/lib/redis/rateLimit";

export const maxDuration = 60;
export async function POST(request: Request) {
  // TODO: re-enable generate description
  return new Response("Feature temporarily disabled", { status: 503 });

  try {
    const decodedToken = await getDecodedIdToken();

    if (!(await checkRateLimit(`rate:desc:${decodedToken.uid}`, 5, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const parsedValues = openAISchema.parse(await request.json());

    const userMessageContent = generateUserMessageContent(parsedValues);

    const completion = await getOpenAICompletion(userMessageContent);

    validateOpenAIResponse(completion);

    let content = completion.choices[0].message.content;

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error);
      return new Response((error as any).name, { status: (error as any).status });
    }

    return handleAPIError(error);
  }
}
