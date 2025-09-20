"use client";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import Success from "../components/success";
import { toast } from "sonner";

type CreateResponse = {
    inviteUrl: string;
    challenge: {slug: string, title: string};
}

const NewChallengeView = () => {

    const [title, setTitle] = useState("");
    const [startAt, setStartAt] = useState<string>("");
    const [numberOfDays, setNumberOfDays] = useState<string>("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inviteUrl, setInviteUrl] = useState<string | null>(null);

    // Send API Call
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/challenges", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title,
                    description: description || undefined,
                    startAt: startAt ? new Date(startAt).toISOString() : undefined,
                    numberOfDays: numberOfDays ? Number(numberOfDays) : undefined,
                    isPublic
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Create failed");
            }

            const data: CreateResponse = await res.json();
            setInviteUrl(data.inviteUrl);
            toast("Challenge created.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


 if (inviteUrl) {
    return <Success
        challengeTitle={title}
        challengeLink={inviteUrl}/>
 }

  return (
    <div className="p-2">
        <h1 className="text-center text-3xl mt-6 font-bold text-blue md:text-4xl md:mt-0">Challenge erstellen</h1>
        <form className="flex flex-col items-center justify-center  min-h-[70vh]  mt-2" onSubmit={onSubmit}>
            <div className="grid w-full  items-center gap-6 md:w-lg ">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>

                <div className="flex w-full gap-4 justify-between">
                    <div className="w-full">
                        <Label htmlFor="startAt">Start at</Label>
                        <Input type="date" id="startAt" className="mt-4 " value={startAt}  onChange={(e) => setStartAt(e.target.value)}/>
                    </div>

                    <div className="w-full">
                        <Label htmlFor="numOD">Number of Days</Label>
                        <Input type="number" id="numOD" className="mt-4" value={numberOfDays}  onChange={(e) => setNumberOfDays(e.target.value)}/>
                    </div>

                </div>

                <Label htmlFor="description">Description <span className="text-xs">(optional)</span></Label>
                <Textarea id="description" value={description}  onChange={(e) => setDescription(e.target.value)}></Textarea>

                <Label htmlFor="make-public">Make Public</Label>
                <Switch id="make-public" checked={isPublic} onCheckedChange={setIsPublic}/>
            </div>

            {error && (
                <p className="text-red-600 mt-4 text-sm">{error}</p>
            )}

            <Button variant="login_home" className="text-lg p-6 font-normal mt-6 px-30 hover:scale-105" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </form>
    </div>
  )
}

export default NewChallengeView