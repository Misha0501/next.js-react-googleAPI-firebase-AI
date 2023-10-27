import { NextResponse } from "next/server";
import openAI from "@/app/lib/openAI";
import OpenAI from "openai";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import * as z from "zod";
import {openAISchema} from "@/app/lib/validations/openAI";
import {
  generateUserMessageContent,
  getOpenAICompletion,
  validateOpenAIResponse
} from "@/app/api/generateDescription/_utils";

export async function POST(request: Request) {
  try {
    const parsedValues = openAISchema.parse(await request.json());

    const userMessageContent = generateUserMessageContent(parsedValues);

    const completion = await getOpenAICompletion(userMessageContent);

    validateOpenAIResponse(completion);

    let content = completion.choices[0].message.content;

    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    if (error instanceof ResponseError) {
      return new Response(error.message, { status: error.status });
    }

    if (error.errorInfo && error.errorInfo.code) {
      return new Response(
        "Your auth token is invalid or it has expired. Get a new auth token and try again.",
        { status: 400 },
      );
    }

    if (error instanceof OpenAI.APIError) {
      return new Response(error.name, { status: error.status });
    }

    return new Response("Something went wrong, please try again later.", {
      status: 500,
    });
  }
}
