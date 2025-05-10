import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Group the variables by category
const wellbeingVars = ['BELONG', 'BULLIED', 'FAMSUP', 'STRESAGR', 'EMOCOAGR', 'EMPATAGR'];
const backgroundVars = ['ESCS', 'HISEI', 'HISCED', 'HOMEPOS', 'PAREDINT'];
const performanceVars = ['PV1MATH', 'PV1READ', 'PV10SCIE']; // Changed from PV10SCIE to PV10SCIE for consistency

// Create labels for the variables
const variableLabels: Record<string, string> = {
  'BELONG': 'Sense of Belonging',
  'BULLIED': 'Exposure to Bullying',
  'FAMSUP': 'Family Support',
  'STRESAGR': 'School Stress',
  'EMOCOAGR': 'Emotional Control',
  'EMPATAGR': 'Empathy',
  'ESCS': 'Socioeconomic Status',
  'HISEI': 'Highest Occupational Status',
  'HISCED': 'Highest Education Level',
  'HOMEPOS': 'Home Possessions',
  'PAREDINT': 'Parental Interest',
  'PV1MATH': 'Math Performance',
  'PV1READ': 'Reading Performance',
  'PV10SCIE': 'Science Performance'  // Changed from PV10SCIE to PV10SCIE for consistency
};

type FeatureBarPlotsProps = {
  countryData: Record<string, PISADataRow>;
  selectedCountries: string[];
  loading: boolean;
};

const FeatureBarPlots: React.FC<FeatureBarPlotsProps> = ({
  countryData,
  selectedCountries,
  loading
}) => {
  // Define the default selected tab
  const [selectedTab, setSelectedTab] = React.useState("performance");

  // Function to generate chart data for a specific variable group
  const generateChartData = (variables: string[]) => {
    if (selectedCountries.length === 0 || !countryData || Object.keys(countryData).length === 0)
      return [];

    // Get countries that have math score data
    const countriesWithMathScore = selectedCountries.filter(code =>
      countryData[code] &&
      typeof countryData[code]['PV1MATH'] === 'number' &&
      !isNaN(countryData[code]['PV1MATH'] as number)
    );

    // Sort countries by math score (highest to lowest)
    const sortedCountries = [...countriesWithMathScore].sort((a, b) =>
      (countryData[b]['PV1MATH'] as number) - (countryData[a]['PV1MATH'] as number)
    );

    // Create an array of data entries, one per country
    return sortedCountries.map(code => {
      const countryObj: Record<string, any> = {
        name: countryData[code].CountryName || code,
        code
      };

      // Add variable values for this country
      variables.forEach(variable => {
        if (countryData[code] &&
          typeof countryData[code][variable] === 'number' &&
          !isNaN(countryData[code][variable] as number)) {
          countryObj[variable] = countryData[code][variable];
          countryObj[`${variable}Label`] = variableLabels[variable] || variable;
        } else {
          countryObj[variable] = null;
          console.log(`No data for ${variable} in country ${code}`);
        }
      });

      return countryObj;
    });
  };

  // Generate chart data for each variable group
  const performanceData = generateChartData(performanceVars);
  const wellbeingData = generateChartData(wellbeingVars);
  const backgroundData = generateChartData(backgroundVars);

  // Get bars in appropriate colors
  const getBars = (variables: string[]) => {
    const colors = [
      "#8b5cf6", // Purple
      "#10b981", // Green
      "#ef4444", // Red
      "#f59e0b", // Amber
      "#3b82f6", // Blue
      "#ec4899", // Pink
      "#6366f1", // Indigo
      "#14b8a6", // Teal
      "#f43f5e", // Rose
      "#84cc16"  // Lime
    ];

    return variables.map((variable, index) => (
      <Bar
        key={variable}
        dataKey={variable}
        name={variableLabels[variable] || variable}
        fill={colors[index % colors.length]}
        isAnimationActive={false}
      />
    ));
  };

  // Get Y-axis domain for each chart type - updated for normalized values (0-1)
  const getYAxisDomain = (chartType: string) => {
    switch (chartType) {
      case "performance":
        // For normalized performance variables (0-1)
        return [0, 1];
      case "wellbeing":
        // For normalized well-being indices (0-1)
        return [0, 1];
      case "background":
        // For normalized background indices (0-1)
        return [0, 1];
      default:
        return [0, 1];
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex items-center justify-center h-[500px]">
          <div className="text-muted-foreground">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  // Handle no countries selected
  if (selectedCountries.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No countries selected</div>
            <div className="text-sm text-muted-foreground">
              Please select at least one country to visualize data
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug data availability
  console.log("Performance data:", performanceData);
  console.log("Performance vars available:", performanceVars.map(v =>
    performanceData.length > 0 && performanceData[0][v] !== null ? v : `${v} (missing)`
  ));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Feature Comparison</CardTitle>
        <CardDescription>
          Countries sorted by math performance (PV1MATH)
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue={selectedTab} value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
              <TabsTrigger value="wellbeing" className="flex-1">Well-being</TabsTrigger>
              <TabsTrigger value="background" className="flex-1">Background</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="performance" className="mt-0">
            <div className="h-[500px] w-full pt-4">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                      domain={getYAxisDomain("performance")}
                      tickCount={6}
                      label={{
                        value: 'Normalized Performance (0-1)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 12 }
                      }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12, bottom: 0 }} />
                    <ReferenceLine y={0.5} stroke="#000" strokeDasharray="3 3" />
                    {getBars(performanceVars)}
                  </RechartBar>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-muted-foreground">No performance data available for selected countries</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="wellbeing" className="mt-0">
            <div className="h-[500px] w-full pt-4">
              {wellbeingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar
                    data={wellbeingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                      domain={getYAxisDomain("wellbeing")}
                      tickCount={6}
                      label={{
                        value: 'Normalized Well-being (0-1)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 12 }
                      }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12, bottom: 0 }} />
                    <ReferenceLine y={0.5} stroke="#000" strokeDasharray="3 3" />
                    {getBars(wellbeingVars)}
                  </RechartBar>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-muted-foreground">No well-being data available for selected countries</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="background" className="mt-0">
            <div className="h-[500px] w-full pt-4">
              {backgroundData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar
                    data={backgroundData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
                      domain={getYAxisDomain("background")}
                      tickCount={6}
                      label={{
                        value: 'Normalized Background (0-1)',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 12 }
                      }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12, bottom: 0 }} />
                    <ReferenceLine y={0.5} stroke="#000" strokeDasharray="3 3" />
                    {getBars(backgroundVars)}
                  </RechartBar>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-muted-foreground">No background data available for selected countries</div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeatureBarPlots;
