import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useQRCode } from 'next-qrcode';
import Link from "next/link";
import { toast } from "sonner";

interface SuccessProps {
    challengeTitle: string;
    challengeLink: string;
}

const Success: React.FC<SuccessProps> = ({challengeLink, challengeTitle}) => {

    const { Canvas } = useQRCode();

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(challengeLink);
            toast("Link copied to clipboard");
        } catch (e) {
            toast("Copy failed. Please copy manually.")
        }
    }

  return (
    <div className="px-4 py-6 md:p-8">

      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-blue">
        {challengeTitle}
      </h1>

      <div className="mt-6 md:mt-16 min-h-[60vh]">
        <div
          className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 rounded-2xl md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-12"
        >
          {/* Left: info + copy */}
          <div className="order-1 text-blue">
            <h4 className="text-xl sm:text-2xl font-bold">Challenge created</h4>
            <p className="mt-3 mb-5 max-w-lg text-sm sm:text-base">
              Your <span className="font-bold">{challengeTitle}</span> Challenge has been created. Now you can invite your friends to join.
            </p>

            <div className="flex max-w-lg flex-col gap-3 sm:flex-row">
              <Input
                type="text"
                disabled
                value={challengeLink}
                readOnly
                className="w-full"
              />
              <Button
                variant="login_home"
                className="w-full sm:w-auto rounded-lg"
                onClick={copyLink}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </div>

          <div className="order-2 hidden h-[24rem] md:block">
            <hr className="mx-auto h-full w-px border border-gold" />
          </div>

          {/* Right: QR */}
          <div className="order-3 md:ml-16">
            <h3 className="text-blue text-lg font-bold">Scan your challenge</h3>
            <div className="mt-4 inline-flex rounded-xl bg-gold p-3 sm:p-4 ">
              <Canvas
                text={challengeLink}
                options={{
                  type: "image/jpeg",
                  quality: 0.3,
                  margin: 2,
                  scale: 4,
                  width: 160, 
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex w-full justify-center md:mt-24">
          <Button
            variant="login_home"
            className="w-full max-w-xs rounded-lg transition-transform duration-150 md:hover:scale-105"
            asChild
          >
            <Link href={challengeLink} aria-label="Open the challenge page">
              Go to Challenge
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Success