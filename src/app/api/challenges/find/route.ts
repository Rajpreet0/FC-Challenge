import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    try {

        const { input } = await req.json();

        if (!input) {
            return NextResponse.json({ error: "Kein Input angegeben" }, { status: 400 })
        }

        const challenge = await prisma.challenge.findFirst({
            where: {
                OR: [
                    { slug: input },
                    { inviteToken: input }
                ]
            }
        });

        if (!challenge) {
            return NextResponse.json({ error: "Challenge nicht gefunden" }, { status: 404 });
        }

        return NextResponse.json({
            slug: challenge.slug,
            inviteToken: challenge.inviteToken
        })

    } catch (err) {
        console.error("find challenge error", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 })
    }
}