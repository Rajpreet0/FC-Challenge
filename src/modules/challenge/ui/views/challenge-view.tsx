import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Challenge {
    slug: string;
    title: string;
    description?: string;
    startAt?: string | null;
    endAt?: string | null;
    isPublic: boolean;
}

const ChallengePageView = ({challenge} : {challenge: Challenge}) => {
  return (
    <div className="p-2">
        <h1 className="text-center text-3xl mt-6 font-bold text-blue md:text-4xl md:mt-0">{challenge.title}</h1>
        {challenge.startAt && challenge.endAt && (
            <p className="text-center text-lg mt-4  text-blue md:mt-2">Zeitraum: {new Date(challenge.startAt).toLocaleDateString("de-DE")} - {new Date(challenge.endAt).toLocaleDateString("de-DE")}</p>
        )}
        <div className="flex flex-col items-center justify-center  min-h-[70vh]  mt-2" >
            <div className="grid w-full  items-center gap-6 md:w-md ">
                <Label htmlFor="nickname">Nicknamen eingeben</Label>
                <Input type="text" id="nickname"/>
            </div>
            <Button variant="login_home" className="text-md font-normal mt-8 px-20 hover:scale-105" >Join</Button>
        </div>
    </div>
  )
}

export default ChallengePageView

