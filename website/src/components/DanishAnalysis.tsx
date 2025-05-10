import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DanishAnalysis = () => {
  // Get base URL for image paths
  const baseUrl = import.meta.env.BASE_URL || '';

  return <div>
    <Card className="mb-8" id="denmark-correlations">
      <CardHeader>
        <CardTitle>Key Correlations in Danish Student Data</CardTitle>
        <CardDescription>Scatter plots showing important relationships between variables</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="socioeconomic" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="socioeconomic">Socioeconomic Impact</TabsTrigger>
            <TabsTrigger value="wellbeing">Well-being Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="socioeconomic" className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">Socioeconomic Status vs. Math</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/ESCS_PV1MATH_scatter.png`}
                    alt="Scatter plot showing relationship between socioeconomic status and math scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Positive correlation between socioeconomic status and mathematics performance.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1">Socioeconomic Status vs. Reading</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/ESCS_PV1READ_scatter.png`}
                    alt="Scatter plot showing relationship between socioeconomic status and reading scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Reading performance shows positive correlation with socioeconomic status.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1">Socioeconomic Status vs. Science</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/ESCS_PV10SCIE_scatter.png`}
                    alt="Scatter plot showing relationship between socioeconomic status and science scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Science performance also correlates with socioeconomic status.
                </p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-md mt-2">
              <h4 className="font-semibold text-xs mb-1">Key Insight:</h4>
              <p className="text-xs">
                While there's a clear correlation between socioeconomic status and academic performance across all subjects,
                the substantial vertical spread at each ESCS level indicates that many students from lower socioeconomic backgrounds
                still achieve high scores. This suggests that effective educational practices can help overcome socioeconomic disadvantages.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="wellbeing" className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">Emotional Regulation vs. Math</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/EMOCOAGR_PV1MATH_scatter.png`}
                    alt="Scatter plot showing relationship between emotional regulation and math scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Students with stronger emotional regulation skills tend to perform better in mathematics.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1">Stress Resistance vs. Math</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/STRESAGR_PV1MATH_scatter.png`}
                    alt="Scatter plot showing relationship between stress resistance and math scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Higher stress resistance correlates with better mathematics performance.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-1">Stress Resistance vs. Reading</h3>
                <div className="aspect-square bg-slate-50 rounded-md overflow-hidden border">
                  <img
                    src={`${baseUrl}/danish-students-correlation-plots/STRESAGR_PV1READ_scatter.png`}
                    alt="Scatter plot showing relationship between stress resistance and reading scores"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  Vice versa, Reading performance decreases with with higher stress resistance.
                </p>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-md mt-2">
              <h4 className="font-semibold text-xs mb-1">Well-being Insight:</h4>
              <p className="text-xs">
                The correlation between social-emotional factors and academic performance is significant. Students who can
                manage stress and regulate their emotions effectively tend to perform better academically. This underscores
                the importance of integrating well-being support into educational practices, particularly for students in clusters
                4 and 0 who show lower social-emotional indicators.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-amber-50 p-3 rounded-md mt-4">
          <h3 className="font-semibold text-sm mb-1">Implications of Correlation Analysis</h3>
          <ul className="list-disc pl-4 text-xs space-y-1">
            <li>
              <strong>Targeted Support for Low-ESCS Students:</strong> While socioeconomic status correlates with performance,
              the wide spread indicates that targeted educational interventions can help students overcome socioeconomic disadvantages.
            </li>
            <li>
              <strong>Social-Emotional Learning Integration:</strong> The strong relationship between emotional regulation, stress resistance,
              and academic performance suggests that integrating social-emotional learning into the curriculum could yield academic benefits.
            </li>
            <li>
              <strong>Cluster-Specific Approaches:</strong> Correlations help explain the differences between clusters. For example,
              Cluster 4's lower mathematics performance despite average socioeconomic status may be linked to lower stress resistance.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>;
};
export default DanishAnalysis;
