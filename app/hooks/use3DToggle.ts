import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapControlsStore } from '@/app/store/map/controls';

export const use3DToggle = (map: maplibregl.Map | null, mounted: boolean) => {
  const { is3DEnabled } = useMapControlsStore();

  useEffect(() => {
    if (!map || !mounted) return;

    const handle3DToggle = () => {
      if (is3DEnabled) {
        map.easeTo({ pitch: 30, bearing: 0, duration: 1000 });
        map.dragRotate.enable();
        map.keyboard.enable();
        map.touchZoomRotate.enableRotation();
      } else {
        map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
        map.dragRotate.disable();
        map.keyboard.disable();
        map.touchZoomRotate.disableRotation();
        map.setTerrain(null);
      }
    };

    handle3DToggle();
  }, [is3DEnabled, map, mounted]);
};