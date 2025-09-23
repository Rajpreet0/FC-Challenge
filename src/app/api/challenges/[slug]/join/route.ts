import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

   const { slug } = await params;

  try {
    const { nickname } = await req.json();

    if (!nickname || nickname.length < 2) {
      return NextResponse.json(
        { error: "Nickname ungültig" },
        { status: 400 }
      );
    }

    // Challenge finden
    const challenge = await prisma.challenge.findUnique({
      where: { slug: slug },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge nicht gefunden" }, { status: 404 });
    }

    // Prüfen ob Participant schon existiert
    let participant = await prisma.participant.findFirst({
      where: {
        challengeId: challenge.id,
        nickname,
      },
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          nickname,
          challengeId: challenge.id,
        },
      });
    }

    // Cookie setzen (damit User "eingeloggt" bleibt in dieser Challenge)
    (await cookies()).set({
      name: `participant_${challenge.slug}`,
      value: participant.id,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
    });

    return NextResponse.json({ participant });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Fehler beim Joinen" }, { status: 500 });
  }
}
