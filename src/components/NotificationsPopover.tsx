import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckCircle, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: string;
  type: 'todo' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  action?: string;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  onNotificationClick: (notification: Notification) => void;
  onPopoverClose: () => void;
  isCollapsed?: boolean;
}

export function NotificationsPopover({ 
  notifications, 
  hasUnreadNotifications, 
  onNotificationClick, 
  onPopoverClose,
  isCollapsed = false
}: NotificationsPopoverProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'todo':
        return <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-blue-600" />;
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-green-600" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Popover onOpenChange={(open) => !open && onPopoverClose()}>
      <PopoverTrigger asChild>
        {isCollapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800 rounded cursor-pointer relative">
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
                  {hasUnreadNotifications && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center space-x-3 text-gray-300 hover:text-white cursor-pointer relative">
            <div className="w-4 h-4 flex items-center justify-center relative">
              <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
              {hasUnreadNotifications && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className="text-sm">Notifications</span>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="right" sideOffset={16}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FontAwesomeIcon icon={faBell} className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.description}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}