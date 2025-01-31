import { Aside } from "./components/Aside/Aside";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { MapDisplay } from "./components/MapDisplay/MapDisplay";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <MapDisplay />
        <Aside />
      </main>
      <Footer />
    </>
  );
}
