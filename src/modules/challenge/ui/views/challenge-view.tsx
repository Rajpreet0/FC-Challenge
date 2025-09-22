"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParticipant } from "@/hooks/useParticipant";
import { useState } from "react";
import ChallengeViewLogged from "./challenge-view-logged";

interface Challenge {
    slug: string;
    title: string;
    description?: string;
    startAt?: string | null;
    endAt?: string | null;
    isPublic: boolean;
}

const ChallengePageView = ({challenge} : {challenge: Challenge}) => {

  const { participant, loading, setParticipant } = useParticipant(challenge.slug);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("");

  const handleJoin = async () => {
    setStatus("⏳ Wird gesendet...");
    try {
      const res = await fetch(`/api/challenges/${challenge.slug}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      if (!res.ok) {
        const error = await res.json();
        setStatus("Error: " + error.error);
        return;
      }

      const data = await res.json();
      setParticipant(data.participant);
      setStatus(`Logged In as: ${data.participant.nickname}`);
    } catch (err) {
      setStatus("❌ Unexpected Error");
    }
  };


  return (
    <div className="p-2">
        <h1 className="text-center text-3xl mt-6 font-bold text-blue md:text-4xl md:mt-0">{challenge.title}</h1>
        {challenge.startAt && challenge.endAt && (
            <p className="text-center text-lg mt-4  text-blue md:mt-2">Zeitraum: {new Date(challenge.startAt).toLocaleDateString("de-DE")} - {new Date(challenge.endAt).toLocaleDateString("de-DE")}</p>
        )}

        {!participant ? (
          <div className="flex flex-col items-center justify-center  min-h-[70vh]  mt-2" >
              <div className="grid w-full  items-center gap-6 md:w-md ">
                  <Label htmlFor="nickname">Nicknamen eingeben</Label>
                  <Input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
              </div>
              <Button variant="login_home" className="text-md font-normal mt-8 px-20 hover:scale-105" onClick={handleJoin}>Join</Button>
              {status && <p className="mt-4">{status}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70vh] mt-2">
            <ChallengeViewLogged/>
          </div>
        )}
    </div>
  )
}

export default ChallengePageView

