import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const  slug  = params.slug;

    const challenge = await prisma.challenge.findUnique({
        where: { slug },
        include: {
            participants: {
                include: { entries: true }
            }
        }
    });

    if (!challenge) {
        return NextResponse.json({error: "Challenge not found."}, {status: 404});
    }

    const entries = challenge.participants.flatMap((p) => 
        p.entries.map((e) => ({
            id: e.id,
            nickname: p.nickname,
            value: e.value,
            createdAt: e.createdAt,
            proofUrl: e.proofUrl,
        }))
    );
 
    return NextResponse.json({ entries });
}

export async function POST(req: Request, { params }: { params: { slug: string }}) {
    try {
        const { slug } = params;
        const { participantId, value, date, proofUrl } = await req.json();

        if (!value) {
            return NextResponse.json({ error: "Value required" }, { status: 400 })
        }

        const challenge = await prisma.challenge.findUnique({
            where: { slug }
        });

        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        const entry = await prisma.entry.create({
            data: {
                participantId,
                value: Number(value),
                createdAt: date ? new Date(date) : new Date(),
                proofUrl: proofUrl || null,
            },
        });

        return NextResponse.json({ entry });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Could not save entry" }, { status: 500 })
    }
}