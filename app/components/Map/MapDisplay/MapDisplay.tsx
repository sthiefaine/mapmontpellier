"use client";

import styles from "./mapDisplay.module.css";

import maplibregl from "maplibre-gl";
import MapLibreDraw from "@hyvilo/maplibre-gl-draw";
import type { LayerSpecification } from 'maplibre-gl';

import { useEffect, useRef, useState } from "react";

import { MapControls } from "../MapControls";
import { useMapControlsStore } from "@/app/store/map/controls";
import { useShallow } from "zustand/shallow";
import { use3DToggle } from "@/app/hooks/use3DToggle";
import { use3DLayerVisibility } from "@/app/hooks/use3DLayerVisibility";
import { useDrawControl } from "@/app/hooks/useDrawControl";
import { useDrawingMode } from "@/app/hooks/useDrawingMode";
import { useFeatureRendering } from "@/app/hooks/useFeatureRendering";

type MapDisplayProps = {
  style: maplibregl.StyleSpecification;
};

export const MapDisplay = ({ style }: MapDisplayProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);
  const drawRef = useRef<MapLibreDraw>(null);
  const [mounted, setMounted] = useState(false);

  const { zoom, setZoom, setCenter, center } = useMapControlsStore(
    useShallow((state) => ({
      zoom: state.zoom,
      center: state.center,
      setZoom: state.setZoom,
      setCenter: state.setCenter,
    }))
  );

  const currentBat = {
    lng: 3.874074030919587,
    lat: 43.61323200950909,
  };

  // Don't move too far from the City
  const bounds = [
    [3.738, 43.524],
    [4.018, 43.706],
  ];

  // Activation des fonctionnalités
  // Gestion de la 3D
  use3DToggle(mapRef.current, mounted);
  use3DLayerVisibility(mapRef.current, mounted);

  // Gestion des événements de dessin
  useDrawControl(mapRef.current, drawRef);
  useDrawingMode(drawRef.current, mapRef.current);
  useFeatureRendering(mapRef.current);

  // Gestion de la navigation
  useEffect(() => {
    if (mapRef.current?.getZoom() === zoom) return;
    mapRef.current?.flyTo({ zoom: zoom });
  }, [zoom]);

  useEffect(() => {
    if (center[0] === 0 && center[1] === 0) return;
    mapRef.current?.flyTo({ center: [currentBat.lng, currentBat.lat] });
    setCenter([0, 0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, setCenter]);

  // Initialisation de la carte
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

    mapRef.current.on('load', () => {
      setMounted(true);
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.section}>
      <MapControls />
      <div id="map" className={styles.map} ref={mapContainerRef} />
    </section>
  );
};
