import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faPizzaSlice, faBurger, faBreadSlice, faLeaf, faUtensils } from '@fortawesome/free-solid-svg-icons';

interface CuisineOption {
  id: string;
  label: string;
  icon: any;
  description: string;
}

interface CuisineOptionsCardProps {
  onSelectCuisine: (cuisineText: string) => void;
}

const CUISINE_OPTIONS: CuisineOption[] = [
  { id: 'coffee-pastries', label: 'Coffee and Pastries', icon: faCoffee, description: 'Perfect for morning meetings' },
  { id: 'pizza', label: 'Pizza', icon: faPizzaSlice, description: 'Classic crowd pleaser' },
  { id: 'sandwiches', label: 'Sandwiches', icon: faBreadSlice, description: 'Easy and customizable' },
  { id: 'salads', label: 'Salads', icon: faLeaf, description: 'Fresh and healthy options' },
  { id: 'burgers', label: 'Burgers', icon: faBurger, description: 'Hearty lunch option' },
  { id: 'other', label: 'Something else', icon: faUtensils, description: 'Browse all cuisines' },
];

export function CuisineOptionsCard({ onSelectCuisine }: CuisineOptionsCardProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleSelect = (option: CuisineOption) => {
    // Map option ID to what the user would say
    const cuisineTextMap: Record<string, string> = {
      'coffee-pastries': 'I\'d like coffee and pastries',
      'pizza': 'I\'d like pizza',
      'sandwiches': 'I\'d like sandwiches',
      'salads': 'I\'d like salads',
      'burgers': 'I\'d like burgers',
      'other': 'I\'d like to see all options',
    };
    
    onSelectCuisine(cuisineTextMap[option.id] || option.label);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700">
          What type of food would you like?
        </p>
      </div>

      {/* Cuisine Options Grid */}
      <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-200">
        {CUISINE_OPTIONS.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            onMouseEnter={() => setHoveredId(option.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              p-3 flex flex-col items-center justify-center gap-1.5 
              hover:bg-gray-50 transition-colors text-center
              ${index % 2 === 0 ? '' : 'border-l-0'}
              ${index >= 2 ? 'border-t-0' : ''}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-colors
              ${hoveredId === option.id ? 'bg-[#00B377] text-white' : 'bg-gray-100 text-gray-600'}
            `}>
              <FontAwesomeIcon icon={option.icon} className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-900">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
