import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { div } from "motion/react-client";
import { Docks } from "./docks";

export default function Herosection() {
  return (
    <div className="container mx-auto   lg:max-h-[800px] lg:h-screen  flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-8 lg:px-12 py-12 gap-10 lg:gap-16 text-white">
      <div className="max-w-xl space-y-6 text-center lg:text-left">
        <div className="flex ">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight font-heading">
            The Ultimate Esports{" "}
            <span className="bg-red-gradient text-transparent bg-clip-text">
              Experience Awaits
            </span>
          </h1>
        </div>
        <p className="text-base sm:text-lg text-metal">
          Create squads, join tournaments, challenge towers, and dominate the
          battlegrounds. Your Esports journey begins here!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center lg:justify-start">
          <button className="btn-primary neon-red rounded-xl font-semibold shadow-lg w-full sm:w-auto">
            Join Now
          </button>
          <button className="rounded-xl font-semibold border-neon-red px-6 py-3 hover:bg-[#1a1a1a]/60 w-full sm:w-auto">
            Learn More
          </button>
        </div>
      </div>
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Dominate the Esports Arena
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Join squads, conquer towers, and climb the leaderboards in epic
            Esports tournaments!
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <video
              src="/video1.mp4"
              className="h-96  object-cover rounded-xl group-hover/card:shadow-xl mt-4"
              autoPlay
              loop
              muted
              playsInline
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              as="button"
             
            >
           <Docks/>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}
