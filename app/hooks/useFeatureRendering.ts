import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { useMapStore } from '@/app/store/map/map';
import type { LayerSpecification } from 'maplibre-gl';

export const useFeatureRendering = (map: maplibregl.Map | null) => {
  const { features } = useMapStore();

  useEffect(() => {
    if (!map) return;

    features.forEach((feature) => {
      const sourceId = `feature-${feature.id}`;
      const layerId = `layer-${feature.id}`;

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: feature.geojson
        });
      }

      if (!map.getLayer(layerId)) {
        const layerConfig: LayerSpecification = feature.type === 'polygon' ? {
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': feature.color,
            'fill-opacity': 0.5
          },
          layout: {}
        } : {
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-color': feature.color,
            'circle-radius': 6
          }
        };

        map.addLayer(layerConfig);
      }
    });
  }, [features, map]);
};