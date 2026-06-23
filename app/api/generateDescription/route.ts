import gemini from "@/app/lib/gemini";
import { requireUser } from "@/app/lib/auth/requireUser";
import { checkRateLimit } from "@/app/lib/redis/rateLimit";
import { handleAPIError } from "@/app/lib/api/handleError";
import { buildGeminiPrompt } from "@/app/api/generateDescription/_utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { firebase } = await requireUser(request);

    if (!(await checkRateLimit(`rate:desc:${firebase.uid}`, 5, 60))) {
      return new Response("Too many requests", { status: 429 });
    }

    const body = await request.json();
    const prompt = buildGeminiPrompt(body);

    const result = await gemini.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
