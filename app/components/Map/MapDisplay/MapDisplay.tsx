"use client";

import styles from "./mapDisplay.module.css";

import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { MapControls } from "../MapControls";
import { useMapControlsStore } from "@/app/store/map/controls";
import { useShallow } from "zustand/shallow";
import { useMapStore } from "@/app/store/map/map";

type MapDisplayProps = {
  style: maplibregl.StyleSpecification;
};

export const MapDisplay = ({ style }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);

  const { zoom, setZoom, setCenter, center } = useMapControlsStore(
    useShallow((state) => ({
      zoom: state.zoom,
      center: state.center,
      setZoom: state.setZoom,
      setCenter: state.setCenter,
    }))
  );

  const { polygons } = useMapStore(
    useShallow((state) => ({
      polygons: state.polygons,
    }))
  );

  const currentBat = {
    lng: 3.874074030919587,
    lat: 43.61323200950909,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const MONTPELLIER_COORDINATES = {
    lat: 43.606066,
    lng: 3.878014,
  };

  // Don't move too far from the City
  const bounds = [
    [3.738, 43.524],
    [4.018, 43.706],
  ];

  useEffect(() => {
    if (mapRef.current?.getZoom() === zoom) return;
    mapRef.current?.flyTo({ zoom: zoom });
  }, [zoom]);

  useEffect(() => {
    if (center[0] === 0 && center[1] === 0) return;
    mapRef.current?.flyTo({ center: [currentBat.lng, currentBat.lat] });
    setCenter([0, 0]);
  }, [center]);

  useEffect(() => {
    if (!mapContainerRef?.current) return;

    // Initialisation de la carte
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: style,
      center: [currentBat.lng, currentBat.lat], // position de départ [lng, lat]
      zoom: zoom,
      maxBounds: [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
    });

    mapRef.current.on("click", (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const coordinates = [e.lngLat.lng, e.lngLat.lat];

      const features = mapRef?.current?.queryRenderedFeatures(e.point);
      console.log("Clicked features:", features);
      console.log("click", e);
    });

    mapRef.current.on("zoom", () => {
      if (!mapRef.current) return;
      setZoom(mapRef?.current?.getZoom());
    });

    mapRef.current.resize();

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    polygons.forEach((polygon) => {
      const sourceId = `polygon-${polygon.id}`;
      const layerId = `polygon-layer-${polygon.id}`;

      if (!mapRef.current?.getSource(sourceId)) {
        mapRef.current?.addSource(sourceId, {
          type: "geojson",
          data: polygon.geojson,
        });
      }

      if (!mapRef.current?.getLayer(layerId)) {
        mapRef.current?.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": polygon.color,
            "fill-opacity": 0.5,
          },
        });
      }
    });
  }, [polygons]);

  return (
    <section className={styles.section}>
      <MapControls />
      <div id="map" className={styles.map} ref={mapContainerRef} />
    </section>
  );
};
