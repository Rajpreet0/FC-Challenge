import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
    req: Request,
    { params } : { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const cookieStore = cookies();
    const participantId = (await cookieStore).get(`participant_${slug}`)?.value;

    if (!participantId) {
        return NextResponse.json({ participant: null });
    }

    const participant = await prisma.participant.findUnique({
        where: { id: participantId },
    });


    return NextResponse.json({participant});
}