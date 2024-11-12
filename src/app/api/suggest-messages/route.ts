import OpenAI from "openai"
// import { openai } from '@ai-sdk/openai';
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { streamText, convertToCoreMessages} from 'ai';
import { NextResponse } from "next/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  }
})

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(): Promise<Response> {
//   const { prompt } = await req.json();

    const prompt = "Create a list of three positive, engaging feedbacks formatted as a single string. Each feedback should be separated by '||'. These comments are for an anonymous feedback platform like Qooh.me, intended for a diverse audience. Ensure the feedbacks are kind, uplifting, and relevant for creators or users in general, avoiding personal or sensitive topics. Example output: 'Your recent posts are always so thought-provoking! || I really enjoy the way you explain complex ideas in your videos. || Your content has inspired me to try out new hobbies, thank you for sharing!'"
    try {
        const response = await openai.chat.completions.create({
        model: "openai/gpt-3.5-turbo",
        messages: [
        //   {
        //     role: "system",
        //     content: "You are an AI writing assistant that generates a script based on the provided prompt.",
        //   },
            {
            role: "user",
            content: prompt,
            },
        ],
        // stream:true

        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
        });

        // const stream = OpenAIStream(response);
        // return new StreamingTextResponse(stream);
    
        const script = response.choices[0]?.message?.content!.trim() || 'No script generated';
    
        return new Response(JSON.stringify({ script }), {
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name, status, message} = error

            return NextResponse.json({
                name, message
            }, {status})
        }else {
            console.error("Unexpected error ",error)
            throw error;
        }
    }
}

//Vercel Documentation

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = await streamText({
//     model: openai('gpt-4-turbo'),
//     messages: convertToCoreMessages(messages),
//   });

//   return result.toDataStreamResponse();
// }

// import { useState } from 'react';

// export default function Home() {
//   const [prompt, setPrompt] = useState('');
//   const [script, setScript] = useState('');

//   const generateScript = async () => {
//     const response = await fetch('/api/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ prompt }),
//     });

//     const data = await response.json();
//     setScript(data.script);
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>LLM AI Script Generator</h1>
//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt here..."
//         rows={5}
//         style={{ width: '100%', marginBottom: '1rem' }}
//       />
//       <button onClick={generateScript} style={{ padding: '0.5rem 1rem' }}>
//         Generate Script
//       </button>
//       {script && (
//         <div style={{ marginTop: '2rem' }}>
//           <h2>Generated Script:</h2>
//           <p>{script}</p>
//         </div>
//       )}
//     </div>
//   );
// }