import ChallengePageView from '@/modules/challenge/ui/views/challenge-view'
import { notFound } from 'next/navigation';
import React from 'react'

interface Props {
    params: { slug: string};
    searchParams: { t?: string };
}

const ChallengePage = async ({params, searchParams}: Props) => {

    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const url = `${base}/api/challenges/${params.slug}${searchParams.t ? `?t=${searchParams.t}`: ""}`;

    const res = await fetch(url, { cache: "no-store"});

    if (!res.ok) {
        if (res.status === 404) return notFound();
        return <div>❌ Challenge konnte nicht geladen werden.</div>
    }

    const challenge = await res.json();

  return <ChallengePageView challenge={challenge}/>
}

export default ChallengePage