import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{ slug: string }>;
}

export async function GET(req: Request, { params }: Params) {
    const { slug } = await params;

    try {
        const challenge = await prisma.challenge.findUnique({
            where: {slug},
        });

        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found"}, { status: 404});
        }

        return NextResponse.json(challenge);
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message ?? "Server error"},
            { status: 500 }
        )
    }
}