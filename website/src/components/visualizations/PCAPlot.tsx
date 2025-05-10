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
  Legend,
  Label
} from "recharts";
import { PISADataRow } from "@/lib/dataLoader";
import { AlertCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PCAPlotProps {
  countryData: Record<string, PISADataRow>;
  selectedCountries: string[];
  loading: boolean;
}

// Custom tooltip component to display country name
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm">PC1: {payload[0].payload.x.toFixed(2)}</p>
        <p className="text-sm">PC2: {payload[0].payload.y.toFixed(2)}</p>
        <p className="text-sm">Well-being: {payload[0].payload.z.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const PCAPlot: React.FC<PCAPlotProps> = ({
  countryData,
  selectedCountries,
  loading
}) => {
  // Transform country data into the format needed for the scatter plot
  const scatterData = useMemo(() => {
    if (!countryData || Object.keys(countryData).length === 0) {
      console.log("No country data available for PCA plot");
      return [];
    }

    // For PCA plot using X and Y coordinates
    return Object.values(countryData)
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
        isSelected: selectedCountries.includes(country.CNT as string)
      }));
  }, [countryData, selectedCountries]);

  console.log("PCA plot data:", {
    dataLength: scatterData.length,
    sampleData: scatterData.slice(0, 3)
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
        <p className="text-muted-foreground">No PCA data available</p>
        <p className="text-xs text-muted-foreground">This might be due to missing X and Y coordinates in the data</p>
      </div>
    );
  }

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
            name="Principal Component 1"
            domain={['dataMin', 'dataMax']}
            tick={false} // Hide axis numbers
          >
            <Label
              value="Principal Component 1"
              position="bottom"
              offset={20}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            name="Principal Component 2"
            domain={['dataMin', 'dataMax']}
            tick={false} // Hide axis numbers
          >
            <Label
              value="Principal Component 2"
              angle={-90}
              position="left"
              style={{ textAnchor: 'middle' }}
              offset={-30}
            />
          </YAxis>
          <ZAxis
            type="number"
            dataKey="z"
            range={[50, 400]}
            name="Well-being Score"
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

export default PCAPlot;
