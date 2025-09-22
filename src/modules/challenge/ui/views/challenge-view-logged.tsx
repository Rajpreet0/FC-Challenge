import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CirclePlay, Funnel, ImagePlay } from "lucide-react"



const ChallengeViewLogged = () => {
  return (
    <div>
        <form className="grid w-full mt-12 items-center gap-6 md:w-md ">
            <Label htmlFor="reps">Wert einfügen</Label>
            <Input type="text" id="reps" />


            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" />

            <div className="p-2 border-2 border-gold rounded-md border-dashed h-[20vh] cursor-pointer">
                <div className="flex flex-col w-full h-full items-center justify-center text-gold">
                    <p className="text-md">Video/Foto einfügen</p>
                    <ImagePlay className="mt-5 w-[40px]  h-[40px]"/>
                </div>
            </div>

            <Button variant="login_home" className="text-md font-normal mt-8 px-20 hover:scale-105">Save</Button>
        </form>


        <div className="w-full flex items-center justify-between mt-[10vh]">
            <h1 className="font-bold text-blue text-2xl">Leaderboard</h1>
            <Funnel className="text-blue"/>
        </div>

        <Table className="mt-[50px]">
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Namen</TableHead>
                    <TableHead>Reps</TableHead>
                    <TableHead>Summe Anzahl</TableHead>
                    <TableHead>Media</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">1</TableCell>
                    <TableCell>Alex</TableCell>
                    <TableCell>33</TableCell>
                    <TableCell>99</TableCell>
                    <TableCell><CirclePlay/></TableCell>
                </TableRow>
            </TableBody>
        </Table>

    </div>
  )
}

export default ChallengeViewLogged


