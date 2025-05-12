import { useState, useEffect } from "react";
import Papa from "papaparse";

export interface PISADataRow {
  CNT: string; // Country code
  BELONG: number; // Sense of belonging
  BULLIED: number; // Exposure to bullying
  FAMSUP: number; // Family support
  STRESAGR: number; // School-related stress
  EMOCOAGR: number; // Emotional control
  EMPATAGR: number; // Empathy
  ESCS: number; // Economic, social and cultural status
  HISEI: number; // Highest occupational status
  HISCED: number; // Highest education level
  HOMEPOS: number; // Home possessions
  PAREDINT: number; // Parental interest
  PV1MATH: number; // Math performance
  PV1READ: number; // Reading performance
  PV10SCIE: number; // Science performance (standardized name)
  OWB: number; // Overall well-being (PCA composite)
  X?: number; // X coordinate for principal component analysis
  Y?: number; // Y coordinate for principal component analysis
  CountryName: string; // Full country name
  [key: string]: string | number | undefined; // Allow for other fields
}

// Load CSV data from public folder
export const useCSVData = () => {
  const [data, setData] = useState<PISADataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.info("Attempting to load CSV data from various paths...");
        const baseUrl = import.meta.env.BASE_URL || '';
        // First try to load the PCA data with X,Y coordinates
        console.info(`Attempting to load from: ${baseUrl}/OWB_PCA_country_means_2.csv`);
        const pcaResponse = await fetch(`${baseUrl}/OWB_PCA_country_means_2.csv`);
        if (!pcaResponse.ok) {
          throw new Error(`Failed to load PCA data: ${pcaResponse.status} ${pcaResponse.statusText}`);
        }
        const pcaText = await pcaResponse.text();

        // Try to load the regular country means data
        console.info(`Attempting to load from: ${baseUrl}/country_means.csv`);
        const response = await fetch(`${baseUrl}/country_means.csv`);
        if (!response.ok) {
          throw new Error(`Failed to load country means data: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();

        // Parse the PCA data
        const pcaResults = Papa.parse(pcaText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        console.log("PCA data loaded:", pcaResults.data.slice(0, 3));

        // Create a map of country codes to PCA data
        const pcaDataMap = new Map<string, { OWB: number, X: number, Y: number }>();
        pcaResults.data.forEach((row: any) => {
          if (row.CNT) {
            pcaDataMap.set(row.CNT, {
              OWB: row.OWB,
              X: row.X,
              Y: row.Y
            });
          }
        });

        // Parse the main data
        const results = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        // Debug logs
        console.info("Main data loaded. Number of rows:", results.data.length);
        console.info("Sample data:", results.data.slice(0, 2));

        // Check for data format
        if (results.data.length === 0) {
          throw new Error("No data found in the CSV file");
        }

        // Merge the main data with PCA data
        const mergedData = results.data.map((row: any) => {
          if (!row.CNT) {
            console.warn("Row missing country code:", row);
            return null;
          }

          const pcaData = pcaDataMap.get(row.CNT);

          // Get the country name from our predefined list
          const countryInfo = europeanCountries.find(c => c.code === row.CNT);
          const countryName = countryInfo ? countryInfo.name : row.CNT;

          return {
            ...row,
            // Ensure science score is correctly named
            PV10SCIE: row.PV10SCIE !== undefined ? row.PV10SCIE : row.PV1SCI,
            // Add PCA data if available
            OWB: pcaData?.OWB,
            X: pcaData?.X,
            Y: pcaData?.Y,
            // Add the country name
            CountryName: countryName
          };
        }).filter(Boolean); // Filter out any null entries

        console.info("Merged data complete. Total countries:", mergedData.length);

        if (mergedData.length === 0) {
          throw new Error("No valid country data after merging");
        }

        setData(mergedData as PISADataRow[]);
        setLoading(false);
      } catch (err) {
        console.error("Error loading CSV data:", err);
        setError(`Failed to load data: ${err}`);
        setLoading(false);

        // Try to load just the PCA data as a fallback
        try {
          console.info("Attempting fallback to only PCA data...");
          const pcaResponse = await fetch(`${baseUrl}/OWB_PCA_country_means_2.csv`);
          const pcaText = await pcaResponse.text();

          const pcaResults = Papa.parse(pcaText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
          });

          // Transform PCA data into usable format
          const purelyPcaData = pcaResults.data
            .filter((row: any) => row.CNT)
            .map((row: any) => {
              // Get the country name from our predefined list
              const countryInfo = europeanCountries.find(c => c.code === row.CNT);
              return {
                CNT: row.CNT,
                OWB: row.OWB,
                X: row.X,
                Y: row.Y,
                CountryName: countryInfo ? countryInfo.name : row.CNT
              };
            });

          console.info("Fallback data loaded. Total countries:", purelyPcaData.length);
          if (purelyPcaData.length > 0) {
            setData(purelyPcaData as unknown as PISADataRow[]);
            setError("Partial data loaded. Only PCA coordinates available.");
          }
        } catch (fallbackErr) {
          console.error("Fallback data loading also failed:", fallbackErr);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Filter data to only include European countries
export const getEuropeanData = (data: PISADataRow[]) => {
  // List of European country codes
  const europeanCountryCodes = [
    'ALB', 'AUT', 'BEL', 'BGR', 'BIH', 'BLR', 'CHE', 'CYP', 'CZE',
    'DEU', 'DNK', 'ESP', 'EST', 'FIN', 'FRA', 'GBR', 'GRC', 'HRV',
    'HUN', 'IRL', 'ISL', 'ITA', 'LTU', 'LUX', 'LVA', 'MDA', 'MKD',
    'MLT', 'MNE', 'NLD', 'NOR', 'POL', 'PRT', 'ROU', 'RUS', 'SRB',
    'SVK', 'SVN', 'SWE', 'UKR'
  ];

  return data.filter(row => europeanCountryCodes.includes(row.CNT));
};

// Calculate country averages
export const getCountryAverages = (data: PISADataRow[]) => {
  const countryData: Record<string, PISADataRow> = {};

  // Get country name mapping from our predefined European countries list
  const countryNameMap = new Map<string, string>();
  europeanCountries.forEach(country => {
    countryNameMap.set(country.code, country.name);
  });

  // Group data by country
  data.forEach(row => {
    const countryCode = row.CNT;
    if (!countryData[countryCode]) {
      // Initialize with full country name from our mapping
      countryData[countryCode] = {
        ...row,
        CountryName: countryNameMap.get(countryCode) || row.CountryName || countryCode,
        count: 1
      };
    } else {
      // Aggregate numeric values
      Object.keys(row).forEach(key => {
        const value = row[key];
        if (typeof value === 'number') {
          const currentValue = countryData[countryCode][key];
          if (typeof currentValue === 'number') {
            countryData[countryCode][key] = currentValue + value;
          } else {
            countryData[countryCode][key] = value;
          }
        }
      });
      countryData[countryCode].count = (countryData[countryCode].count as number || 0) + 1;
    }
  });

  // Calculate averages
  Object.keys(countryData).forEach(countryCode => {
    const country = countryData[countryCode];
    const count = country.count as number || 1;

    Object.keys(country).forEach(key => {
      const value = country[key];
      if (typeof value === 'number' && key !== 'count') {
        country[key] = value / count;
      }
    });

    // Remove the count property
    delete country.count;
  });

  return countryData;
};

// Get color for a value based on the variable type
export const getColorForValue = (value: number, variable: string): string => {
  // Handle NaN values
  if (isNaN(value)) return '#cccccc';

  // All variables now use the same scale since values are normalized between 0-1
  if (value >= 0.7) return '#10b981'; // green for high values
  if (value >= 0.3) return '#6366f1'; // blue for medium values
  return '#ef4444'; // red for low values
};

// Calculate Pearson correlation coefficient between two variables
export const calculateCorrelation = (data: PISADataRow[], var1: string, var2: string): number => {
  // Filter data to include only rows where both variables have valid values
  const filteredData = data.filter(row => {
    const val1 = row[var1];
    const val2 = row[var2];
    return (
      typeof val1 === 'number' && !isNaN(val1) &&
      typeof val2 === 'number' && !isNaN(val2)
    );
  });

  if (filteredData.length < 2) return 0;

  // Calculate means
  let sum1 = 0, sum2 = 0;
  filteredData.forEach(row => {
    sum1 += row[var1] as number;
    sum2 += row[var2] as number;
  });
  const mean1 = sum1 / filteredData.length;
  const mean2 = sum2 / filteredData.length;

  // Calculate correlation
  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  filteredData.forEach(row => {
    const val1 = (row[var1] as number) - mean1;
    const val2 = (row[var2] as number) - mean2;
    numerator += val1 * val2;
    denom1 += val1 * val1;
    denom2 += val2 * val2;
  });

  const denominator = Math.sqrt(denom1 * denom2);

  return denominator === 0 ? 0 : numerator / denominator;
};

// Import the European countries data to use for mapping country codes to names
import { europeanCountries } from "./data";
