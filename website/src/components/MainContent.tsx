import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChartBar, Filter, Map as MapIcon, Table as TableIcon } from "lucide-react";
import VisualizationPlaceholder from "./VisualizationPlaceholder";
import EuropeMap from "./map/EuropeMap";
import { europeanCountries } from "@/lib/data";
import { useCSVData, getEuropeanData, getCountryAverages } from "@/lib/dataLoader";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import CorrelationGrid from "./visualizations/CorrelationGrid";
import FeatureBarPlots from "./visualizations/FeatureBarPlots";
import PCAPlot from "./visualizations/PCAPlot";

const MainContent = () => {
  const [selectedVariable, setSelectedVariable] = useState("BELONG");
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["FIN", "NOR", "ISL", "GBR"]);
  const [activeTab, setActiveTab] = useState("map");
  const [showIntro, setShowIntro] = useState(false);
  const [showTable, setShowTable] = useState(true);

  // Load CSV data
  const { data: csvData, loading, error } = useCSVData();
  const europeanData = csvData.length > 0 ? getEuropeanData(csvData) : [];
  const countryAverages = europeanData.length > 0 ? getCountryAverages(europeanData) : {};

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(code => code !== countryCode);
      } else {
        return prev.length < 10 ? [...prev, countryCode] : prev;
      }
    });
  };

  const variableDescriptions = {
    BELONG: {
      title: "Sense of belonging at school (BELONG)",
      description: "This index measures students' sense of belonging and connectedness to their school environment. It is derived from students' responses to questions about feeling accepted, liked, and part of the school community.",
      interpretation: "Higher values indicate a stronger sense of belonging. The index is standardized with an OECD average of 0 and a standard deviation of 1. Positive values indicate an above-average sense of belonging, while negative values indicate below-average levels.",
      significance: "Research shows that students' sense of belonging is associated with higher academic motivation, better academic performance, and improved psychological well-being."
    },
    BULLIED: {
      title: "Exposure to bullying (BULLIED)",
      description: "This index measures students' experiences with different forms of bullying. It is based on responses to questions about being made fun of, being excluded, being threatened, or having possessions taken or destroyed.",
      interpretation: "Higher values indicate more frequent exposure to bullying. The index is standardized with an OECD average of 0. Positive values indicate above-average bullying exposure, while negative values indicate below-average exposure.",
      significance: "Bullying can negatively impact students' mental health, academic performance, and overall well-being. Lower values on this index are associated with better school climates."
    },
    PV1MATH: {
      title: "Mathematics Performance (PV1MATH)",
      description: "This is the first plausible value for students' performance in mathematics. It represents student achievement in mathematical literacy as assessed in the PISA test.",
      interpretation: "Scores are standardized across OECD countries with a mean of approximately 500 points and a standard deviation of 100. Higher scores indicate better mathematics performance.",
      significance: "Mathematics performance is an important indicator of students' ability to formulate, employ, and interpret mathematics in various contexts and to use mathematical reasoning to solve real-world problems."
    },
    PV1READ: {
      title: "Reading Performance (PV1READ)",
      description: "This is the first plausible value for students' performance in reading. It represents student achievement in reading literacy as assessed in the PISA test.",
      interpretation: "Scores are standardized across OECD countries with a mean of approximately 500 points and a standard deviation of 100. Higher scores indicate better reading performance.",
      significance: "Reading performance is an important indicator of students' ability to understand, use, reflect on and engage with written texts, in order to achieve one's goals, develop one's knowledge and potential, and participate in society."
    },
    PV10SCIE: {
      title: "Science Performance (PV10SCIE)",
      description: "This is the first plausible value for students' performance in science. It represents student achievement in scientific literacy as assessed in the PISA test.",
      interpretation: "Scores are standardized across OECD countries with a mean of approximately 500 points and a standard deviation of 100. Higher scores indicate better science performance.",
      significance: "Science performance is an important indicator of students' ability to engage with science-related issues, and with the ideas of science, as a reflective citizen."
    },
    OWB: {
      title: "Overall Well-being (OWB)",
      description: "This is a composite index derived from Principal Component Analysis of multiple well-being indicators including sense of belonging, bullying exposure, and other socio-emotional factors.",
      interpretation: "Higher values indicate better overall well-being. The index is standardized with a mean of 0 and a standard deviation of 1. Positive values indicate above-average well-being, while negative values indicate below-average well-being.",
      significance: "Overall well-being is associated with better academic performance, better mental health outcomes, and better social integration in school environments."
    }
  };

  const selectedCountriesDetails = selectedCountries.map(code => {
    const country = europeanCountries.find(c => c.code === code);
    return country ? country : { code, name: code };
  });

  // Get data for the current view
  const getCountryData = (countryCode: string, variable: string) => {
    if (countryAverages[countryCode]) {
      return countryAverages[countryCode][variable];
    }
    // Return null for missing data
    return null;
  };

  const toggleTable = () => {
    setShowTable(prev => !prev);
  };

  // Data table component for reuse
  const DataTable = () => {
    // Sort the countries by the selected variable in descending order
    const sortedCountries = [...selectedCountriesDetails].sort((a, b) => {
      const valueA = getCountryData(a.code, selectedVariable);
      const valueB = getCountryData(b.code, selectedVariable);

      // Handle null/undefined values
      if (valueA === null && valueB === null) return 0;
      if (valueA === null) return 1; // null values go to the bottom
      if (valueB === null) return -1;

      // Sort in descending order (highest first)
      return (valueB as number) - (valueA as number);
    });

    return (
      <ScrollArea className="h-full w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Country</TableHead>
              <TableHead>{selectedVariable}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">Loading data...</TableCell>
              </TableRow>
            ) : sortedCountries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">No countries selected</TableCell>
              </TableRow>
            ) : (
              sortedCountries.map(country => (
                <TableRow key={country.code} className="cursor-pointer hover:bg-muted/20" onClick={() => handleCountrySelect(country.code)}>
                  <TableCell className="font-medium">{country.name}</TableCell>
                  <TableCell>
                    {getCountryData(country.code, selectedVariable) !== null &&
                      typeof getCountryData(country.code, selectedVariable) === 'number'
                      ? (getCountryData(country.code, selectedVariable) as number).toFixed(2)
                      : "No data"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
      {showIntro && (
        <div className="container mx-auto mb-6">
          <Button
            variant="outline"
            onClick={() => setShowIntro(false)}
            className="flex items-center gap-2 mb-4"
          >
            <ChevronUp className="h-4 w-4" />
            Hide Introduction
          </Button>
        </div>
      )}

      <div className="container mx-auto">
        <div className="mb-6" id="data-explorer">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Denmark in a European context</h1>
          <p className="text-muted-foreground">
            Select countries & indicators on the map to explore patterns in educational outcomes across Europe.
          </p>
          {loading && <p className="text-muted-foreground mt-2">Loading data...</p>}
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>

        {/* Main visualization card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl">PISA 2022 Indicators</CardTitle>
              <CardDescription>Explore educational well-being across Europe</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Variable:</span>
                <Select
                  value={selectedVariable}
                  onValueChange={setSelectedVariable}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BELONG">Sense of Belonging</SelectItem>
                    <SelectItem value="BULLIED">Exposure to Bullying</SelectItem>
                    <SelectItem value="PV1MATH">Math Performance</SelectItem>
                    <SelectItem value="PV1READ">Reading Performance</SelectItem>
                    <SelectItem value="PV10SCIE">Science Performance</SelectItem>
                    <SelectItem value="OWB">Overall Well-being</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  Map View
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  Chart View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="map" className="pt-2">
                <div className="min-h-[500px] border rounded-md overflow-hidden">
                  <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
                    <ResizablePanel defaultSize={showTable ? 70 : 100}>
                      <div className="h-[500px]">
                        <EuropeMap
                          selectedVariable={selectedVariable}
                          selectedCountries={selectedCountries}
                          onCountrySelect={handleCountrySelect}
                          countryData={countryAverages}
                          loading={loading}
                        />
                      </div>
                    </ResizablePanel>

                    {showTable && (
                      <>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30}>
                          <div className="h-[500px] p-2">
                            <div className="font-medium mb-2">Selected Countries Data</div>
                            <DataTable />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
              </TabsContent>
              <TabsContent value="chart" className="pt-2">
                <ResizablePanelGroup direction="horizontal" className="min-h-[500px] border rounded-md overflow-hidden">
                  <ResizablePanel defaultSize={showTable ? 70 : 100}>
                    <div className="h-[500px]">
                      <VisualizationPlaceholder
                        variable={selectedVariable}
                        countries={selectedCountries}
                        countryData={countryAverages}
                        loading={loading}
                      />
                    </div>
                  </ResizablePanel>

                  {showTable && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel defaultSize={30}>
                        <div className="h-[500px] p-2">
                          <div className="font-medium mb-2">Selected Countries Data</div>
                          <DataTable />
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Feature Bar Plots Section */}
        <Card className="mb-6" id="feature-bar-plots">
          <CardHeader>
            <CardTitle className="text-lg">Feature Bar Plots</CardTitle>
            <CardDescription>
              Compare multiple features across selected countries, sorted by math performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <FeatureBarPlots
              countryData={countryAverages}
              selectedCountries={selectedCountries}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* PCA Plot Section - New Section */}
        <Card className="mb-6" id="pca-plot">
          <CardHeader>
            <CardTitle className="text-lg">Principal Component Analysis</CardTitle>
            <CardDescription>
              <span>
                Explore how countries cluster, and see if they grouped together as you would expect.
                <br />
                Interestingly, Denmark &amp; Ireland are very close, and all Nordic countries are distributed to the right except Finland.
                <br />
                <br />

                Countries you selected on the map are marked with Orange.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 md:p-4">
            <div className="h-[400px]">
              <PCAPlot
                countryData={countryAverages}
                selectedCountries={selectedCountries}
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Correlation Grid Section */}
        <Card className="mb-6" id="correlation-grid">
          {/* <CardHeader>
            <CardTitle className="text-lg">Correlation Analysis</CardTitle>
            <CardDescription>
              Explore relationships between multiple PISA variables across European countries
            </CardDescription>
          </CardHeader> */}
          <CardContent className="p-2 md:p-4">
            <CorrelationGrid
              countryData={countryAverages}
              selectedCountries={selectedCountries}
              loading={loading}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Selected Countries</CardTitle>
              <CardDescription>Click on map markers to select countries for comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedCountriesDetails.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No countries selected. Click on the map to select countries.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCountriesDetails.map(country => (
                      <div
                        key={country.code}
                        className="border rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                        onClick={() => handleCountrySelect(country.code)}
                      >
                        <span>{country.name}</span>
                        <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-sm">{country.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>About This Indicator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedVariable in variableDescriptions ? (
                  <>
                    <div>
                      <h3 className="font-semibold mb-1">{variableDescriptions[selectedVariable as keyof typeof variableDescriptions].title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {variableDescriptions[selectedVariable as keyof typeof variableDescriptions].description}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Interpretation</h3>
                      <p className="text-sm text-muted-foreground">
                        {variableDescriptions[selectedVariable as keyof typeof variableDescriptions].interpretation}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Significance</h3>
                      <p className="text-sm text-muted-foreground">
                        {variableDescriptions[selectedVariable as keyof typeof variableDescriptions].significance}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">Select a variable to see its description.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Research Insights</CardTitle>
            <CardDescription>Academic analysis of the PISA 2022 results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                Analysis of the 2022 PISA data reveals several important patterns across European educational systems.
                The relationship between well-being indicators and academic performance suggests that countries
                focusing on social-emotional factors tend to achieve better overall outcomes.
              </p>

              <p className="text-gray-700 mt-4">
                Further research is needed to understand the causal mechanisms behind these relationships,
                but the data provides valuable insights for policy makers seeking to improve educational systems.
              </p>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setShowIntro(true)}
                  variant="outline"
                  className={`${showIntro ? 'hidden' : 'flex'} items-center gap-2`}
                >
                  <ChevronUp className="h-4 w-4" />
                  Show Introduction
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;
