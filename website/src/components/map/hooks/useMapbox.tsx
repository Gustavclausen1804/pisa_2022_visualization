
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default map configuration
const DEFAULT_CENTER = [15, 54]; // Europe
const DEFAULT_ZOOM = 3.5;

type UseMapboxProps = {
  mapboxToken: string;
  container: React.RefObject<HTMLDivElement>;
};

const useMapbox = ({ mapboxToken, container }: UseMapboxProps) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!container.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: container.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        maxBounds: [[-25, 30], [45, 75]], // Restrict to Europe
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'bottom-right'
      );

      // Wait for map to load
      map.current.on('load', () => {
        setIsMapLoaded(true);
      });
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapLoaded(false);
      }
    };
  }, [mapboxToken, container]);

  // Map navigation helpers
  const zoomIn = () => {
    if (!map.current) return;
    const currentZoom = map.current.getZoom();
    map.current.easeTo({
      zoom: currentZoom + 1,
      duration: 500
    });
  };

  const zoomOut = () => {
    if (!map.current) return;
    const currentZoom = map.current.getZoom();
    map.current.easeTo({
      zoom: currentZoom - 1,
      duration: 500
    });
  };

  const flyToEurope = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      duration: 1500
    });
  };

  return {
    map: map.current,
    isMapLoaded,
    controls: {
      zoomIn,
      zoomOut,
      flyToEurope
    }
  };
};

export default useMapbox;
