
import { MapIcon } from "lucide-react";

const MapLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/20 rounded-lg border border-dashed p-8">
      <MapIcon className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
      <h3 className="text-lg font-medium mb-2">Loading data...</h3>
    </div>
  );
};

export default MapLoading;
