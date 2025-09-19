"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, PlusIcon } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../../public/fc_logo.png";
import { useRouter } from "next/navigation";

const HomeView = () => {

    const router = useRouter();

  return (
  <div className="p-2 min-h-screen">
       
        {/* HEADER */}
        <div className="p-2 flex w-full justify-end items-center gap-2">
          {/* HEADER - INPUT */}
           <Input type="text" placeholder="Nickname" className="border-2 border-gold bg-white w-fit"/>    

          {/* HEADER - LOGIN BUTTON */}
            <Button variant="login_home">
              <LogIn/>
            </Button>
        </div>


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
    </div>
  )
}

export default HomeView