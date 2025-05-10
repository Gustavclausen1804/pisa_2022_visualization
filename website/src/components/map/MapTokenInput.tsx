
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import { useState } from "react";

type MapTokenInputProps = {
  onTokenSubmit: (token: string) => void;
  initialToken: string;
};

const MapTokenInput = ({ onTokenSubmit, initialToken }: MapTokenInputProps) => {
  const [mapboxToken, setMapboxToken] = useState<string>(initialToken);
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/20 rounded-lg border border-dashed p-8">
      <MapIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Mapbox Token Required</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        To display the interactive map, please enter your Mapbox public token.
        You can get one for free at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>.
      </p>
      <div className="w-full max-w-md">
        <input 
          type="text"
          placeholder="Enter your Mapbox token"
          className="w-full rounded-md border border-input px-3 py-2 mb-2"
          onChange={(e) => setMapboxToken(e.target.value)}
          value={mapboxToken}
        />
        <Button 
          onClick={() => onTokenSubmit(mapboxToken)}
          disabled={!mapboxToken || mapboxToken === "YOUR_MAPBOX_ACCESS_TOKEN"}
          className="w-full"
        >
          Apply Token
        </Button>
      </div>
    </div>
  );
};

export default MapTokenInput;
