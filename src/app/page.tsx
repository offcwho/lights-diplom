import { About } from "@/widgets/about";
import { Hero } from "@/widgets/hero";
import { Info } from "@/widgets/info";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <About />
      <Info />
    </div>
  );
}
