import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface Params {
    params: { slug: string }
}


export async function GET(req: Request, { params }: Params) {
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
        }))
    );
 
    return NextResponse.json({ entries });
}

export async function POST(req: Request, { params }: Params) {
    try {
        const { slug } = params;
        const { participantId, value, date } = await req.json();

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
            },
        });

        return NextResponse.json({ entry });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Could not save entry" }, { status: 500 })
    }
}