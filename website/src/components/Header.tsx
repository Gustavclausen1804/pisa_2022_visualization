
import { Search, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-pisa-blue" />
          <div className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-pisa-blue to-pisa-purple bg-clip-text text-transparent">
            Denmark & Europe PISA results
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-white bg-pisa-purple px-2 py-0.5 rounded-md">
              2022
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline-block">By Morten Helsø (s214927) & Gustav Clausen (s214940), DTU</span>

          </div>
        </div>

        <div className="hidden md:flex md:w-1/3 relative">

        </div>


      </div>
    </header>
  );
};

export default Header;
