
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Map as MapIcon } from "lucide-react";

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

const MapControls = ({ onZoomIn, onZoomOut, onReset }: MapControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      <Button size="icon" variant="outline" className="bg-background/80" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="bg-background/80" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline" className="bg-background/80" onClick={onReset}>
        <MapIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapControls;
