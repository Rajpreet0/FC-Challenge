import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const NewChallengeView = () => {
  return (
    <div className="p-2">
        <h1 className="text-center text-3xl mt-6 font-bold text-blue md:text-4xl md:mt-0">Challenge erstellen</h1>
        <form className="flex flex-col items-center justify-center  min-h-[70vh]  mt-2">
            <div className="grid w-full  items-center gap-6 md:w-lg ">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" />

                <div className="flex w-full gap-4 justify-between">
                    <div className="w-full">
                        <Label htmlFor="startAt">Start at</Label>
                        <Input type="date" id="startAt" className="mt-4 "/>
                    </div>

                    <div className="w-full">
                        <Label htmlFor="numOD">Number of Days</Label>
                        <Input type="number" id="numOD" className="mt-4"/>
                    </div>

                </div>

                <Label htmlFor="description">Description <span className="text-xs">(optional)</span></Label>
                <Textarea id="description"></Textarea>

                <Label htmlFor="make-public">Make Public</Label>
                <Switch id="make-public"/>
            </div>
            <Button variant="login_home" className="text-lg p-6 font-normal mt-6 px-30 hover:scale-105" type="submit">Create</Button>
        </form>
    </div>
  )
}

export default NewChallengeView