import Hero from "./Hero";
import Features from "./Features";
import Contact from "./Contact";
import PublicLayout from "../../components/layout/PublicLayout";
import Subscribe from "./Subscribe";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Features />
      <Contact />
      <Subscribe/>
    </PublicLayout>
  );
}
