
import React from 'react';

type MapTooltipProps = {
  position: { x: number, y: number } | null;
  countryInfo: { name: string, value: number | null } | null;
  selectedVariable: string;
};

const MapTooltip = ({ position, countryInfo, selectedVariable }: MapTooltipProps) => {
  if (!position || !countryInfo) {
    return null;
  }

  return (
    <div 
      className="absolute bg-white px-2 py-1 text-xs shadow-md rounded-md pointer-events-none border z-50"
      style={{
        left: position.x + 'px',
        top: position.y + 'px',
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="font-medium">{countryInfo.name}</div>
      <div>
        {countryInfo.value !== null 
          ? `${selectedVariable}: ${typeof countryInfo.value === 'number' ? countryInfo.value.toFixed(2) : countryInfo.value}`
          : `No data for ${selectedVariable}`
        }
      </div>
    </div>
  );
};

export default MapTooltip;
