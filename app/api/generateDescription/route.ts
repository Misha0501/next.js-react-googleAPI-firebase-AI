import { NextResponse } from "next/server";
import OpenAI from "openai";
import { openAISchema } from "@/app/lib/validations/openAI";
import {
  generateUserMessageContent,
  getOpenAICompletion,
  validateOpenAIResponse,
} from "@/app/api/generateDescription/_utils";
import { handleAPIError } from "@/app/lib/api/handleError";

export const maxDuration = 60;
export async function POST(request: Request) {
  // TODO: re-enable generate description
  return new Response("Feature temporarily disabled", { status: 503 });

  try {
    const parsedValues = openAISchema.parse(await request.json());

    const userMessageContent = generateUserMessageContent(parsedValues);

    const completion = await getOpenAICompletion(userMessageContent);

    validateOpenAIResponse(completion);

    let content = completion.choices[0].message.content;

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error);
      return new Response(error.name, { status: error.status });
    }

    return handleAPIError(error);
  }
}
