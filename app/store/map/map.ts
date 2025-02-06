import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"
import type {} from '@redux-devtools/extension'

export type FeatureType = "polygon" | "point";

export interface MapFeature {
  id: string;
  type: FeatureType;
  geojson: any;
  color: string;
}

interface MapStoreState {
  features: MapFeature[];
  drawingMode: FeatureType | null;
  addFeature: (feature: Omit<MapFeature, "id">) => void;
  removeFeature: (id: string) => void;
  setDrawingMode: (mode: FeatureType | null) => void;
  updateFeatureColor: (id: string, color: string) => void;
}

export const useMapStore = create<MapStoreState>() (
  devtools(
    persist(
      (set) => ({
  features: [],
  drawingMode: null,
  addFeature: (feature) =>
    set((state) => ({
      features: [
        ...state.features,
        { ...feature, id: Math.random().toString() },
      ],
    })),
  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),
  setDrawingMode: (mode) => set({ drawingMode: mode }),
  updateFeatureColor: (id, color) =>
    set((state) => ({
      features: state.features.map((f) => (f.id === id ? { ...f, color } : f)),
    })),
      }),
      {
        name: "MapStore",
      },
    ),
  ),
);
