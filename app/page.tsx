"use server"

import { Aside } from "./components/Aside/Aside";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { MapDisplay } from "./components/MapDisplay/MapDisplay";

const getData = async () => {
  const res = await fetch("https://tiles.openfreemap.org/styles/liberty");
  const data = await res.json();
  return data as maplibregl.StyleSpecification;
};

export default async function Home() {

  const data = await getData();

  return (
    <>
      <Header />
      <main>
        <MapDisplay style={data} />
        <Aside />
      </main>
      <Footer />
    </>
  );
}
