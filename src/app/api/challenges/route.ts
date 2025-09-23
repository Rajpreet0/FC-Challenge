import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { customAlphabet } from "nanoid";
import { z } from "zod"

// Seed for Generations
const slugId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);
const tokenId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 32);

// Input Validations using Zod
const BodySchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    startAt: z.string().datetime().optional(),
    numberOfDays: z.coerce.number().int().positive().optional(),
    isPublic: z.boolean().default(false),
});

// HTTP Call for creating a new challenge
export async function POST(req: Request) {
    try {
        const json = await req.json();
        const body = BodySchema.parse(json);

        const slug = slugId();
        const inviteToken = tokenId();

        
        const startAt = body.startAt ? new Date(body.startAt) : null;
        
        // Take startAt Date plus the number of Days, which equals to the endDate
        const endAt = startAt && body.numberOfDays ? new Date(startAt.getTime() + body.numberOfDays * 24 * 60 * 60 * 1000) : null;

        // Create a new challenge
        const challenge = await prisma.challenge.create({
            data: {
                slug,
                title: body.title,
                description: body.description ?? null,
                startAt,
                endAt,
                isPublic: body.isPublic,
                inviteToken,    
            }
        });

        const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

        // Build the InviteURL depending on rather it is Public or not
        const inviteUrl = body.isPublic ? `${base}/c/${slug}` : `${base}/c/${slug}?t=${inviteToken}`;

        return NextResponse.json({ challenge, inviteUrl});
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err?.message ?? "Invalid payload" },
            { status: 400 }
        )
    }
}


// Get All Challenges
export async function GET(){
    try {
        const challenges = await prisma.challenge.findMany({
            where: {
                isPublic: true,
            },
            select: {
                slug: true,
                title: true,
                description: true,
                startAt: true,
                endAt: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        return NextResponse.json({ challenges });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Invalid payload" },
            { status: 500 }
        )
    }
}