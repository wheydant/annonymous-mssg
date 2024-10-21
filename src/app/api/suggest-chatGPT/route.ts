import OpenAI from "openai";
import { NextResponse } from "next/server";

// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for ranking on openrouter.ai.
//     "X-Title": process.env.YOUR_SITE_NAME, // Optional, for ranking on openrouter.ai.
//   },
// });

// Set the runtime to edge
export const runtime = "edge";

// Helper function to convert the response to streaming
async function streamOpenAIResponse(response: Response): Promise<ReadableStream> {
  const reader = response.body?.getReader();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      while (reader) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }
        // Process and stream the response chunks
        const text = new TextDecoder().decode(value);
        controller.enqueue(encoder.encode(text));
      }
    }
  });
}

export async function POST(): Promise<Response> {
  const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous feedback platform, like Qooh.me, and should be suitable for a diverse audience.";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        n: 1,
        stream: true,  // Enable streaming in the API call
      }),
    });

    // Stream the response
    const stream = await streamOpenAIResponse(response);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, message } = error;
      return NextResponse.json({ name, message }, { status });
    } else {
      console.error("Unexpected error: ", error);
      throw error;
    }
  }
}
