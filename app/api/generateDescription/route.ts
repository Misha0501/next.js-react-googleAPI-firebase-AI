import { NextResponse } from "next/server";
import openAI from "@/app/lib/openAI";
import OpenAI from "openai";
import { ResponseError } from "@/classes/ResponseError";
import * as z from "zod";
import {openAISchema} from "@/app/lib/validations/openAI";

export async function POST(request: Request) {
  try {
    const parsedValues = openAISchema.parse(await request.json());

    const completion = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content: `When responding, ignore fields that are null or unset. Limit the response to 2200 characters`,
        },
        {
          role: "user",
          content: `Hi there, provide a description of a property for sale/rent (depending on the listingType). Imagine you are the owner of the property. Try to include something about the location of the property. The property data: ${JSON.stringify(
            parsedValues,
          )})}`,
        },
      ],
    });

    if (
      !completion ||
      !completion.choices ||
      !completion.choices[0] ||
      !completion.choices[0].message
    ) {
      throw new ResponseError(
        "Something went wrong, please try again later.",
        500,
      );
    }
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
  }
  return new Response("Something went wrong, please try again later.", {
    status: 500,
  });
}
