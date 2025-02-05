import { RefObject, useEffect } from "react";
import maplibregl from "maplibre-gl";
import MapLibreDraw from "@hyvilo/maplibre-gl-draw";
import { useMapStore } from "@/app/store/map/map";
import { useShallow } from "zustand/shallow";

export const useDrawControl = (
  map: maplibregl.Map | null,
  drawRef: RefObject<MapLibreDraw | null>
) => {
  const { addFeature, setDrawingMode } = useMapStore(
    useShallow((state) => ({
      addFeature: state.addFeature,
      setDrawingMode: state.setDrawingMode,
    }))
  );

  useEffect(() => {
    if (!map) return;

    const draw = new MapLibreDraw({
      displayControlsDefault: false,
      modes: {
        ...MapLibreDraw.modes,
        draw_polygon: {
          ...MapLibreDraw.modes.draw_polygon,
          onStop: (state) => {
            if (state?.feature?.geometry?.coordinates) {
              const coords = state.feature.geometry.coordinates[0];
              if (coords.length >= 3) {
                addFeature({
                  type: "polygon",
                  geojson: state.feature,
                  color: "#ff0000",
                });
                setDrawingMode(null);
              }
            } else {
              setDrawingMode(null);
            }
          },
        },
      },
    });

    map.addControl(draw);
    drawRef.current = draw;

    // Gestion de la création de features
    const handleDrawCreate = (e: MapLibreDraw.DrawCreateEvent) => {
      const feature = e.features[0];
      addFeature({
        type: feature.geometry.type as "polygon" | "point",
        geojson: feature,
        color: feature?.properties?.color || "#ff0000",
      });
    };

    map.on("draw.create", handleDrawCreate);

    // Nettoyage
    return () => {
      map.off("draw.create", handleDrawCreate);
      if (drawRef.current) {
        map.removeControl(drawRef.current);
      }
    };
  }, [map, addFeature, drawRef, setDrawingMode]);
};
