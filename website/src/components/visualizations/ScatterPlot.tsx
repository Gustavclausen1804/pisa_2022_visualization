import React, { useMemo } from "react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ZAxis,
  Legend
} from "recharts";
import { PISADataRow } from "@/lib/dataLoader";
import { AlertCircle } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Custom tooltip component to display country information
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isPCAData = payload[0].payload.isPCA;
    
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        {isPCAData ? (
          <>
            <p className="text-sm">PC1: {payload[0].payload.x.toFixed(2)}</p>
            <p className="text-sm">PC2: {payload[0].payload.y.toFixed(2)}</p>
            <p className="text-sm">Well-being: {payload[0].payload.z.toFixed(2)}</p>
          </>
        ) : (
          <>
            <p className="text-sm">Bullying: {payload[0].payload.x.toFixed(2)}</p>
            <p className="text-sm">Math: {payload[0].payload.y.toFixed(0)}</p>
            <p className="text-sm">ESCS: {payload[0].payload.z.toFixed(2)}</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

interface ScatterPlotProps {
  countryData: Record<string, PISADataRow>;
  selectedCountries: string[];
  loading: boolean;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ 
  countryData,
  selectedCountries,
  loading
}) => {
  // Transform country data into the format needed for the scatter plot
  const scatterData = useMemo(() => {
    if (!countryData || Object.keys(countryData).length === 0) {
      console.log("No country data available for scatter plot");
      return [];
    }
    
    // For normal bullying/math correlation plot
    const transformedData = Object.values(countryData)
      .filter(country => {
        const mathValue = country['PV1MATH'];
        const bulliedValue = country['BULLIED'];
        // Filter out entries with missing data
        const isValid = typeof mathValue === 'number' && !isNaN(mathValue) && 
                        typeof bulliedValue === 'number' && !isNaN(bulliedValue);
        if (!isValid) {
          console.log(`Filtering out country with invalid data: ${country.CNT}`, { mathValue, bulliedValue });
        }
        return isValid;
      })
      .map(country => ({
        name: country.CountryName || country.CNT,
        code: country.CNT,
        x: country['BULLIED'], // Bullying on x-axis
        y: country['PV1MATH'], // Math performance on y-axis
        z: country['ESCS'] || 0, // Optional third dimension (socioeconomic status)
        isSelected: selectedCountries.includes(country.CNT as string),
        isPCA: false
      }));
    
    // For PCA plot using X and Y coordinates
    const pcaData = Object.values(countryData)
      .filter(country => {
        const xValue = country['X'];
        const yValue = country['Y'];
        // Filter out entries with missing data
        const isValid = typeof xValue === 'number' && !isNaN(xValue) && 
                        typeof yValue === 'number' && !isNaN(yValue);
        if (!isValid && country.X !== undefined) {
          console.log(`Filtering out country with invalid PCA data: ${country.CNT}`, { xValue, yValue });
        }
        return isValid;
      })
      .map(country => ({
        name: country.CountryName || country.CNT,
        code: country.CNT,
        x: country['X'], // X coordinate from PCA
        y: country['Y'], // Y coordinate from PCA
        z: country['OWB'] || 0, // Well-being score as third dimension
        isSelected: selectedCountries.includes(country.CNT as string),
        isPCA: true
      }));
    
    // Use PCA data if available, otherwise use standard scatter plot data
    const finalData = pcaData.length > 0 ? pcaData : transformedData;
    
    console.log(`Transformed ${finalData.length} countries for scatter plot`);
    return finalData;
  }, [countryData, selectedCountries]);
  
  // Debug the data we're trying to display
  console.log("ScatterPlot data:", { 
    countryDataKeys: Object.keys(countryData || {}),
    scatterDataLength: scatterData.length,
    scatterDataSample: scatterData.slice(0, 3),
    selectedCountries
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (scatterData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <AlertCircle className="h-6 w-6 text-amber-500" />
        <p className="text-muted-foreground">No data available for scatter plot analysis</p>
        <p className="text-xs text-muted-foreground">This might be due to missing X and Y coordinates in the data</p>
      </div>
    );
  }

  // Determine if we're using PCA data based on the first data point
  const isPCAData = scatterData.length > 0 && scatterData[0].isPCA;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, bottom: 60, left: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={isPCAData ? "X Dimension" : "Exposure to Bullying"}
            domain={['dataMin', 'dataMax']}
            label={{ 
              value: isPCAData ? 'Principal Component 1' : 'Exposure to Bullying (BULLIED)', 
              position: 'bottom', 
              offset: 30 
            }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={isPCAData ? "Y Dimension" : "Math Performance"}
            domain={['dataMin', 'dataMax']}
            label={{ 
              value: isPCAData ? 'Principal Component 2' : 'Math Performance (PV1MATH)',
              angle: -90, 
              position: 'insideLeft', 
              offset: -25 
            }}
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[50, 400]} 
            name={isPCAData ? "Well-being Score" : "Socioeconomic Status"} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="top" 
            align="center" 
            height={36}
            wrapperStyle={{ paddingBottom: 10 }}
          />
          <Scatter
            name="All Countries"
            data={scatterData.filter(d => !d.isSelected)}
            fill="#8884d8"
            opacity={0.6}
            shape={(props) => {
              const { cx, cy, fill, opacity } = props;
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={6} 
                  stroke="none" 
                  fill={fill} 
                  fillOpacity={opacity}
                />
              );
            }}
          />
          {selectedCountries.length > 0 && (
            <Scatter
              name="Selected Countries"
              data={scatterData.filter(d => d.isSelected)}
              fill="#ff7300"
              shape="circle"
              opacity={1}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
