import React, { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  ReferenceLine
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PISADataRow, calculateCorrelation } from "@/lib/dataLoader";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CorrelationGridProps {
  countryData: Record<string, PISADataRow>;
  selectedCountries: string[];
  loading: boolean;
}

interface ScatterPointData {
  x: number;
  y: number;
  name: string;
  code: string;
  isSelected: boolean;
}

// Custom tooltip to properly display country information
const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">{payload[0].name}: {payload[0].value.toFixed(2)}</p>
        <p className="text-sm text-gray-600">{payload[1].name}: {payload[1].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const availableVariables = [
  { id: 'BELONG', name: 'Sense of Belonging' },
  { id: 'BULLIED', name: 'Exposure to Bullying' },
  { id: 'PV1MATH', name: 'Math Performance' },
  { id: 'ESCS', name: 'Socioeconomic Status' }
];

const CorrelationGrid: React.FC<CorrelationGridProps> = ({
  countryData,
  selectedCountries,
  loading
}) => {
  const [page, setPage] = useState(0);
  const [hoveredPair, setHoveredPair] = useState<string | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['BELONG', 'BULLIED', 'PV1MATH', 'ESCS']);
  const [pairsPerPage, setPairsPerPage] = useState(3);
  const [colorVariable, setColorVariable] = useState<string>("ESCS");
  const [showTrendLine, setShowTrendLine] = useState(true);

  // Generate all unique pairs of selected variables
  const variablePairs = useMemo(() => {
    const pairs: Array<[string, string]> = [];
    for (let i = 0; i < selectedVariables.length; i++) {
      for (let j = i + 1; j < selectedVariables.length; j++) {
        pairs.push([selectedVariables[i], selectedVariables[j]]);
      }
    }
    return pairs;
  }, [selectedVariables]);

  // Pagination
  const totalPages = Math.ceil(variablePairs.length / pairsPerPage);
  const currentPairs = variablePairs.slice(page * pairsPerPage, (page + 1) * pairsPerPage);

  // Navigation functions
  const nextPage = () => setPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setPage((prev) => (prev - 1 + totalPages) % totalPages);

  // Transform country data for each scatter plot
  const getScatterData = (xVar: string, yVar: string) => {
    if (!countryData || Object.keys(countryData).length === 0) {
      return [];
    }

    return Object.values(countryData)
      .filter(country => {
        const xValue = country[xVar];
        const yValue = country[yVar];
        const colorValue = country[colorVariable];
        return (
          typeof xValue === 'number' && !isNaN(xValue) &&
          typeof yValue === 'number' && !isNaN(yValue) &&
          typeof colorValue === 'number' && !isNaN(colorValue)
        );
      })
      .map(country => ({
        x: country[xVar] as number,
        y: country[yVar] as number,
        colorValue: country[colorVariable] as number,
        name: country.CountryName || country.CNT, // Ensure we always use full country name
        code: country.CNT,
        isSelected: selectedCountries.includes(country.CNT as string)
      }));
  };

  // Calculate trend line for a scatter plot
  const calculateTrendLine = (data: ScatterPointData[]) => {
    if (!showTrendLine || data.length < 2) return null;

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    data.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Get min and max x values
    const minX = Math.min(...data.map(p => p.x));
    const maxX = Math.max(...data.map(p => p.x));

    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  };

  const getColorScale = (value: number, min: number, max: number) => {
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);

    // Color scale from blue (0) to purple (0.5) to red (1)
    const r = normalized > 0.5 ? 255 : Math.round(normalized * 2 * 255);
    const g = 50;
    const b = normalized < 0.5 ? 255 : Math.round((1 - normalized) * 2 * 255);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const toggleVariable = (variable: string) => {
    setSelectedVariables(prev => {
      if (prev.includes(variable)) {
        // Don't allow removing if only two variables left
        if (prev.length <= 2) return prev;
        return prev.filter(v => v !== variable);
      } else {
        return [...prev, variable];
      }
    });

    // Reset to first page when changing variables
    setPage(0);
  };

  const handleLayoutChange = (value: string) => {
    setPairsPerPage(parseInt(value));
    setPage(0); // Reset to first page when changing layout
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (Object.keys(countryData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] gap-2">
        <AlertCircle className="h-6 w-6 text-amber-500" />
        <p className="text-muted-foreground">No data available for correlation analysis</p>
        <p className="text-xs text-muted-foreground">This might be due to a data loading error</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">Correlation Grid Explorer</CardTitle>
            <CardDescription>Explore relationships between your chosen variables across countries</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={page === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-8 pointer-events-none"
            >
              {page + 1} / {totalPages || 1}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={page === totalPages - 1 || totalPages === 0}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {/* Variable selection and controls */}
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Variables:</span>
              <ScrollArea className="flex gap-1">
                <div className="flex gap-1 py-1">
                  {availableVariables.map(variable => (
                    <Badge
                      key={variable.id}
                      variant={selectedVariables.includes(variable.id) ? "default" : "outline"}
                      className={`cursor-pointer flex items-center gap-1 ${selectedVariables.includes(variable.id) ? "" : "opacity-60"}`}
                      onClick={() => toggleVariable(variable.id)}
                    >
                      {variable.name}
                      {selectedVariables.includes(variable.id) && selectedVariables.length > 2 && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center gap-2">
              {/* Layout selection */}
              <Select value={pairsPerPage.toString()} onValueChange={handleLayoutChange}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 plot</SelectItem>
                  <SelectItem value="2">2 plots</SelectItem>
                  <SelectItem value="3">3 plots</SelectItem>
                  <SelectItem value="4">4 plots</SelectItem>
                  <SelectItem value="6">6 plots</SelectItem>
                </SelectContent>
              </Select>

              {/* Color by variable */}
              {/* <Select value={colorVariable} onValueChange={setColorVariable}>
                <SelectTrigger className="w-[160px] h-8">
                  <SelectValue placeholder="Color by" />
                </SelectTrigger>
                <SelectContent>
                  {availableVariables.map(variable => (
                    <SelectItem key={variable.id} value={variable.id}>
                      Color by {variable.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              {/* Show trend line toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trend-line"
                  checked={showTrendLine}
                  onCheckedChange={() => setShowTrendLine(!showTrendLine)}
                />
                <label
                  htmlFor="trend-line"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Trend line
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${pairsPerPage >= 2 ? 'md:grid-cols-2' : ''} ${pairsPerPage >= 3 ? 'lg:grid-cols-3' : ''} gap-4`}>
          {currentPairs.map(([xVar, yVar]) => {
            const scatterData = getScatterData(xVar, yVar);
            const trendLine = calculateTrendLine(scatterData);
            const correlation = calculateCorrelation(Object.values(countryData), xVar, yVar);
            const pairKey = `${xVar}-${yVar}`;

            // Get variable names
            const xVarName = availableVariables.find(v => v.id === xVar)?.name || xVar;
            const yVarName = availableVariables.find(v => v.id === yVar)?.name || yVar;

            // Get color range for the scatter plot
            const colorValues = scatterData.map(d => d.colorValue);
            const minColor = Math.min(...colorValues);
            const maxColor = Math.max(...colorValues);

            return (
              <div
                key={pairKey}
                className={`border rounded-md p-2 h-[280px] ${hoveredPair === pairKey ? 'ring-2 ring-primary/50' : ''}`}
                onMouseEnter={() => setHoveredPair(pairKey)}
                onMouseLeave={() => setHoveredPair(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">{xVarName} vs {yVarName}</span>
                  <Badge variant={correlation < 0 ? "destructive" : "default"} className="text-xs">
                    Correlation: {correlation.toFixed(2)}
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <ScatterChart
                    margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={xVarName}
                      domain={['auto', 'auto']}
                      label={{ value: xVarName, position: 'bottom', offset: 10, fontSize: 10 }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={yVarName}
                      domain={['auto', 'auto']}
                      label={{ value: yVarName, angle: -90, position: 'insideLeft', offset: -10, fontSize: 10 }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      content={<CustomScatterTooltip />}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    {trendLine && (
                      <ReferenceLine
                        segment={trendLine}
                        stroke="#000"
                        strokeDasharray="3 3"
                        ifOverflow="extendDomain"
                      />
                    )}
                    <Scatter
                      name="Countries"
                      data={scatterData.filter(d => !d.isSelected)}
                      fill="#8884d8"
                      fillOpacity={0.6}
                      shape={(props: any) => {
                        const { cx, cy, fill, payload } = props;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={getColorScale(payload.colorValue, minColor, maxColor)}
                            fillOpacity={0.7}
                          />
                        );
                      }}
                      className="opacity-60 hover:opacity-80"
                      isAnimationActive={false}
                    />
                    {selectedCountries.length > 0 && (
                      <Scatter
                        name="Selected Countries"
                        data={scatterData.filter(d => d.isSelected)}
                        fill="#ff7300"
                        stroke="#ff7300"
                        strokeWidth={1}
                        shape="circle"
                        isAnimationActive={false}
                      />
                    )}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>

        {variablePairs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] gap-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <p className="text-muted-foreground">Select at least 2 variables to see correlation plots</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CorrelationGrid;
