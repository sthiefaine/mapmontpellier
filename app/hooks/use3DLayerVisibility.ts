import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapControlsStore } from '@/app/store/map/controls';

export const use3DLayerVisibility = (map: maplibregl.Map | null, mounted: boolean) => {
  const { is3DEnabled } = useMapControlsStore();

  useEffect(() => {
    if (!map || !mounted) return;
    let timeoutId: NodeJS.Timeout;
    const checkLayer = () => {
      if (map.getLayer('building-3d')) {
        map.setLayoutProperty('building-3d', 'visibility', is3DEnabled ? 'visible' : 'none');
      } else {
        timeoutId = setTimeout(checkLayer, 100);
      }
    };

    const waitForStyleLoad = () => {
      if (map.isStyleLoaded()) {
        checkLayer();
      } else {
        map.once('styledata', checkLayer);
      }
    };

    waitForStyleLoad();

    return () => {
      clearTimeout(timeoutId);
      map.off('styledata', checkLayer);
    };
  }, [is3DEnabled, map, mounted]);
};