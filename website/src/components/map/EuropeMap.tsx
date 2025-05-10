
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PISADataRow } from "@/lib/dataLoader";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";
import MapTokenInput from "./MapTokenInput";
import MapLoading from "./MapLoading";
import { createLegendItems, updateGeoJsonFeatures } from "./MapUtils";

// Set your Mapbox access token here
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ3VzdGF2MTgwNCIsImEiOiJjbWE0MzB4ZmcwMmxyMmlxenkxb3kxbDRhIn0.S7fEsxZHglwllqaFWJOqLQ"; // Replace this with your actual Mapbox token

type EuropeMapProps = {
  selectedVariable: string;
  selectedCountries: string[];
  onCountrySelect: (code: string) => void;
  countryData: Record<string, PISADataRow>;
  loading: boolean;
};

const EuropeMap = ({ 
  selectedVariable, 
  selectedCountries, 
  onCountrySelect,
  countryData,
  loading
}: EuropeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState(mapboxToken === "" || mapboxToken === "YOUR_MAPBOX_ACCESS_TOKEN");
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [legendItems, setLegendItems] = useState<Array<{color: string, label: string}>>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [hoveredCountryInfo, setHoveredCountryInfo] = useState<{ name: string; value: number | null } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);

  // Set up the map when the component mounts
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || showTokenInput || loading) return;

    mapboxgl.accessToken = mapboxToken;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [15, 54],
        zoom: 3.5,
        maxBounds: [[-25, 30], [45, 75]], // Restrict to Europe
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'bottom-right'
      );

      // Wait for map to load before adding data
      map.current.on('load', () => {
        setupChoroplethMap();
      });
    } else {
      updateChoroplethMap();
    }

    // Setup legend based on selected variable
    setupLegend();

    // Clean up on unmount
    return () => {
      if (map.current) {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, showTokenInput, loading]);

  // Update the map when selected variable or selected countries change
  useEffect(() => {
    if (!map.current || map.current.isStyleLoaded() === false) return;
    
    updateChoroplethMap();
    setupLegend();
  }, [selectedVariable, selectedCountries, countryData]);

  const setupChoroplethMap = async () => {
    if (!map.current) return;
    
    try {
      // Add source for European countries
      const response = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson');
      const geojsonData = await response.json();
      
      // Filter to include only countries we have data for and add our data properties
      const filteredFeatures = geojsonData.features.filter((feature: any) => {
        const countryCode = feature.properties.ISO3;
        return countryData[countryCode];
      });
      
      const updatedFeatures = updateGeoJsonFeatures(
        filteredFeatures, 
        selectedVariable, 
        countryData, 
        selectedCountries
      );

      // Add the source and layers to the map
      map.current.addSource('europe-countries', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: updatedFeatures
        }
      });

      // Add fill layer for country colors
      map.current.addLayer({
        id: 'europe-countries-fill',
        type: 'fill',
        source: 'europe-countries',
        layout: {},
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': [
            'case',
            ['to-boolean', ['feature-state', 'hover']], 0.8,
            ['get', 'isSelected'], 0.9,
            0.6
          ]
        }
      });

      // Add outline layer for country borders
      map.current.addLayer({
        id: 'europe-countries-outline',
        type: 'line',
        source: 'europe-countries',
        layout: {},
        paint: {
          'line-color': [
            'case',
            ['get', 'isSelected'], '#000000',
            '#ffffff'
          ],
          'line-width': [
            'case',
            ['get', 'isSelected'], 2,
            0.5
          ]
        }
      });

      // Setup interaction handlers
      setupMapInteractions();

    } catch (error) {
      console.error('Error setting up choropleth map:', error);
    }
  };

  const setupMapInteractions = () => {
    if (!map.current) return;

    // Track mouse position on the map for tooltip positioning
    const mapElement = map.current.getCanvas();
    mapElement.style.cursor = 'default';

    // Add interactivity with debounce for tooltip
    let debounceTimer: number | null = null;
    let currentHoveredCountry: string | null = null;
    
    // Track mouse movements over the map
    mapContainer.current?.addEventListener('mousemove', (e) => {
      if (hoveredCountryInfo) {
        // Update tooltip position based on mouse coordinates
        setTooltipPosition({
          x: e.clientX,
          y: e.clientY - 40  // Position tooltip above cursor
        });
      }
    });
    
    map.current.on('mousemove', 'europe-countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryId = e.features[0].properties.ISO3;
        
        // If it's the same country, just update tooltip position
        if (currentHoveredCountry === countryId) {
          return;
        }
        
        mapElement.style.cursor = 'pointer';
        currentHoveredCountry = countryId;
        
        // Clear any existing hover states
        if (hoveredCountryId) {
          map.current?.setFeatureState(
            { source: 'europe-countries', id: hoveredCountryId },
            { hover: false }
          );
        }
        
        // Set new hover state
        setHoveredCountryId(countryId);
        map.current?.setFeatureState(
          { source: 'europe-countries', id: countryId },
          { hover: true }
        );
        
        // Clear any existing timer
        if (debounceTimer) window.clearTimeout(debounceTimer);
        
        // Create tooltip with debounce
        debounceTimer = window.setTimeout(() => {
          if (!e.features || !e.features[0]) {
            console.error("No features available in the event");
            return;
          }
          
          const countryName = e.features[0].properties.NAME;
          const value = countryData[countryId]?.[selectedVariable];
          
          // Set tooltip position relative to mouse
          setTooltipPosition({
            x: e.point.x,
            y: e.point.y - 10
          });
          
          // Update the hovered country info
          setHoveredCountryInfo({
            name: countryName,
            value: typeof value === 'number' ? value : null
          });
          
          console.log("Hover info set:", countryName, value);
        }, 50); // Small delay to prevent spamming
      }
    });

    // Handle mouseout
    map.current.on('mouseleave', 'europe-countries-fill', () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      
      if (hoveredCountryId) {
        map.current?.setFeatureState(
          { source: 'europe-countries', id: hoveredCountryId },
          { hover: false }
        );
      }
      
      // Clear the hovered country info and tooltip
      setHoveredCountryInfo(null);
      setTooltipPosition(null);
      setHoveredCountryId(null);
      currentHoveredCountry = null;
      mapElement.style.cursor = '';
    });

    // Add click handler for country selection
    map.current.on('click', 'europe-countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryId = e.features[0].properties.ISO3;
        onCountrySelect(countryId);
      }
    });
  };

  const updateChoroplethMap = () => {
    if (!map.current || !map.current.getSource('europe-countries')) return;
    
    try {
      // Get the current data
      const data = (map.current.getSource('europe-countries') as mapboxgl.GeoJSONSource)._data;
      
      if (!data) return;
      
      // Update the data with new values and colors
      const updatedFeatures = updateGeoJsonFeatures(
        data.features, 
        selectedVariable, 
        countryData, 
        selectedCountries
      );
      
      // Update the source data
      (map.current.getSource('europe-countries') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: updatedFeatures
      });
    } catch (error) {
      console.error('Error updating choropleth map:', error);
    }
  };

  const setupLegend = () => {
    // Create legend items based on the selected variable
    const items = createLegendItems(selectedVariable);
    setLegendItems(items);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!map.current) return;
    const currentZoom = map.current.getZoom();
    map.current.easeTo({
      zoom: direction === 'in' ? currentZoom + 1 : currentZoom - 1,
      duration: 500
    });
  };

  const handleFlyToEurope = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [15, 54],
      zoom: 3.5,
      duration: 1500
    });
  };

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setShowTokenInput(false);
  };

  if (loading) {
    return <MapLoading />;
  }

  if (showTokenInput) {
    return <MapTokenInput onTokenSubmit={handleTokenSubmit} initialToken={mapboxToken} />;
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-md" />
      
      <MapControls 
        onZoomIn={() => handleZoom('in')}
        onZoomOut={() => handleZoom('out')}
        onReset={handleFlyToEurope}
      />
      
      <MapLegend 
        title={selectedVariable}
        items={legendItems}
        hoveredCountry={null} // We're showing hover info as a tooltip now, not in the legend
      />

      {/* Country hover tooltip */}
      {hoveredCountryInfo && tooltipPosition && (
        <div 
          className="absolute bg-white px-2 py-1 text-xs shadow-md rounded-md pointer-events-none border z-50"
          style={{
            left: tooltipPosition.x + 'px',
            top: tooltipPosition.y + 'px',
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-medium">{hoveredCountryInfo.name}</div>
          <div>
            {hoveredCountryInfo.value !== null 
              ? `${selectedVariable}: ${typeof hoveredCountryInfo.value === 'number' ? hoveredCountryInfo.value.toFixed(2) : hoveredCountryInfo.value}`
              : `No data for ${selectedVariable}`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default EuropeMap;
