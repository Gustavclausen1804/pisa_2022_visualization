import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCSVData, getEuropeanData, getCountryAverages } from "@/lib/dataLoader";
import {
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import DanishAnalysis from "./DanishAnalysis";

const DenmarkStory = () => {
  const { data: csvData, loading } = useCSVData();
  const europeanData = csvData.length > 0 ? getEuropeanData(csvData) : [];
  const countryAverages = europeanData.length > 0 ? getCountryAverages(europeanData) : {};

  // Get Nordic countries for comparison
  const nordicCountries = ["DNK", "FIN", "ISL", "NOR", "SWE"];
  const baseUrl = import.meta.env.BASE_URL || '';
  // Filter data for Nordic countries
  const nordicData = nordicCountries.map(code => {
    const countryName = code === "DNK" ? "Denmark" :
      code === "FIN" ? "Finland" :
        code === "ISL" ? "Iceland" :
          code === "NOR" ? "Norway" : "Sweden";

    return {
      name: countryName,
      code,
      ...countryAverages[code]
    };
  });

  // Performance comparison data
  const performanceData = nordicData.filter(country => country && country.PV1MATH);

  // Well-being comparison data
  const wellbeingData = nordicData
    .filter(country => country && country.BELONG && country.BULLIED)
    .map(country => ({
      name: country.name,
      "Sense of Belonging": country.BELONG,
      "Bullying Exposure (reversed)": country.BULLIED ? country.BULLIED : 0,
      "Socioeconomic Status": country.ESCS || 0
    }));

  // Denmark's radar data for different metrics
  const denmarkRadarData = [
    { subject: 'Math', A: countryAverages.DNK?.PV1MATH || 0, fullMark: 600 },
    { subject: 'Reading', A: countryAverages.DNK?.PV1READ || 0, fullMark: 600 },
    { subject: 'Science', A: countryAverages.DNK?.PV10SCIE || 0, fullMark: 600 },
    { subject: 'Well-being', A: countryAverages.DNK?.BELONG ? (countryAverages.DNK.BELONG as number + 2) * 100 : 200, fullMark: 400 },
    { subject: 'Low Bullying', A: countryAverages.DNK?.BULLIED ? (2 - (countryAverages.DNK.BULLIED as number)) * 100 : 200, fullMark: 400 },
    { subject: 'Socioeconomic', A: countryAverages.DNK?.ESCS ? (countryAverages.DNK.ESCS as number + 2) * 100 : 200, fullMark: 400 },
  ];

  return (
    <div className="container mx-auto px-4 py-8" id="denmark-overview">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Denmark's PISA Story</h2>
        <p className="text-lg text-gray-700 mb-6">
          {/* Denmark has participated in PISA since its inception in 2000. The 2022 results provide valuable insights into
          the Danish educational system, student well-being, and academic performance compared to other Nordic and European countries. */}
        </p>
      </div>

      {/* t-SNE Visualization - First section */}
      <Card className="mb-8" id="denmark-clusters">
        <CardHeader>
          <CardTitle>Student Clusters</CardTitle>
          <CardDescription>
            Analysis of distinct student profiles based on performance and well-being indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <img
              src={`${baseUrl}/t-sne-danish-students.png`}
              alt="t-SNE Visualization of Danish Students"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>

          <p className="mb-6 text-sm text-gray-700">
            Using clustering analysis, we've identified five distinct student profiles within the Danish PISA data. These
            clusters help identify different needs and strengths in the student population.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-emerald-100">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm">Average-ESCS Boys with Low Family Support (100% boys)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Students in this cluster exhibit slightly above-average socio-economic backgrounds (ESCS = +0.29) but report notably low family support (FAMSUP = -0.27).
                  Despite their adequate socio-economic status, this lack of family backing correlates with below-average academic performance, particularly in mathematics
                  (PV1MATH = 456.51) and reading (PV1READ = 439.03).
                  This cluster is composed exclusively of boys, highlighting a group potentially at risk due to insufficient emotional or practical support at home.               </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-100">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm"> High-ESCS Girls, Strong Socio-emotional Skills (100% girls)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Cluster 1 represents high socio-economic status students (ESCS = +0.93) composed entirely of girls.
                  These students report good family support (FAMSUP = +0.16) and exceptional empathetic agreement (EMPATAGR = +0.42).
                  Academically, these girls excel particularly in reading (PV1READ = 555.50),
                  indicating that strong socio-emotional skills and family backing contribute significantly to literacy and academic success.        </p>
              </CardContent>
            </Card>

            <Card className="bg-indigo-100">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm">Affluent Boys, High Belonging and Resilience (99% boys)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  This small but distinct group is characterized by the highest socio-economic advantage (ESCS = +0.99). Nearly all are boys (99%),
                  with exceptional feelings of belonging (BELONG = +0.51), high emotional agreement (EMOCOAGR = +0.56), and strong stress resilience (STRESAGR = +0.72).
                  They achieve the highest academic performance, particularly notable in mathematics (PV1MATH = 546.00) and science (PV10SCIE = 553.69).
                  Their socio-economic advantage and socio-emotional strength clearly correlate with their outstanding academic outcomes.              </p>
              </CardContent>
            </Card>

            <Card className="bg-pink-100">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm">Low-ESCS, Mixed-Gender Students with Middling Well-being (54% girls)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  The largest cluster represents students from significantly lower socio-economic backgrounds (ESCS = -0.68), evenly mixed between boys (54%) and girls (46%).
                  These students report average wellbeing but significantly lower parental educational background (HISCED = 4.32) and occupational status (HISEI = 45.61).
                  Their academic performance is consistently below average across mathematics, reading, and science, pointing towards socio-economic challenges impacting their educational outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-lime-100">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm">Socially Strained Group, High Incidence of Bullying (98% girls)</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Cluster 4, predominantly girls, reveals concerning social dynamics. Despite moderate socio-economic status (ESCS = +0.20),
                  students report the highest bullying rates (BULLIED = +0.15), negative belonging (BELONG = -0.23),
                  and poor stress resilience (STRESAGR = -0.32). Consequently, their academic scores, especially in mathematics (PV1MATH = 435.72),
                  lag significantly behind other groups with similar ESCS levels, indicating that bullying and low social support severely undermine academic performance.                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <p className="text-m text-gray-700">
              The student clustering reveals that while Denmark performs well overall, there are a big gap between boys and girls.
              The gender differences in academic performance patterns at similar socioeconomic levels suggest the need for gender-sensitive teaching approaches.
              Additionally, the contrast between clusters highlights how social-emotional factors can significantly impact academic outcomes independent of socio-economic status.
              Educational policies should be differentiated to address the specific needs of each student profile,
              with particular attention to bolstering support systems for vulnerable groups (Clusters 3 and 4) while providing appropriate challenges
              for high-achieving students (Clusters 1 and 2).

              <br />
              <br />


              <b> Our clusters' relation to related research</b>


              <br />
              <br />
              Research suggests a gender disparity in student well-being. Surveys in Denmark have found significant well-being differences between girls and boys
              For example, Danish studies note that adolescent girls report higher levels of stress and lower life satisfaction compared to boys – echoing a wider “gender well-being gap” observed in many countries [1]


              <br />
              <br />
              Denmark's PISA 2022 results reflect familiar gender patterns seen across Europe. Danish boys scored higher in mathematics (by ~12 points) while girls scored higher in reading (by ~21 points)
              oecd.org
              . These gaps align with the international trend: in almost all countries girls outperform boys in reading, and boys often hold a modest lead in math
              oecd.org
              hm.ee
              . Notably, Denmark's gender gap in math is similar to many OECD countries (boys were ahead in roughly half of participating countries)
              oecd.org
              . In science, no large gender difference was reported for Denmark, consistent with the general European pattern of minimal gender gaps in science performance.

              <br />
              <br />


              Denmark's education system is comparatively equitable in socioeconomic terms when measured against other OECD and European countries.
              PISA 2022 showed that the score gap between the most advantaged and most disadvantaged Danish students (top 25% vs bottom 25% by socioeconomic status) was about 74 points in math,
              significantly smaller than the OECD average gap of 93 points oecd.org. In other words, family background has a somewhat weaker influence on performance in Denmark than in many countries. [2]

              <br />
              <br />


              [1] https://link.springer.com/article/10.1007/s11205-024-03334-7
              <br />
              [2] https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/denmark_8b15948c-en.html#:~:text=,across%20OECD%20countries
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8" id="denmark-wellbeing">
        <CardHeader>
          <CardTitle>Student Well-being in Denmark</CardTitle>
          <CardDescription>
            Analysis of social-emotional factors affecting Danish students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Sense of Belonging</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{countryAverages.DNK?.BELONG?.toFixed(2) || "N/A"}</span>
                  <span className="ml-2 text-sm text-muted-foreground">index score</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Danish students report a moderate to high sense of belonging at school. Despite high bullying rates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Bullying Exposure</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{countryAverages.DNK?.BULLIED?.toFixed(2) || "N/A"}</span>
                  <span className="ml-2 text-sm text-muted-foreground">index score</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Denmark shows relatively high bullying rates compared to nordic averages, and is the highest in the Nordics.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Socioeconomic Status Impact</h3>
            <p className="text-sm text-gray-700 mb-4">
              Denmark's education system demonstrates relatively good equity, with socioeconomic status (ESCS index: {countryAverages.DNK?.ESCS?.toFixed(2) || "N/A"})
              having less impact on academic outcomes compared to many other countries. Later we will explore the impact of socioeconomic status on academic performance.
            </p>
          </div>
        </CardContent>
      </Card>

      <DanishAnalysis />

      <Card className="mb-8" id="denmark-comparison">
        <CardHeader>
          <CardTitle>Nordic Comparison</CardTitle>
          <CardDescription>
            How Denmark compares to other Nordic countries in key PISA metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="academic">
            <TabsList className="mb-4">
              <TabsTrigger value="academic">Academic Performance</TabsTrigger>
              <TabsTrigger value="wellbeing">Well-being Factors</TabsTrigger>
            </TabsList>

            <TabsContent value="academic">
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      data={performanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Legend />
                      <Bar name="Mathematics" dataKey="PV1MATH" fill="#8884d8" />
                      <Bar name="Reading" dataKey="PV1READ" fill="#82ca9d" />
                      <Bar name="Science" dataKey="PV10SCIE" fill="#ffc658" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Denmark performs relatively well compared to other Nordic countries, particularly in mathematics</li>
                  <li>There is not a single country which leads on all academic metrics</li>
                  <li>Swedens leads in reading and math, while Finland leads in science</li>
                  <li>Iceland has lowest academic performance but overall best well being scores</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="wellbeing">
              <div className="h-[400px]">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <p>Loading data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartBarChart
                      data={wellbeingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Sense of Belonging" dataKey="Sense of Belonging" fill="#8884d8" />
                      <Bar name="Low Bullying (lower is better)" dataKey="Bullying Exposure (reversed)" fill="#82ca9d" />
                      <Bar name="Socioeconomic Status" dataKey="Socioeconomic Status" fill="#ffc658" />
                    </RechartBarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Well-being Insights</h4>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>Denmark shows strong results in student well-being relative to its Nordic neighbors</li>
                  <li>Danish students report good sense of belonging, slightly higher than the Nordic average</li>
                  <li>Bullying levels are relatively low in all Nordic countries, with Denmark performing well in this area</li>
                  <li>The Nordic countries generally share similar socioeconomic profiles, allowing for meaningful comparisons</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="border-t pt-6 mt-8 mb-8">
        <h3 className="text-xl font-bold mb-4">Key Takeaways about Denmark's PISA Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Strengths</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li><strong>Strong Overall Academic Performance</strong><br />Denmark performs well in mathematics compared to other Nordic countries, with high-performing student clusters (e.g., affluent, resilient boys) scoring above international averages.</li>
              <li><strong>High Socioeconomic Equity</strong><br />The correlation between socioeconomic status and academic performance exists, but is weaker than in many other countries—indicating a relatively equitable education system.</li>
              <li><strong>Well-being and Belonging</strong><br />Students report a moderately high sense of belonging at school, even though bullying rates are concerning.</li>
              <li><strong>High-Achieving Subgroups</strong><br />Certain student clusters, such as High-ESCS Girls and Affluent Boys, demonstrate that a mix of strong socio-emotional skills and family support correlates with excellent academic outcomes.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Areas for Improvement</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li><strong>Gender Gaps in Well-being and Performance</strong><br />There are clear disparities between boys and girls. Girls tend to outperform boys in reading and have stronger socio-emotional skills, while some all-boy clusters show low support and underperformance.</li>
              <li><strong>Bullying Incidence</strong><br />Denmark reports the highest bullying exposure in the Nordics, negatively affecting student well-being and academic outcomes—particularly among girls in socially strained groups.</li>
              <li><strong>Low Family Support in Some Clusters</strong><br />Some students, especially boys from average socioeconomic backgrounds, report low family support, correlating with underperformance and emotional strain.</li>
              <li><strong>Stress and Academic Trade-offs</strong><br />Students with higher stress levels perform better in mathematics but worse in reading, highlighting the complex relationship between stress and learning outcomes.</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="data-explorer" className="border-t border-gray-200 pt-8">
        {/* <h2 className="text-3xl font-bold mb-2">Interactive Data Exploration</h2> */}
        {/* <p className="text-muted-foreground mb-8">
          Continue below to explore the full dataset, including how Denmark compares to all European countries.
        </p> */}
      </div>
    </div>
  );
};

export default DenmarkStory;
