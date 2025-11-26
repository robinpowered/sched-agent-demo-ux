import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface CateringMenuCardProps {
  restaurantName: string;
  items: MenuItem[];
  onConfirmOrder: (items: MenuItem[]) => void;
}

export function CateringMenuCard({ restaurantName, items: initialItems, onConfirmOrder }: CateringMenuCardProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // All possible menu items (we'll use the initial items as the full menu)
  // In a real app, this would come from a separate prop with all available items
  const allMenuItems = initialItems;

  const handleQuantityChange = (itemId: string, value: string) => {
    const numValue = parseInt(value, 10);
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQuantity = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddItem = (itemToAdd: MenuItem) => {
    // Check if item already exists in the list
    const existingItem = menuItems.find(item => item.id === itemToAdd.id);
    if (existingItem) {
      // If it exists, just increase quantity by 1
      setMenuItems(prev => prev.map(item => 
        item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // If it doesn't exist, add it with quantity 1
      setMenuItems(prev => [...prev, { ...itemToAdd, quantity: 1 }]);
    }
    setSearchQuery('');
    setIsPopoverOpen(false);
  };

  // Filter available items based on search query
  const filteredAvailableItems = allMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCost = menuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasItems = menuItems.some(item => item.quantity > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-900">
          Menu from {restaurantName}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          Adjust quantities as needed
        </p>
      </div>

      {/* Menu Items */}
      <div className="divide-y divide-gray-200">
        {menuItems.map((item) => (
          <div key={item.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-900 flex-1">{item.name}</span>
              
              {/* Quantity Input */}
              <Input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className="w-14 h-8 text-center text-sm border-[#868686]"
              />
              
              {/* Remove button */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Remove item"
              >
                <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5 text-gray-500" />
              </button>
              
              <span className="text-sm text-gray-900 w-16 text-right tabular-nums">${item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* Add More Button with Dropdown */}
        <div className="px-4 py-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-center text-[#00B377] hover:text-[#00A066] hover:bg-[#00B377]/10"
              >
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                Add More Items
                <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-3 border-b border-gray-200">
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm border-[#868686]"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredAvailableItems.length > 0 ? (
                  filteredAvailableItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-gray-900 flex-1">{item.name}</span>
                        <span className="text-sm text-gray-600 tabular-nums">${item.price.toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No items found
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Footer with Total and Confirm */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700">Estimated Total:</span>
          <span className="text-sm text-gray-900 tabular-nums">${totalCost.toFixed(2)}</span>
        </div>
        <Button
          onClick={() => onConfirmOrder(menuItems.filter(item => item.quantity > 0))}
          disabled={!hasItems}
          className="w-full bg-[#00B377] hover:bg-[#00A066] text-white disabled:bg-gray-300 disabled:text-gray-500"
        >
          <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
          Add to Order
        </Button>
      </div>
    </div>
  );
}