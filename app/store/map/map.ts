import { create } from "zustand";

interface Polygon {
  id: string;
  geojson: any;
  color: string;
}

interface StoreState {
  polygons: Polygon[];
  addPolygon: (geojson: any) => void;
  updatePolygonColor: (id: string, color: string) => void;
}

export const useMapStore = create<StoreState>((set) => ({
  polygons: [],
  addPolygon: (geojson) =>
    set((state) => ({
      polygons: [
        ...state.polygons,
        {
          id: Math.random().toString(),
          geojson,
          color: "red",
        },
      ],
    })),
  updatePolygonColor: (id, color) =>
    set((state) => ({
      polygons: state.polygons.map((poly) =>
        poly.id === id ? { ...poly, color } : poly
      ),
    })),
}));
