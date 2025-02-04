import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type {} from '@redux-devtools/extension'

export type MapControlsState = {
  zoom: number;
  center: [number, number];
  rotation: number;
};

export type MapControlsActions = {
  setZoom: (zoom: number) => void;
  setCenter: (center: [number, number]) => void;
  setRotation: (rotation: number) => void;
};

export type MapControlsStore = MapControlsState & MapControlsActions;

export const defaultInitState: MapControlsState = {
  zoom: 17.5,
  center: [0, 0],
  rotation: 0,
};

export const useMapControlsStore = create<MapControlsStore>()(
  devtools(
    persist(
      (set) => ({
        ...defaultInitState,
        setZoom: (zoom) => set({ zoom }),
        setCenter: (center) => set({ center }),
        setRotation: (rotation) => set({ rotation }),
      }),
      {
        name: 'MapControlsStore',
      },
    ),
  ),
);
