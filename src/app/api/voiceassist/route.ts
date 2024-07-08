import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    const { text, song, artist } = await request.json()

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content":
                    `
                        You will be provided with a sentence and a Spotify song with artist.
                        The sentence is recorded within a vehicle cabin and the song is already determined by a previous OpenAI API call.
                        Imagine, you are the voice assistant in this car. 
                        Your tasks are to:
                        - respond to the driver as a voice assistant
                        - return a german car-voice-assistant-like answer and imply that you will do whatever the driver wants and refer to 
                          the given song that will be played now because the song is suitable. 
                    `
            },
            {
                "role": "user",
                "content": `Text: ${text}\nSong: ${song}\nArtist: ${artist}`
            }
        ],
        temperature: 0.9,
        max_tokens: 256,
        top_p: 1,
    });

    return NextResponse.json({
        text: response.choices[0].message.content
    })
}