"use client";

import styles from "./mapDisplay.module.css";

import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

export const MapDisplay = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);

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
    if (!mapContainerRef?.current) return;

    // Initialisation de la carte
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `${process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL}/liberty.json`,
      center: [currentBat.lng, currentBat.lat], // position de départ [lng, lat]
      zoom: 17.5,
      maxBounds: [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]],
    });

    mapRef.current.on("click", (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const coordinates = [e.lngLat.lng, e.lngLat.lat];

      const features = mapRef?.current?.queryRenderedFeatures(e.point);
      console.log("Clicked features:", features);
      console.log("click", e);
    });

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;

      // Ajout de la source GeoJSON pour le polygone
      if (!mapRef.current.getSource("eraser")) {
        mapRef.current.addSource("eraser", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
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
                  type: "Polygon",
                },
              },
            ],
          },
        });
      }

      // Ajout du layer de remplissage avec une couleur rouge
      if (!mapRef.current.getLayer("eraser-layer")) {
        mapRef.current.addLayer({
          id: "eraser-layer",
          type: "fill",
          source: "eraser",
          paint: {
            "fill-color": "red",
            "fill-opacity": 0.5,
          },
        });
      }

      mapRef.current.resize();
    });

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles.section}>
      <div id="map" className={styles.map} ref={mapContainerRef} />
    </section>
  );
};
