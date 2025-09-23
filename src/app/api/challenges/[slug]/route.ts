import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: Promise<{slug: string}>}) {
    const { slug } = await params;

    try {
        const challenge = await prisma.challenge.findUnique({
            where: {slug},
        });

        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found"}, { status: 404});
        }

        return NextResponse.json(challenge);
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err ?? "Server error"},
            { status: 500 }
        )
    }
}