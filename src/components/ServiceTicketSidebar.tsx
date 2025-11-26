import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faArrowLeft, faCalendar, faLocationDot, faUsers, faClock, faUtensils, faReceipt, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ServiceTicket } from '../types';

interface ServiceTicketSidebarProps {
  ticket: ServiceTicket | null;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ServiceTicketSidebar({ ticket, onClose, onBack, showBackButton = false }: ServiceTicketSidebarProps) {
  if (!ticket) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2>Service Ticket</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faX} className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-500">No ticket selected</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ServiceTicket['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          {showBackButton && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8 rounded-full hover:bg-gray-100 -ml-2"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            </Button>
          )}
          <h2>Service Ticket Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 ml-auto"
          >
            <FontAwesomeIcon icon={faX} className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Ticket ID:</span>
            <span className="font-mono">{ticket.id}</span>
          </div>
          <Badge className={`${getStatusColor(ticket.status)} border`}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="mb-3">Service Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faUtensils} className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-500">Service</p>
                  <p>{ticket.serviceName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCircle} className="w-2 h-2 text-gray-400 mt-2" />
                <div className="flex-1">
                  <p className="text-gray-500">Category</p>
                  <p className="capitalize">{ticket.category}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          {ticket.meetingDetails && (
            <>
              <div>
                <h3 className="mb-3">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-500">Event Title</p>
                      <p>{ticket.eventTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-500">Space</p>
                      <p>{ticket.space}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-500">Start Time</p>
                      <p>{formatDate(ticket.eventStartTime)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-500">Attendees</p>
                      <p>{ticket.meetingDetails.attendees} people</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Order Details - for catering */}
          {ticket.category === 'catering' && ticket.items && ticket.items.length > 0 && (
            <>
              <div>
                <h3 className="mb-3">Order Details</h3>
                
                {ticket.restaurant && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Restaurant</p>
                    <p>{ticket.restaurant}</p>
                    {ticket.restaurantAddress && (
                      <p className="text-gray-500 mt-1">{ticket.restaurantAddress}</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  {ticket.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-mono">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                {ticket.totalCost && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between items-center">
                    <p>Total Cost</p>
                    <p className="font-mono">${ticket.totalCost.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <Separator />
            </>
          )}

          {/* Description/Notes */}
          {ticket.description && (
            <>
              <div>
                <h3 className="mb-3">Description</h3>
                <p className="text-gray-700">{ticket.description}</p>
              </div>
              <Separator />
            </>
          )}

          {/* People */}
          <div>
            <h3 className="mb-3">People</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500">Requester</p>
                <p>{ticket.requester}</p>
              </div>
              <div>
                <p className="text-gray-500">Approver</p>
                <p>{ticket.approver}</p>
              </div>
              <div>
                <p className="text-gray-500">Assignee</p>
                <p>{ticket.assignee}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div>
            <h3 className="mb-3">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500">Created</p>
                <p>{formatDate(ticket.created)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p>{formatDate(ticket.lastUpdated)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-200 flex gap-3 flex-shrink-0">
        <Button variant="outline" className="flex-1">
          Edit Ticket
        </Button>
        <Button className="flex-1">
          Update Status
        </Button>
      </div>
    </div>
  );
}
