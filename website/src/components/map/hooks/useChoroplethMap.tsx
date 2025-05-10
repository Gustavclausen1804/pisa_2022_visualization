
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { PISADataRow } from '@/lib/dataLoader';
import { updateGeoJsonFeatures } from '../MapUtils';

type UseChoroplethMapProps = {
  map: mapboxgl.Map | null;
  isMapLoaded: boolean;
  selectedVariable: string;
  selectedCountries: string[];
  countryData: Record<string, PISADataRow>;
  onCountrySelect: (code: string) => void;
};

const useChoroplethMap = ({
  map,
  isMapLoaded,
  selectedVariable,
  selectedCountries,
  countryData,
  onCountrySelect
}: UseChoroplethMapProps) => {
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null);
  const [hoveredCountryInfo, setHoveredCountryInfo] = useState<{ name: string; value: number | null } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);

  // Setup the choropleth map when the map is loaded
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    
    const setupChoroplethMap = async () => {
      try {
        // Add source for European countries
        const response = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson');
        const geojsonData = await response.json();
        
        // Filter to include only countries we have data for
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

        // Add the source
        map.addSource('europe-countries', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: updatedFeatures
          }
        });

        // Add fill layer
        map.addLayer({
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

        // Add outline layer
        map.addLayer({
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

        // Setup interactions
        setupMapInteractions();
      } catch (error) {
        console.error('Error setting up choropleth map:', error);
      }
    };

    setupChoroplethMap();
  }, [map, isMapLoaded, countryData]);

  // Update map when data or selections change
  useEffect(() => {
    updateChoroplethMap();
  }, [selectedVariable, selectedCountries, countryData]);

  // Setup map interactions
  const setupMapInteractions = () => {
    if (!map) return;

    // Track mouse position for tooltip
    const mapElement = map.getCanvas();
    mapElement.style.cursor = 'default';

    // Interactive variables
    let debounceTimer: number | null = null;
    let currentHoveredCountry: string | null = null;
    
    // Track mouse movements over the map container
    const mapContainer = mapElement.parentElement;
    if (mapContainer) {
      mapContainer.addEventListener('mousemove', (e) => {
        if (hoveredCountryInfo) {
          setTooltipPosition({
            x: e.clientX,
            y: e.clientY - 40
          });
        }
      });
    }
    
    // Country hover
    map.on('mousemove', 'europe-countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryId = e.features[0].properties.ISO3;
        
        // Skip if it's the same country
        if (currentHoveredCountry === countryId) {
          return;
        }
        
        mapElement.style.cursor = 'pointer';
        currentHoveredCountry = countryId;
        
        // Clear any existing hover states
        if (hoveredCountryId) {
          map.setFeatureState(
            { source: 'europe-countries', id: hoveredCountryId },
            { hover: false }
          );
        }
        
        // Set new hover state
        setHoveredCountryId(countryId);
        map.setFeatureState(
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
          
          setTooltipPosition({
            x: e.point.x,
            y: e.point.y - 10
          });
          
          setHoveredCountryInfo({
            name: countryName,
            value: typeof value === 'number' ? value : null
          });
          
          console.log("Hover info set:", countryName, value);
        }, 50);
      }
    });

    // Handle mouse leave
    map.on('mouseleave', 'europe-countries-fill', () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      
      if (hoveredCountryId) {
        map.setFeatureState(
          { source: 'europe-countries', id: hoveredCountryId },
          { hover: false }
        );
      }
      
      setHoveredCountryInfo(null);
      setTooltipPosition(null);
      setHoveredCountryId(null);
      currentHoveredCountry = null;
      mapElement.style.cursor = '';
    });

    // Add click handler
    map.on('click', 'europe-countries-fill', (e) => {
      if (e.features && e.features.length > 0) {
        const countryId = e.features[0].properties.ISO3;
        onCountrySelect(countryId);
      }
    });
  };

  // Update the map when selections change
  const updateChoroplethMap = () => {
    if (!map || !map.getSource('europe-countries')) return;
    
    try {
      // Get the current data
      const data = (map.getSource('europe-countries') as mapboxgl.GeoJSONSource)._data;
      
      if (!data) return;
      
      // Update features
      const updatedFeatures = updateGeoJsonFeatures(
        data.features, 
        selectedVariable, 
        countryData, 
        selectedCountries
      );
      
      // Update the source
      (map.getSource('europe-countries') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: updatedFeatures
      });
    } catch (error) {
      console.error('Error updating choropleth map:', error);
    }
  };

  return {
    hoveredCountryInfo,
    tooltipPosition
  };
};

export default useChoroplethMap;
