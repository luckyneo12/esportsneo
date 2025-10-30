
import { Features_Section } from "@/components/main_components/Features_Section";
import Herosection from "@/components/main_components/Herosection";


export default function LandingPage() {
  return (
  <div className="container mx-auto">
     <Herosection/>
     {/* <ScrollBasedVelocityImages/> */}
     <Features_Section/>
  </div>
  );
}
