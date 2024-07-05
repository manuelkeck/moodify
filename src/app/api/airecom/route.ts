import { NextResponse } from "next/server";
import OpenAI from "openai";
require('dotenv').config();

export async function POST(request: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    interface ChatContent {
        song: string;
        artist: string;
    }

    try {
        const { text } = await request.json();

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `
                    You will be provided with a sentence. 
                    The sentence is recorded within a vehicle cabin.
                    The primary statement of the sentence is related to car features like climate control, entertainment control, or route guidance.
                    The driver could say anything to the car.
                    Imagine, you are the voice assistant of this car. 
                    Your tasks are to:
                    - detect the request of the driver
                    - search for one random, suitable, situation-based music recommendation, based on the provided sentence
                    - provide a song in any case
                    Return a song title with the artist in the following JSON syntax:
                    {
                        "song": "<song title>",
                        "artist": "<artist>"
                    }
                    `
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature: 0.7,
            max_tokens: 32,
            top_p: 1,
        });

        if (!response.choices || response.choices.length === 0) {
            throw new Error("Unexpected response structure from OpenAI")
        }

        const completion = response?.choices?.[0]?.message?.content?.trim() ?? '';
        const { song, artist } = JSON.parse(completion)

        const songRecommendation: ChatContent = {
            song: song,
            artist: artist
        };

        return NextResponse.json(songRecommendation);

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Error processing request" }, { status: 500 })
    }
}
