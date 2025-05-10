
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, BarChart, PieChart, ScatterChart } from "lucide-react";
import { themes, variables } from "@/lib/data";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`border-r bg-white transition-all duration-300 flex flex-col h-full ${collapsed ? "w-16" : "w-72"
        }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        {!collapsed && <h2 className="font-semibold">Explore Data</h2>}
        <Button
          variant="ghost"
          size="sm"
          className={`p-1.5 h-8 w-8 ${collapsed ? "mx-auto" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {!collapsed ? (
        <div className="p-4 flex-1 overflow-y-auto">
          <Tabs defaultValue="variables">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
            </TabsList>

            <TabsContent value="variables" className="space-y-4">
              {variables.map((variable) => (
                <Card key={variable.id} className="cursor-pointer hover:border-primary/50">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{variable.name}</CardTitle>
                      <div className="p-1 rounded-md bg-muted">
                        {variable.type === "bar" ? (
                          <BarChart className="h-3 w-3" />
                        ) : variable.type === "scatter" ? (
                          <ScatterChart className="h-3 w-3" />
                        ) : (
                          <PieChart className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-4 text-xs text-muted-foreground">
                    {variable.description}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="themes" className="space-y-4">
              {themes.map((theme) => (
                <Card key={theme.id} className="cursor-pointer hover:border-primary/50">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-medium">{theme.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4 text-xs text-muted-foreground">
                    {theme.variableCount} variables
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Visualizations</h3>
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start"
                onClick={() => scrollToSection('feature-bar-plots')}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Feature Bar Plots
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                className="justify-start"
                onClick={() => scrollToSection('pca-plot')}
              >
                <ScatterChart className="mr-2 h-4 w-4" />
                PCA Plot
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="justify-start"
                onClick={() => scrollToSection('correlation-grid')}
              >
                <PieChart className="mr-2 h-4 w-4" />
                Correlation Grid
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-4 gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => scrollToSection('feature-bar-plots')}
          >
            <BarChart size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => scrollToSection('pca-plot')}
          >
            <ScatterChart size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => scrollToSection('correlation-grid')}
          >
            <PieChart size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
