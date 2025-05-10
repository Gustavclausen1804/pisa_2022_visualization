import {
  BarChart as RechartBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { PISADataRow } from "@/lib/dataLoader";

// Custom tooltip component to properly display country information
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">{payload[0].name}: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

type VisualizationPlaceholderProps = {
  variable: string;
  countries: string[];
  countryData: Record<string, PISADataRow>;
  loading: boolean;
};

const VisualizationPlaceholder = ({ 
  variable, 
  countries,
  countryData,
  loading
}: VisualizationPlaceholderProps) => {
  
  // Generate chart data from the actual country data
  const generateChartData = () => {
    if (countries.length === 0 || !countryData || Object.keys(countryData).length === 0) return [];
    
    // Create data entries for selected countries
    const selectedData = countries
      .filter(code => countryData[code] && 
               countryData[code][variable] !== undefined &&
               !isNaN(countryData[code][variable] as number))
      .map(code => ({
        name: countryData[code].CountryName || code,
        code: code,
        value: countryData[code][variable],
        fill: "#8b5cf6",
      }));
    
    // Debug
    console.log("VisualizationPlaceholder data:", {
      countries,
      countryDataKeys: Object.keys(countryData || {}),
      selectedData
    });
    
    // Sort by value
    return selectedData.sort((a, b) => (b.value as number) - (a.value as number));
  };

  const data = generateChartData();

  // Determine Y-axis domain based on data type
  const getYAxisDomain = () => {
    if (data.length === 0) return ['auto', 'auto'];
    if (variable === 'PV1MATH') {
      return [Math.min(400, Math.floor(Math.min(...data.map(d => d.value as number)) * 0.95)), 
              Math.max(550, Math.ceil(Math.max(...data.map(d => d.value as number)) * 1.05))]; 
    } else {
      // For standardized indices like BELONG and BULLIED
      const minVal = Math.min(...data.map(d => d.value as number));
      const maxVal = Math.max(...data.map(d => d.value as number));
      return [Math.min(-0.5, minVal * 1.1), Math.max(0.8, maxVal * 1.1)];
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">Loading data...</div>
        </div>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">No countries selected</div>
          <div className="text-sm text-muted-foreground">
            Please select at least one country to visualize data
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/50 rounded-md">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">No data available</div>
          <div className="text-sm text-muted-foreground">
            The selected countries don't have data for the {variable} variable
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartBar
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          angle={-45} 
          textAnchor="end" 
          tickMargin={10} 
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
          domain={getYAxisDomain()} 
          tickCount={7}
          label={{ 
            value: variable === 'PV1MATH' 
              ? 'PISA Math Score' 
              : `${variable} Index Value`, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 12 }
          }}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, bottom: 0 }} />
        {variable !== 'PV1MATH' && <ReferenceLine y={0} stroke="#000" strokeDasharray="3 3" />}
        <Bar dataKey="value" name={variable === 'PV1MATH' ? 'PISA Math Score' : `${variable} Index`} />
      </RechartBar>
    </ResponsiveContainer>
  );
};

export default VisualizationPlaceholder;
