import { PISADataRow, getColorForValue } from "@/lib/dataLoader";

// Create legend items based on the selected variable
export const createLegendItems = (selectedVariable: string): Array<{ color: string, label: string }> => {
  // All variables now use the same scale since values are normalized between 0-1
  return [
    { color: '#10b981', label: 'High (≥0.7)' },
    { color: '#6366f1', label: 'Medium (0.3-0.7)' },
    { color: '#ef4444', label: 'Low (<0.3)' }
  ];
};

// Update the GeoJSON features with data values and colors
export const updateGeoJsonFeatures = (features: any[], selectedVariable: string, countryData: Record<string, PISADataRow>, selectedCountries: string[]) => {
  return features.map((feature: any) => {
    const countryCode = feature.properties.ISO3;
    const countryDataValue = countryData[countryCode]?.[selectedVariable];
    const numericValue = typeof countryDataValue === 'number' ? countryDataValue : NaN;
    return {
      ...feature,
      properties: {
        ...feature.properties,
        value: numericValue,
        color: getColorForValue(numericValue, selectedVariable),
        isSelected: selectedCountries.includes(countryCode)
      }
    };
  });
};
