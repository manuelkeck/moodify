import {prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const JSONBody = await req.json()
    const checkData = await prisma.moods.findUnique({
        where: {
            auth0Sub: JSONBody.auth0Sub
        },
    });

    console.log("Auth0 user already exists")

    if (!checkData) {
        const createNewAuth0Entry = await prisma.moods.create({ data: JSONBody })
        return NextResponse.json({message: 'POST request successful: new user entry created'});
    } else {
        console.log("POST request denied: entry already exists");
        return NextResponse.json({message: 'POST request denied: user entry already exists'});
    }
}