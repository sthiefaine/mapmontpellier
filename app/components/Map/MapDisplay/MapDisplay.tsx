"use client";

import styles from "./mapDisplay.module.css";

import maplibregl from "maplibre-gl";
import MapLibreDraw from "@hyvilo/maplibre-gl-draw";

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

  const { zoom, setZoom, setCenter, center, pitch, setPitch } =
    useMapControlsStore(
      useShallow((state) => ({
        zoom: state.zoom,
        center: state.center,
        setZoom: state.setZoom,
        setCenter: state.setCenter,
        pitch: state.pitch,
        setPitch: state.setPitch,
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
    if (mapRef.current?.getPitch() === pitch) return;
    mapRef.current?.setPitch(pitch);
  }, [pitch]);

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
      pitch: pitch,
      maxZoom: 18.5,
      maxBounds: [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
    });

    mapRef.current.on("load", () => {
      setMounted(true);
    });

    mapRef.current.on("click", (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ["building"], // Filtre uniquement les bâtiments
      });

      console.log("Clicked features:", features);
    });

    mapRef.current.on("zoom", () => {
      if (!mapRef.current) return;
      setZoom(mapRef?.current?.getZoom());
    });

    mapRef.current.on("pitch", () => {
      if (!mapRef.current) return;
      setPitch(mapRef?.current?.getPitch());
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
