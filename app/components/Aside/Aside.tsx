"use client";
import { useMapStore } from "@/app/store/map/map";
import styles from "./aside.module.css";

export const Aside = () => {
  const { setDrawingMode, drawingMode } = useMapStore();
  const handleClick = () => {
    setDrawingMode("polygon");
  };

  return (
    <aside className={styles.aside}>
      <h2>Asside</h2>
      <p>This is the aside</p>
      <section></section>
      <button className="rounded flex justify-center items-center" onClick={handleClick}>✏️ Dessiner un polygone</button>
    </aside>
  );
};
