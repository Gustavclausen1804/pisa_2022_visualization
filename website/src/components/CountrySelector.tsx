
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type CountrySelectorProps = {
  countries: { code: string; name: string }[];
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
};

const CountrySelector = ({ 
  countries, 
  selectedCountries, 
  setSelectedCountries 
}: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
    } else {
      if (selectedCountries.length < 10) {
        setSelectedCountries([...selectedCountries, countryCode]);
      }
    }
  };

  const removeCountry = (countryCode: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Select countries
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-64">
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name}-${country.code}`}
                    onSelect={() => toggleCountry(country.code)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedCountries.includes(country.code) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex items-center">
                      <span className="mr-2">{country.name}</span>
                      <span className="text-xs text-muted-foreground">({country.code})</span>
                    </div>
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCountries.length === 0 && (
          <div className="text-sm text-muted-foreground">No countries selected</div>
        )}
        {selectedCountries.map((countryCode) => {
          const country = countries.find((c) => c.code === countryCode);
          if (!country) return null;
          
          return (
            <Badge key={countryCode} variant="secondary" className="pl-2 pr-1 py-1 text-xs">
              {country.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeCountry(countryCode)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CountrySelector;
