
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { BarChart, ChevronRight, Globe, Search } from "lucide-react";

const NavigationSidebar = () => {
  const { state } = useSidebar();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className={`${state === "collapsed" ? "hidden" : "block"}`}>
          <h2 className="font-semibold text-sm">PISA Explorer</h2>
          <p className="text-xs text-muted-foreground">Navigation</p>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Introduction</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('start-introduction')} tooltip="Introduction">
                  <ChevronRight className="h-4 w-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Denmark Analysis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('denmark-overview')} tooltip="Denmark Overview">
                  <Globe className="h-4 w-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('denmark-clusters')} tooltip="Student Profiles">
                  <ChevronRight className="h-4 w-4" />
                  <span>Student Clusters</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('denmark-wellbeing')} tooltip="Student Well-being">
                  <ChevronRight className="h-4 w-4" />
                  <span>Student Well-being</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('denmark-correlations')} tooltip="Data Correlations">
                  <ChevronRight className="h-4 w-4" />
                  <span>Key Correlations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('denmark-comparison')} tooltip="Nordic Comparison">
                  <ChevronRight className="h-4 w-4" />
                  <span>Nordic Comparison</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Interactive Exploration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('data-explorer')} tooltip="Data Explorer">
                  <Search className="h-4 w-4" />
                  <span>Data Explorer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('feature-bar-plots')} tooltip="Feature Bar Plots">
                  <BarChart className="h-4 w-4" />
                  <span>Feature Bar Plots</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('pca-plot')} tooltip="PCA Plot">
                  <ChevronRight className="h-4 w-4" />
                  <span>PCA Plot</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => scrollToSection('correlation-grid')} tooltip="Correlation Grid">
                  <ChevronRight className="h-4 w-4" />
                  <span>Correlation Grid</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`${state === "collapsed" ? "hidden" : "block"} p-4 text-xs text-muted-foreground`}>
        <p>PISA 2022 Data Analysis</p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default NavigationSidebar;
