import { useMapControlsStore } from "@/app/store/map/controls";
import {
  Minus,
  Plus,
  Locate,
  Globe,
  ArrowDownFromLine,
  Rotate3d,
  ArrowUpFromLine,
} from "lucide-react";
import { useShallow } from "zustand/shallow";

export function MapControls() {
  const {
    zoom,
    setZoom,
    setCenter,
    is3DEnabled,
    setIs3DEnabled,
    pitch,
    setPitch,
  } = useMapControlsStore(
    useShallow((state) => ({
      zoom: state.zoom,
      setZoom: state.setZoom,
      setCenter: state.setCenter,
      is3DEnabled: state.is3DEnabled,
      setIs3DEnabled: state.setIs3DEnabled,
      pitch: state.pitch,
      setPitch: state.setPitch,
    }))
  );

  const handleZoomIn = () => {
    setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    if (Math.floor(zoom) <= 1) return;
    setZoom(zoom - 1);
  };

  const handlePitch = (value: number) => {
    setPitch(pitch + value);
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        setCenter([coords.longitude, coords.latitude]);
      });
    }
  };

  return (
    <div className="absolute bottom-0 z-10 left-4 flex flex-row gap-1 pb-2">
      <div className="flex gap-1 flex-col">
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={getGeolocation}
        >
          <Locate className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-1 flex-col">
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={() => handlePitch(+2)}
        >
          <ArrowDownFromLine className="h-4 w-4" />
        </button>
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={() => handlePitch(-2)}
        >
          <ArrowUpFromLine className="h-4 w-4" />
        </button>
        <button
          className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center"
          onClick={setIs3DEnabled}
        >
          {is3DEnabled ? (
            <Globe className="h-4 w-4" />
          ) : (
            <Rotate3d className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
