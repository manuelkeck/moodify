import {NextRequest, NextResponse} from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const JSONBody = await req.json()

        const record = await prisma.moods.findUnique({
            where: { auth0Sub: JSONBody.auth0Sub}
        })

        if (!record) {
            // Create new entry if it doesn't exist
            await prisma.moods.create({ data: JSONBody })
        } else {
            // Update values of currentMood and lastUpdate fields
            await prisma.moods.update({
                where: { auth0Sub: JSONBody.auth0Sub },
                data: {
                    currentMood: JSONBody.currentMood,
                    lastUpdate: new Date()
                }
            });
        }

        return new NextResponse(
            JSON.stringify({ error: `Stored successfully.` }),
            { status: 200 }
        );
    } catch (e) {
        return new NextResponse(
            JSON.stringify({ error: e }),
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    let id = req.headers.get('X-Auth0-Sub') as string;

    try {
        const record = await prisma.moods.findUnique({
            where: { auth0Sub: id }
        });

        if (!record) {
            return NextResponse.json(
                JSON.stringify({ message: `Mood entry not found for given ID.` }),
                { status: 404 }
            );
        }
        return new NextResponse(
            JSON.stringify({ record }),
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json(
            JSON.stringify({ error: e }),
            { status: 500 }
        );
    }
}