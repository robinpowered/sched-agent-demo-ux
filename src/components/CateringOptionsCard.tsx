import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  distance: string;
  rating: number;
  address: string;
}

interface CateringOptionsCardProps {
  items: string[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

// Mock restaurant data
const ALL_RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Dunkin Donuts', cuisine: 'Coffee & Bakery', distance: '0.2 miles', rating: 4.5, address: '100 Franklin St, Boston, MA 02110' },
  { id: '2', name: 'Dunkin Donuts', cuisine: 'Coffee & Donuts', distance: '0.3 miles', rating: 4.3, address: '225 Franklin St, Boston, MA 02110' },
  { id: '3', name: 'Dunkin Donuts', cuisine: 'Coffee & Bakery', distance: '0.4 miles', rating: 4.7, address: '75 State St, Boston, MA 02109' },
  { id: '4', name: 'Dunkin Donuts', cuisine: 'Coffee & Donuts', distance: '0.5 miles', rating: 4.6, address: '185 Devonshire St, Boston, MA 02110' },
  { id: '5', name: 'Dunkin Donuts', cuisine: 'Coffee & Bakery', distance: '0.6 miles', rating: 4.4, address: '265 Franklin St, Boston, MA 02110' },
  { id: '6', name: 'Dunkin Donuts', cuisine: 'Coffee & Donuts', distance: '0.7 miles', rating: 4.2, address: '125 Summer St, Boston, MA 02110' },
  { id: '7', name: 'Dunkin Donuts', cuisine: 'Coffee & Bakery', distance: '0.8 miles', rating: 4.1, address: '1 Federal St, Boston, MA 02110' },
  { id: '8', name: 'Dunkin Donuts', cuisine: 'Coffee & Donuts', distance: '0.9 miles', rating: 4.3, address: '145 Milk St, Boston, MA 02109' },
  { id: '9', name: 'Dunkin Donuts', cuisine: 'Coffee & Bakery', distance: '1.0 miles', rating: 4.8, address: '84 State St, Boston, MA 02109' },
  { id: '10', name: 'Dunkin Donuts', cuisine: 'Coffee & Donuts', distance: '1.1 miles', rating: 4.7, address: '200 High St, Boston, MA 02110' },
];

export function CateringOptionsCard({ items, onSelectRestaurant }: CateringOptionsCardProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleRestaurants = ALL_RESTAURANTS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_RESTAURANTS.length;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, ALL_RESTAURANTS.length));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700">
          Select a restaurant to order {items.join(' and ')}:
        </p>
      </div>

      {/* Restaurant Options */}
      <div className="divide-y divide-gray-200">
        {visibleRestaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => onSelectRestaurant(restaurant)}
            onMouseEnter={() => setHoveredId(restaurant.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{restaurant.name}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{restaurant.distance}</span>
              </div>
            </div>
            {hoveredId === restaurant.id && (
              <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-[#00B377]" />
            )}
          </button>
        ))}
      </div>

      {/* Show More Link */}
      {hasMore && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleShowMore}
            className="text-sm text-[#2774C1] hover:underline"
          >
            Show more restaurants
          </button>
        </div>
      )}
    </div>
  );
}