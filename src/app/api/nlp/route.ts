import fs from "fs";
import { NextResponse } from 'next/server';
import path from "path";
import OpenAI from "openai";
import {response} from "express";

const openai = new OpenAI();

const speechFile = path.resolve("./speech.mp3");

export async function POST(request: Request) {
    const { text } = await request.json()

    try {
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: `${text}`,
        });

        // Convert the MP3 data to a Buffer
        const buffer = Buffer.from(await mp3.arrayBuffer());

        // Return the MP3 file as a response
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="speech.mp3"',
            },
        });
    } catch (error) {
        console.error('Error generating MP3:', error);
        return new NextResponse('Error generating MP3', { status: 500 });
    }
}