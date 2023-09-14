import OpenAI from "openai";

const index = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default index;
