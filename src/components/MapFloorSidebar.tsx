import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

interface MapFloorSidebarProps {
  selectedFloor: string;
}

export function MapFloorSidebar({ selectedFloor }: MapFloorSidebarProps) {
  return (
    <>
      {/* Sidebar Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2 text-gray-900">
          <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" />
          <h2>Floor {selectedFloor} Details</h2>
        </div>
      </div>

      {/* Sidebar Content - Empty for now */}
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-500 text-center py-8">
          Floor details coming soon
        </p>
      </div>
    </>
  );
}
