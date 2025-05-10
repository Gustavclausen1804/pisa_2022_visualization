
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type LegendItem = {
  color: string;
  label: string;
};

type MapLegendProps = {
  title: string;
  items: LegendItem[];
  hoveredCountry?: {
    name: string;
    value: number | null;
  } | null;
};

const MapLegend = ({ title, items, hoveredCountry }: MapLegendProps) => {
  return (
    <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-md text-xs shadow-md">
      <div className="font-medium text-sm mb-2">{title} Legend</div>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
          <span>{item.label}</span>
        </div>
      ))}
      
      {/* Tooltip for hovered country */}
      {hoveredCountry && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="font-medium">{hoveredCountry.name}</div>
          <div className="text-xs">
            {hoveredCountry.value !== null 
              ? `${title}: ${typeof hoveredCountry.value === 'number' ? hoveredCountry.value.toFixed(2) : hoveredCountry.value}`
              : `No data for ${title}`
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLegend;
