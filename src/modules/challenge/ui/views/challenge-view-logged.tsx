import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CirclePlay, Funnel, ImagePlay } from "lucide-react"
import { useDropzone } from "react-dropzone";
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Entry {
    id: string;
    nickname: string;
    value: number;
    createdAt: string;
    proofUrl?: string;
}

const ChallengeViewLogged = ({ participantId }: { participantId: string }) => {

    const { slug } = useParams<{ slug: string }>();

    const [value, setValue] = useState("");
    const [date, setDate] = useState("");
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState("");

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


    const onDrop = useCallback(async(acceptFiles: File[]) => {
        const file = acceptFiles[0];
        if (!file) return;

        setUploading(true);
        setFileUrl(null);

        try {
            
            const fileExt = file.name.split(".").pop();
            const fileName = `${participantId}_${Date.now()}.${fileExt}`;
            const filePath = `${slug}/${fileName}`;

            const { error } = await supabase.storage
                .from("challenge-media") // Bucket Name
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from("challenge-media")
                .getPublicUrl(filePath);

            setFileUrl(publicUrlData.publicUrl);
            toast("✅ Datei hochgeladen");
        } catch (err: unknown) {
            console.error(err);
            toast("❌ Upload fehlgeschlagen");
        } finally {
            setUploading(false);
        }
    }, [participantId, slug]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {"image/*": [], "video/*": []},
        multiple: false,
        onDrop,
    });

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
                    proofUrl: fileUrl || undefined,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Speichern fehlgeschlagen")
            }

            toast("Entry gespeichert");
            setValue("");
            setDate("");
            setFileUrl(null);
            await loadEntries();
        } catch (err) {
            console.log(err);
            toast("Error when saving to Entry");
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

            {/* Drap & Drop Zone */}
            <div {...getRootProps()} 
                className={`p-2 border-2 border-dashed rounded-md h-[20vh] cursor-pointer flex items-center justify-center ${isDragActive ? "border-blue bg-blue-50" : "border-gold"}`}>
                    <input {...getInputProps()} />
                    {uploading && (
                        <p className="text-gold">⏳ Uploading...</p>
                    )} 
                    {!uploading && fileUrl && (
                        <p className="text-green-600">✅ Datei hochgeladen</p>
                    )}
                    {!uploading && !fileUrl && (
                        <div className="flex flex-col items-center text-gold">
                            <p className="text-md">Video/Foto einfügen</p>
                            <ImagePlay className="mt-5 w-[40px] h-[40px]" />
                        </div>
                    )}
            </div>

            <Button variant="login_home" className="text-md font-normal mt-8 px-20 hover:scale-105" type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </form>


        <div className="w-full flex items-center justify-between mt-[10vh]">
            <h1 className="font-bold text-blue text-2xl">Leaderboard</h1>
            <Popover>
                <PopoverTrigger asChild><Funnel className="text-blue cursor-pointer"/></PopoverTrigger>
                <PopoverContent className="w-56">
                   <div className="flex flex-col space-y-2 p-4">
                        <Label className="text-sm text-blue" htmlFor="filterDate">
                            Filter by Date
                        </Label>
                        <Input
                            id="filterDate"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                   </div>
                </PopoverContent>
            </Popover>
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
                {entries.filter((entry) => {
                    if (!filterDate) return true;
                    const entryDate = new Date(entry.createdAt).toISOString().split("T")[0];
                    return entryDate === filterDate;
                }).map((entry, i) => (
                    <TableRow key={entry.id}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>{entry.nickname}</TableCell>
                        <TableCell>{entry.value}</TableCell>
                        <TableCell>
                            {new Date(entry.createdAt).toLocaleDateString("de-DE")}
                        </TableCell>
                        <TableCell>
                            {entry.proofUrl ? (
                                <a
                                    href={entry.proofUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold underline">
                                    <CirclePlay/>
                                </a>
                            ) : (
                                "-"
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    </div>
  )
}

export default ChallengeViewLogged


