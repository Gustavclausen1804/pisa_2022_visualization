
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Introduction = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`transition-all duration-300 ${expanded ? "" : "max-h-0 overflow-hidden opacity-0"}`}>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800" id="start-introduction">Denmark in PISA 2022: Student Well-being and Performance in a European Context</h1>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 mb-4">
              The PISA (Programme for International Student Assessment) survey provides valuable insights into
              educational systems worldwide. In this survey, we will first explore Danish students' well-being,
              academic performance, and how male and female students differ in their experiences.
              Later we will allow you to interactively explore the PISA dataset by comparing Denmark's results with other European countries.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Key Findings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-l-4 border-l-pisa-blue">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Gap between female and male students</h3>
                  <p className="text-sm text-gray-600">
                    Our clustering analysis reveals a significant gap between male and female students in Denmark.
                    we seperate students into 5 groups based on their well-being and academic performance.

                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-pisa-purple">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Bullying Exposure</h3>
                  <p className="text-sm text-gray-600">
                    Denmark has the highest percentage of students reporting bullying exposure in the Nordics.

                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Mathematics Performance</h3>
                  <p className="text-sm text-gray-600">
                    Students with higher stress levels perform better in mathematics, while performing worse in reading.

                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Socioeconomic Impact</h3>
                  <p className="text-sm text-gray-600">
                    Students from a higher socioeconomic background tend to have better academic performance. Underlying the gap discussed in Denmark between urban, suburban and rural students.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Methodology</h2>
            <p className="text-gray-700 mb-4">
              PISA 2022 assessed students aged 15-16 across various dimensions including academic performance
              and well-being indicators. The standardized assessment allows for cross-country comparisons and
              highlights both strengths and areas for improvement in educational systems. We have used PISA's scores across categories, and normalized all values.
            </p>

            {/* <p className="text-gray-700 mb-4">
              In this interactive visualization, we focus on key well-being indicators and their relationship
              to academic outcomes. The map below allows you to explore these patterns across European countries.
            </p> */}
          </div>

          {/* <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => setExpanded(false)}
              className="flex items-center gap-2"
            >
              Explore the Data
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
