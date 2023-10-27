import openAI from "@/app/lib/openAI";
import { ResponseError } from "@/app/lib/classes/ResponseError";
import { ChatCompletion } from "openai/resources/chat";

/**
 * Generate the user message content for OpenAI API.
 * @param {any} parsedValues - The parsed values.
 * @returns {string} - Returns the generated message content.
 */
export const generateUserMessageContent = (parsedValues: any): string => {
  return `Hi there, provide a description of a property for sale/rent (depending on the listingType). 
    Imagine you are the owner of the property. Try to include something about the location of the property. 
    The property data: ${JSON.stringify(parsedValues)})}`;
};

/**
 * Call OpenAI API to get completion.
 * @param {string} userMessageContent - The user message content for OpenAI API.
 * @returns {Promise<any>} - Returns the completion result.
 */
export const getOpenAICompletion = async (userMessageContent: string): Promise<ChatCompletion> => {
  return openAI.chat.completions.create({
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
        content: userMessageContent,
      },
    ],
  });
};

/**
 * Check if the OpenAI response is valid.
 * @param {any} completion - The completion result from OpenAI.
 * @throws Will throw an error if the response is invalid.
 */
export const validateOpenAIResponse = (completion: ChatCompletion): void => {
  if (!completion || !completion.choices || !completion.choices[0] || !completion.choices[0].message) {
    throw new ResponseError("Something went wrong, please try again later.", 500);
  }
};