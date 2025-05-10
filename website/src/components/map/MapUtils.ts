
import { PISADataRow, getColorForValue } from "@/lib/dataLoader";

// Create legend items based on the selected variable
export const createLegendItems = (selectedVariable: string): Array<{color: string, label: string}> => {
  let items: Array<{color: string, label: string}> = [];
  
  if (selectedVariable === 'PV1MATH') {
    items = [
      { color: '#10b981', label: 'High (≥500)' },
      { color: '#6366f1', label: 'Medium (470-499)' },
      { color: '#ef4444', label: 'Low (<470)' }
    ];
  } else if (selectedVariable === 'BULLIED') {
    items = [
      { color: '#10b981', label: 'Low (≤-0.3)' },
      { color: '#6366f1', label: 'Medium (-0.3-0)' },
      { color: '#ef4444', label: 'High (>0)' }
    ];
  } else {
    items = [
      { color: '#10b981', label: 'High (≥0.3)' },
      { color: '#6366f1', label: 'Medium (0-0.3)' },
      { color: '#ef4444', label: 'Low (<0)' }
    ];
  }
  
  return items;
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
