"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, PlusIcon } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../../public/fc_logo.png";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Challenge {
  slug: string;
  title: string;
  description?: string;
  startAt?: string | null;
  endAt?: string | null;
}

const HomeView = () => {

    const router = useRouter();
    const [value, setValue] = useState("");
    const [status, setStatus] = useState("");

    const [challenges, setChallenges] = useState<Challenge[]>([]);
 
    useEffect(() => {
      const load = async () => {
        try {
          const res = await fetch("/api/challenges");
          const data = await res.json();
          setChallenges(data.challenges || []);
        } catch (err) {
          console.log(err);
        } 
      }

      load();
    }, []);

    const handleJoin = async () => {
      if (!value.trim()) return;

      setStatus("Wird geprüft...");

      try {
        
        const res = await fetch("/api/challenges/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: value.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus(data.error || "Challenge nicht gefunden");
          return;
        }

        if (data.inviteToken === value.trim()) {
          router.push(`/c/${data.slug}?t=${data.inviteToken}`);
        } else {
           router.push(`/c/${data.slug}`);
        }

      } catch (err) {
        console.log(err);
        setStatus("Serverfehler")
      }
    }

  return (
  <div className="p-2 min-h-screen">
       
        {/* HEADER */}
        <div className="p-2 flex w-full justify-end items-center gap-2">
          {/* HEADER - INPUT */}
           <Input 
            type="text" 
            placeholder="Challenge ID" 
            className="border-2 border-gold bg-white w-fit"
            value={value}
            onChange={(e) => setValue(e.target.value)}/>    

          {/* HEADER - LOGIN BUTTON */}
            <Button variant="login_home" onClick={handleJoin}>
              <LogIn/>
            </Button>
        </div>
         {status && <p className="text-center mt-2">{status}</p>}


        {/* CONTENT - NOT LOGGED IN */}
        <div className="p-2 min-h-[80vh] flex flex-col items-center justify-center w-full gap-8">
            {/* CONTENT - LOGO */}
            <Image
              src={Logo}
              width={200}
              height={200}
              alt="Logo"
            />

            {/* CONTENT - TEXT */}
            <div className="text-center mt-4">
              <h1 className="text-4xl font-bold text-blue">Welcome</h1>
              <p className="text-blue text-xl max-w-md mt-4">Track your progress and compete with your friends in various challenges</p>
            </div>


            {/* CONTENT - BUTTON */}

            <Button variant="login_home" className="text-lg p-6 font-normal mt-12 hover:scale-105" onClick={() => router.push("/new")}>
               <PlusIcon size={80}/>   Start Challenge 
            </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue mb-4">Öffentliche Challenges</h2>
          {challenges.length === 0 && <p>Keine öffentlichen Challenges vorhanden.</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c) => (
              <Link
                key={c.slug}
                href={`/c/${c.slug}`}
                className="block p-6 rounded-2xl border border-gold bg-white shadow-md hover:shadow-lg transition-transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-blue mb-2">{c.title}</h3>
                {c.description && (
                  <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                )}
                {(c.startAt || c.endAt) && (
                  <p className="mt-3 text-xs text-gray-500">
                    {c.startAt &&
                      `Start: ${new Date(c.startAt).toLocaleDateString("de-DE")}`}{" "}
                    {c.endAt &&
                      `– Ende: ${new Date(c.endAt).toLocaleDateString("de-DE")}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>


    </div>
  )
}

export default HomeView