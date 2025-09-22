import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CirclePlay, Funnel, ImagePlay } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Entry {
    id: string;
    nickname: string;
    value: number;
    createdAt: string;
}

const ChallengeViewLogged = ({ participantId }: { participantId: string }) => {

    const { slug } = useParams<{ slug: string }>();

    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);

    // Laden aller Entries
    const loadEntries = async () => {
        try {
            const res = await fetch(`/api/challenges/${slug}/entries`, {
                cache: "no-store",
            });

            const data = await res.json();
            setEntries(data.entries || []);
        } catch (err) {
            console.error(err);
            toast("Fehler beim Laden der Einträge")
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/challenges/${slug}/entries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    participantId,
                    value,
                    date: date || undefined,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Speichern fehlgeschlagen")
            }

            toast("Entry gespeichert");
            setValue("");
            setDate("");
            await loadEntries();
        } catch (err: any) {
            toast(err.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>
        <form className="grid w-full mt-12 items-center gap-6 md:w-md " onSubmit={handleSave}>
            <Label htmlFor="reps">Wert einfügen</Label>
            <Input type="text" id="reps" value={value} onChange={(e) => setValue(e.target.value)}/>


            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>

            <div className="p-2 border-2 border-gold rounded-md border-dashed h-[20vh] cursor-pointer">
                <div className="flex flex-col w-full h-full items-center justify-center text-gold">
                    <p className="text-md">Video/Foto einfügen</p>
                    <ImagePlay className="mt-5 w-[40px]  h-[40px]"/>
                </div>
            </div>

            <Button variant="login_home" className="text-md font-normal mt-8 px-20 hover:scale-105" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>


        <div className="w-full flex items-center justify-between mt-[10vh]">
            <h1 className="font-bold text-blue text-2xl">Leaderboard</h1>
            <Funnel className="text-blue"/>
        </div>

        <Table className="mt-[50px]">
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Namen</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Media</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {entries.map((entry, i) => (
                    <TableRow key={entry.id}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>{entry.nickname}</TableCell>
                        <TableCell>{entry.value}</TableCell>
                        <TableCell>
                            {new Date(entry.createdAt).toLocaleDateString("de-DE")}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    </div>
  )
}

export default ChallengeViewLogged


