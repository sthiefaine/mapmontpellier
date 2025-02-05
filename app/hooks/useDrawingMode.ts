import { useEffect } from "react";
import { useMapStore } from "@/app/store/map/map";

export const useDrawingMode = (
  draw: MapLibreDraw | null,
  map: maplibregl.Map | null
) => {
  const { drawingMode } = useMapStore();

  useEffect(() => {
    if (!draw || !map) return;

    if (drawingMode) {
      draw.changeMode(`draw_${drawingMode}`, {
        initialColor: "#ff0000",
      });
    } else {
      draw.changeMode("simple_select");
    }
  }, [drawingMode, draw, map]);
};
