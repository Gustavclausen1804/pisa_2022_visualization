
import { useEffect } from "react";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import MainContent from "@/components/MainContent";
import DanishAnalysis from "@/components/DanishAnalysis";
import { SidebarProvider } from "@/components/ui/sidebar";
import NavigationSidebar from "@/components/NavigationSidebar";
import DenmarkStory from "@/components/DenmarkStory";

const Index = () => {
  // Set the title when the component mounts
  useEffect(() => {
    document.title = "European PISA Explorer | 2022 Data Analysis";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <NavigationSidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <Header />
          <div className="flex flex-col flex-1 overflow-auto">
            <Introduction />
            <DenmarkStory />
            <MainContent />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
