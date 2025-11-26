import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMapMarkerAlt, faClock, faUtensils, faUsers, faCalendar, faXmark, faCheck, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export interface CateringOrderItem {
  name: string;
  quantity: number;
  price: number;
  id?: string;
  description?: string;
}

export interface CateringOrderDetails {
  meeting?: {
    title: string;
    location: string;
    time: string;
    attendees: number;
  };
  items: CateringOrderItem[];
  totalCost: number;
  restaurant?: string;
  restaurantAddress?: string;
  restaurantDistance?: string;
}

interface CateringOrderPreviewProps {
  orderDetails: CateringOrderDetails;
  isOpen: boolean;
  onToggle: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  ticketNumber: string;
  onUpdateQuantity?: (itemName: string, newQuantity: number) => void;
  onRemoveItem?: (itemName: string) => void;
  onAddItem?: (item: CateringOrderItem) => void;
  availableMenuItems?: CateringOrderItem[];
}

export function CateringOrderPreview({ 
  orderDetails, 
  isOpen, 
  onToggle, 
  onCancel, 
  onSubmit, 
  ticketNumber, 
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  availableMenuItems = []
}: CateringOrderPreviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const hasItems = orderDetails.items.length > 0;
  const hasMeeting = !!orderDetails.meeting;
  const hasRestaurant = !!orderDetails.restaurant;
  
  // Order is complete when we have meeting, restaurant, and items
  const isOrderComplete = hasMeeting && hasRestaurant && hasItems;
  
  // Office address
  const officeAddress = "54 State Street, Boston, MA";

  // Filter available items based on search query
  const filteredAvailableItems = availableMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (item: CateringOrderItem) => {
    if (onAddItem) {
      onAddItem(item);
    }
    setSearchQuery('');
    setIsPopoverOpen(false);
  };

  return (
    <div>
      {/* Header - Sticky */}
      <button
        onClick={onToggle}
        className="sticky top-0 z-10 bg-white w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUtensils} className="w-4 h-4 text-[#00B377]" />
          <span className="text-gray-900">Catering Order</span>
          {hasItems && (
            <span className="text-xs text-gray-500">
              ({orderDetails.items.length} {orderDetails.items.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </div>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronDown : faChevronUp} 
          className="w-4 h-4 text-gray-500"
        />
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="relative max-h-[300px] flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Meeting Details with Delivery Address */}
            {hasMeeting && (
              <div className="space-y-1.5 pb-2 border-b border-gray-200">
                <div className="text-sm text-gray-900">
                  {orderDetails.meeting!.title}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                    <span>{orderDetails.meeting!.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                    <span>{orderDetails.meeting!.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                    <span>{orderDetails.meeting!.attendees}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3" />
                    <span>{officeAddress}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Restaurant Name & Address */}
            {orderDetails.restaurant && (
              <div className="pb-2 border-b border-gray-200">
                <div className="text-sm text-gray-900 mb-1">{orderDetails.restaurant}</div>
                {orderDetails.restaurantAddress && (
                  <div className="flex items-start gap-1.5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-3 h-3 text-gray-600 mt-0.5" />
                    <div className="text-xs text-gray-600">
                      {orderDetails.restaurantAddress}
                      {orderDetails.restaurantDistance && (
                        <span className="text-gray-500"> ({orderDetails.restaurantDistance})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Items */}
            {hasItems ? (
              <div className="space-y-1.5">
                <div className="space-y-1.5">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-900 flex-1">{item.name}</span>
                      
                      {/* Quantity Input */}
                      <Input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (onUpdateQuantity && !isNaN(newQuantity) && newQuantity >= 0) {
                            onUpdateQuantity(item.name, newQuantity);
                          }
                        }}
                        className="w-14 h-8 text-center text-sm border-[#868686]"
                      />
                      
                      {/* Remove button */}
                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item.name)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                      
                      <span className="text-sm text-gray-900 w-16 text-right tabular-nums">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Add More Button with Dropdown */}
                <div className="pt-1">
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
            ) : (
              <div className="text-sm text-gray-500 text-center py-2">
                No items added yet
              </div>
            )}
          </div>

          {/* Sticky Footer - Total and Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-2 space-y-2">
            {/* Total Cost - Only show if there are items */}
            {hasItems && (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900 tabular-nums">
                  ${orderDetails.totalCost.toFixed(2)}
                </span>
              </div>
            )}

            {/* Action Buttons - Always visible */}
            <div className="flex gap-2">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 border-[#868686]"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!isOrderComplete}
                className="flex-1 bg-[#00B377] hover:bg-[#00A066] text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                Submit Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}