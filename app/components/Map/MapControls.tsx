import { useMapControlsStore } from "@/app/store/map/controls"
import { Minus, Plus, Locate } from "lucide-react"
import { useShallow } from "zustand/shallow"

export function MapControls() {

  const { zoom, setZoom, setCenter } = useMapControlsStore(
    useShallow(state => ({
      zoom: state.zoom,
      setZoom: state.setZoom,
      setCenter: state.setCenter,
    }))
  )

  const handleZoomIn = () => {
    setZoom(zoom + 1)
  }

  const handleZoomOut = () => {
    if (Math.floor(zoom) <= 1) return
    setZoom(zoom - 1)
  }

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position
        setCenter([coords.longitude, coords.latitude])
      })
    }
  }

  return (
    <div className="absolute bottom-0 z-10 left-4 flex flex-col gap-1 pb-2">
      <button className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center" onClick={handleZoomIn}>
        <Plus className="h-4 w-4" />
      </button>
      <button className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center" onClick={handleZoomOut}>
        <Minus className="h-4 w-4" />
      </button>
      <button className="bg-current-inv text-current-inv rounded h-8 w-8 flex justify-center items-center" onClick={getGeolocation}>
        <Locate className="h-4 w-4" />
      </button>
    </div>
  )
}

