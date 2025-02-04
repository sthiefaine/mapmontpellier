"use client";
import { useMapStore } from "@/app/store/map/map";
import styles from "./aside.module.css";

export const Aside = () => {
  const addPolygon = useMapStore((state) => state.addPolygon);

  const handleClick = () => {
    const newPolygon = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [3.8741489426789144, 43.61282847126523],
                [3.8740996828948084, 43.61292794075143],
                [3.8740012996629787, 43.61290681289583],
                [3.8737439455316007, 43.61368578967745],
                [3.8741195405522433, 43.613756930276196],
                [3.8744185900403636, 43.61300338007399],
                [3.874331902224583, 43.612856686351904],
              ],
            ],
          },
        },
      ],
    };

    addPolygon(newPolygon);
  };

  return (
    <aside className={styles.aside}>
      <h2>Asside</h2>
      <p>This is the aside</p>
      <section></section>
      <button className="rounded flex justify-center items-center" onClick={handleClick}>Ajouter un polygone</button>
    </aside>
  );
};
