import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Slider } from './ui/slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronLeft, faX } from '@fortawesome/free-solid-svg-icons';

// Import shared constants
import { ROOM_AMENITIES, ROOM_TYPES, DURATION_OPTIONS, CAPACITY_OPTIONS, DEFAULT_TIMEZONE } from '../constants';

interface FiltersSidebarProps {
  onClose: () => void;
  onBack: () => void;
  showBackButton: boolean;
  showCloseButton: boolean;
  activeFilters?: {
    duration: string;
    amenities: string[];
    capacity: string;
    types: string[];
    show: string;
    onlyShowAvailable: boolean;
  };
  onFiltersChange?: (filters: {
    duration: string;
    amenities: string[];
    capacity: string;
    types: string[];
    show: string;
    onlyShowAvailable: boolean;
  }) => void;
  spotlightMyEvents?: boolean;
  onSpotlightMyEventsChange?: (enabled: boolean) => void;
  compactView?: boolean;
  onCompactViewChange?: (enabled: boolean) => void;
  selectedTimezones?: string[];
  onSelectedTimezonesChange?: (timezones: string[]) => void;
}

export function FiltersSidebar({
  onClose,
  onBack,
  showBackButton,
  showCloseButton,
  activeFilters,
  onFiltersChange,
  spotlightMyEvents = false,
  onSpotlightMyEventsChange,
  compactView = false,
  onCompactViewChange,
  selectedTimezones = [DEFAULT_TIMEZONE],
  onSelectedTimezonesChange
}: FiltersSidebarProps) {
  // Use activeFilters from props, with fallbacks
  const selectedDuration = activeFilters?.duration || 'any';
  const selectedAmenities = activeFilters?.amenities || [];
  const selectedCapacity = activeFilters?.capacity || 'any';
  const selectedTypes = activeFilters?.types || [];
  const selectedShow = activeFilters?.show || 'all';
  const onlyShowAvailable = activeFilters?.onlyShowAvailable || false;

  // Popover states for multiselects
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const [timezonesOpen, setTimezonesOpen] = useState(false);

  // Use shared constants for available options
  const availableAmenities = [...ROOM_AMENITIES];
  const availableTypes = [...ROOM_TYPES];

  const availableTimezones = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' }
  ];

  const durationOptions = [
    { value: 'any', label: 'Any duration' },
    { value: '15', label: 'Up to 15 minutes' },
    { value: '30', label: 'Up to 30 minutes' },
    { value: '60', label: 'Up to 1 hour' },
    { value: '90', label: 'Up to 1.5 hours' },
    { value: '120', label: 'Up to 2 hours' },
    { value: '180', label: 'Up to 3 hours' },
    { value: '240', label: 'Up to 4 hours' },
    { value: '300', label: 'Up to 5 hours' },
    { value: '360', label: 'Up to 6 hours' },
    { value: '480', label: 'Up to 8 hours' }
  ];

  const handleDurationChange = (duration: string) => {
    if (onFiltersChange && activeFilters) {
      onFiltersChange({
        ...activeFilters,
        duration
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    if (onFiltersChange && activeFilters) {
      const newAmenities = selectedAmenities.includes(amenity) 
        ? selectedAmenities.filter(a => a !== amenity)
        : [...selectedAmenities, amenity];
      
      onFiltersChange({
        ...activeFilters,
        amenities: newAmenities
      });
    }
  };

  const handleCapacityChange = (capacity: string) => {
    if (onFiltersChange && activeFilters) {
      onFiltersChange({
        ...activeFilters,
        capacity
      });
    }
  };

  // Parse capacity range from string
  const parseCapacityRange = (capacity: string): [number, number] => {
    if (capacity === 'any') return [1, 15];
    if (capacity.includes('+')) {
      const min = parseInt(capacity.replace('+', ''));
      return [min, 15];
    }
    if (capacity.includes('-')) {
      const [min, max] = capacity.split('-').map(n => parseInt(n));
      return [min, max];
    }
    const num = parseInt(capacity);
    return [num, num];
  };

  // Format capacity range to string
  const formatCapacityRange = (min: number, max: number): string => {
    if (min === 1 && max === 15) return 'any';
    if (max === 15 && min > 1) return `${min}+`;
    if (min === max) return `${min}`;
    return `${min}-${max}`;
  };

  const [minCapacity, maxCapacity] = parseCapacityRange(selectedCapacity);

  const handleCapacityRangeChange = (values: number[]) => {
    const [min, max] = values;
    const capacityString = formatCapacityRange(min, max);
    handleCapacityChange(capacityString);
  };

  const handleTypeToggle = (type: string) => {
    if (onFiltersChange && activeFilters) {
      const newTypes = selectedTypes.includes(type) 
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type];
      
      onFiltersChange({
        ...activeFilters,
        types: newTypes
      });
    }
  };

  const handleShowChange = (show: string) => {
    if (onFiltersChange && activeFilters) {
      onFiltersChange({
        ...activeFilters,
        show
      });
    }
  };

  const handleOnlyShowAvailableChange = (enabled: boolean) => {
    if (onFiltersChange && activeFilters) {
      onFiltersChange({
        ...activeFilters,
        onlyShowAvailable: enabled
      });
    }
  };

  const handleTimezoneToggle = (timezone: string) => {
    if (onSelectedTimezonesChange) {
      // Always keep at least one timezone selected
      if (selectedTimezones.includes(timezone) && selectedTimezones.length === 1) {
        return; // Don't allow removing the last timezone
      }
      
      const newTimezones = selectedTimezones.includes(timezone)
        ? selectedTimezones.filter(tz => tz !== timezone)
        : [...selectedTimezones, timezone];
      
      onSelectedTimezonesChange(newTimezones);
    }
  };

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({
        duration: 'any',
        amenities: [],
        capacity: 'any',
        types: [],
        show: 'all',
        onlyShowAvailable: false
      });
    }
  };

  const hasActiveFilters = selectedDuration !== 'any' || selectedAmenities.length > 0 || 
                          selectedCapacity !== 'any' || selectedTypes.length > 0 || selectedShow !== 'all' || onlyShowAvailable;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="h-8 w-8"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        </div>
        {showCloseButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* View Section */}
        <div>
          <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">View</h4>
          <div className="space-y-4">
            {/* Expanded View Toggle */}
            <div className="space-y-3">
              <Label>Layout</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={!compactView}
                  onCheckedChange={(checked) => onCompactViewChange?.(!checked)}
                />
                <Label 
                  className="cursor-pointer select-none"
                  onClick={() => onCompactViewChange?.(!compactView)}
                >
                  Expanded view
                </Label>
              </div>
            </div>

            {/* Only Show Available Toggle */}
            <div className="space-y-3">
              <Label>Availability</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={onlyShowAvailable}
                  onCheckedChange={handleOnlyShowAvailableChange}
                />
                <Label 
                  className="cursor-pointer select-none"
                  onClick={() => handleOnlyShowAvailableChange(!onlyShowAvailable)}
                >
                  Only show available spaces
                </Label>
              </div>
            </div>

            {/* Timezone Picker */}
            <div className="space-y-3">
              <Label>Timezones</Label>
              <Popover open={timezonesOpen} onOpenChange={setTimezonesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start"
                  >
                    {selectedTimezones.length === 1
                      ? availableTimezones.find(tz => tz.value === selectedTimezones[0])?.label || selectedTimezones[0]
                      : `${selectedTimezones.length} timezones selected`
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search timezones..." />
                    <CommandList>
                      <CommandEmpty>No timezones found.</CommandEmpty>
                      <CommandGroup>
                        {availableTimezones.map((timezone) => (
                          <CommandItem
                            key={timezone.value}
                            value={timezone.label}
                            onSelect={() => handleTimezoneToggle(timezone.value)}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedTimezones.includes(timezone.value)}
                              onCheckedChange={() => handleTimezoneToggle(timezone.value)}
                            />
                            <span>{timezone.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <Separator />

        {/* Meetings Section */}
        <div>
          <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Meetings</h4>
          <div className="space-y-4">
            {/* Spotlight My Events Toggle */}
            <div className="space-y-3">
              <Label>Highlight</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={spotlightMyEvents}
                  onCheckedChange={onSpotlightMyEventsChange}
                />
                <Label 
                  className="cursor-pointer select-none"
                  onClick={() => onSpotlightMyEventsChange?.(!spotlightMyEvents)}
                >
                  Spotlight my events
                </Label>
              </div>
            </div>

            {/* Duration Filter */}
            <div className="space-y-3">
              <Label>Duration</Label>
              <Select value={selectedDuration} onValueChange={handleDurationChange}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rooms Section */}
        <div>
          <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Rooms</h4>
          <div className="space-y-4">
            {/* Amenities Filter */}
            <div className="space-y-3">
              <Label>Amenities</Label>
              <Popover open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start"
                  >
                    {selectedAmenities.length === 0 
                      ? "Select amenities..." 
                      : `${selectedAmenities.length} selected`
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search amenities..." />
                    <CommandList>
                      <CommandEmpty>No amenities found.</CommandEmpty>
                      <CommandGroup>
                        {availableAmenities.map((amenity) => (
                          <CommandItem
                            key={amenity}
                            onSelect={() => handleAmenityToggle(amenity)}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedAmenities.includes(amenity)}
                              onChange={() => {}}
                            />
                            <span>{amenity}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedAmenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedAmenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                      <FontAwesomeIcon 
                        icon={faX}
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => handleAmenityToggle(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Capacity Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Capacity</Label>
                <span className="text-sm text-gray-500">
                  {minCapacity === 1 && maxCapacity === 15 
                    ? 'Any' 
                    : maxCapacity === 15 
                    ? `${minCapacity}+ people` 
                    : minCapacity === maxCapacity 
                    ? `${minCapacity} ${minCapacity === 1 ? 'person' : 'people'}` 
                    : `${minCapacity}-${maxCapacity} people`}
                </span>
              </div>
              <div className="px-2 pt-2">
                <Slider
                  min={1}
                  max={15}
                  step={1}
                  value={[minCapacity, maxCapacity]}
                  onValueChange={handleCapacityRangeChange}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>1</span>
                  <span>15+</span>
                </div>
              </div>
            </div>

            {/* Types Filter */}
            <div className="space-y-3">
              <Label>Types</Label>
              <Popover open={typesOpen} onOpenChange={setTypesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start"
                  >
                    {selectedTypes.length === 0 
                      ? "Select types..." 
                      : `${selectedTypes.length} selected`
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search types..." />
                    <CommandList>
                      <CommandEmpty>No types found.</CommandEmpty>
                      <CommandGroup>
                        {availableTypes.map((type) => (
                          <CommandItem
                            key={type}
                            onSelect={() => handleTypeToggle(type)}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedTypes.includes(type)}
                              onChange={() => {}}
                            />
                            <span>{type}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                      <FontAwesomeIcon 
                        icon={faX}
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => handleTypeToggle(type)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Show Filter */}
            <div className="space-y-3">
              <Label>Show</Label>
              <RadioGroup value={selectedShow} onValueChange={handleShowChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="show-all" />
                  <Label htmlFor="show-all" className="cursor-pointer">All spaces</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bookable" id="show-bookable" />
                  <Label htmlFor="show-bookable" className="cursor-pointer">Only spaces I can book</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manage" id="show-manage" />
                  <Label htmlFor="show-manage" className="cursor-pointer">Only spaces I manage</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}