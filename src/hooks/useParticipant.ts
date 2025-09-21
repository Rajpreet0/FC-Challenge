"use client";

import { useEffect, useState } from "react";

interface Participant {
    id: string;
    nickname: string;
}

export function useParticipant(slug: string) {
    
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                
                const res = await fetch(`/api/challenges/${slug}/me`, {
                    cache: "no-store",
                });

                const data = await res.json();
                setParticipant(data.participant);

            } catch (err) {
                console.log(err);
                setParticipant(null);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    return { participant, loading, setParticipant };

}