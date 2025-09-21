import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
    req: Request,
    { params } : { params: { slug: string } }
) {
    const cookieStore = cookies();
    const participantId = (await cookieStore).get(`participant_${params.slug}`)?.value;

    if (!participantId) {
        return NextResponse.json({ participant: null });
    }

    const participant = await prisma.participant.findUnique({
        where: { id: participantId },
    });


    return NextResponse.json({participant});
}