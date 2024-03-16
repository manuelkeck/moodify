import { prisma } from "../../../../lib/prisma"
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const JSONBody = await req.json()
    const existingEntry = await prisma.evaluation.findFirst({
        where: {
            currentMood: JSONBody.currentMood,
            targetMood: JSONBody.targetMood,
            recURL: JSONBody.recURL
        },
    });
    if (!existingEntry) {
        const createNewEvaluationEntry = await prisma.evaluation.create({ data: JSONBody })
        console.log("POST request successful: entry created");
        return NextResponse.json({message: 'POST request successful: entry created'});
    } else {
        console.log("POST request denied: entry already exists");
        return NextResponse.json({message: 'POST request denied: entry already exists'});
    }
}

export async function GET() {
    return NextResponse.json({message: 'GET request'});
}