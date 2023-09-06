import { NextResponse } from "next/server";
import openAI from "@/app/lib/openAI";
import OpenAI from "openai";
import { ResponseError } from "@/classes/ResponseError";
import * as z from "zod";

export async function POST(request: Request) {
  // todos in the body of the POST req
  // const { todos } = await request.json();
  // console.log(todos);
  try {
    const propertyDescription = {
      listingType: "SELL",
      interiorType: "Furnished",
      propertyTypeId: "Apartment",
      upkeepType: "excellent",
      price: "123.000",
      currency: "euros",
      address: {
        streetNumber: "2",
        route: 'ulitsa "Sofia"',
        locality: "Ruse",
        postalCode: "7001",
        neighborhood: "",
        administrativeAreaLevelOne: "Ruse",
      },
      areaLiving: "100",
      areaLand: "250",
      volume: "500",
      areaOutside: "64",
      areaGarage: "12",
      rooms: "5",
      bathrooms: "2",
      bedrooms: "3",
      parking: true,
      constructedYear: "",
      floorNumber: "0",
      numberOfFloorsProperty: "3",
      numberOfFloorsCommon: "0",
      heatingType: "CENTRAL",
    };

    const completion = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content: `When responding, ignore fields that are null or unset. Limit the response to 2250 characters`,
        },
        {
          role: "user",
          content: `Hi there, provide a description of a property for sale/rent (depending on the listingType). Imagine you are the owner of the property. Doesn't mention Try to include something about the location of the property. The property data: ${JSON.stringify(
            propertyDescription,
          )})}`,
        },
      ],
    });

    console.log(completion);
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
    if (error instanceof OpenAI.APIError) {
      return new Response(error.name, { status: error.status });
    }
  }
  return new Response("Something went wrong, please try again later.", {
    status: 500,
  });
}
