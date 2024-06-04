import { HfInference } from '@huggingface/inference';
import {HuggingFaceStream, StreamingTextResponse, streamText} from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
import { openai } from '@ai-sdk/openai'


// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// export const runtime = 'edge';

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    console.log("message:", messages.content)

    const response = await streamText({
        model: openai('gpt-3.5-turbo'),
        messages
        /*parameters: {
            max_new_tokens: 500,
            // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false,
        },*/
    });

    console.log("response:", response)

    return response.toAIStreamResponse()

    // Convert the response into a friendly text-stream
    //const stream = HuggingFaceStream(response);

    // Respond with the stream
    //return new StreamingTextResponse(stream);
}