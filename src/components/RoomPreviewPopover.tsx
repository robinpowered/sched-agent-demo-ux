import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faDisplay, faDesktop, faWifi, faVolumeUp, faVideo, faChalkboard, faCircleCheck, faCircleXmark, faLock, faBan } from '@fortawesome/free-solid-svg-icons';
import { ImageWithFallback } from './common/ImageWithFallback';

interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  status: 'available' | 'occupied' | 'offline';
  features: string[];
  imageUrl?: string;
  requestOnly?: boolean;
  restricted?: boolean;
}

interface RoomPreviewPopoverProps {
  room: Room;
  children: React.ReactNode;
}

// Map room IDs to Unsplash images
const getRoomImage = (roomId: string): string => {
  const roomImages: Record<string, string> = {
    'conf-a': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'conf-b': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
    'conf-c': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
    'huddle-1': 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=400',
    'focus-room-1': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
    'creative-space-1': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
    'board-room': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    'training-room': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    'small-meeting-1': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    'executive-suite': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'collaboration-hub': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400',
    'innovation-lab': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400',
    'skyline-suite': 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400',
    'design-studio': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
    'tech-lab': 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400',
    'huddle-2': 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=400',
    'penthouse-conf': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
    'think-tank': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
  };

  // Return room-specific image or a default
  return roomImages[roomId] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400';
};

// Map feature names to FontAwesome icons
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  if (featureLower.includes('projector')) return faDisplay;
  if (featureLower.includes('monitor') || featureLower.includes('display')) return faDesktop;
  if (featureLower.includes('wifi')) return faWifi;
  if (featureLower.includes('audio') || featureLower.includes('sound')) return faVolumeUp;
  if (featureLower.includes('video') || featureLower.includes('conf')) return faVideo;
  if (featureLower.includes('whiteboard') || featureLower.includes('board')) return faChalkboard;
  return faDesktop; // default icon
};

export const RoomPreviewPopover: React.FC<RoomPreviewPopoverProps> = ({ room, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const imageUrl = getRoomImage(room.id);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-3 border border-[#868686] shadow-lg"
        side="right"
        sideOffset={88}
        align="center"
        alignOffset={0}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex gap-3">
          {/* Room Image - Small square thumbnail */}
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 relative overflow-hidden rounded-[4px]">
            <ImageWithFallback
              src={imageUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Room Details */}
          <div className="flex-1 min-w-0">
            {/* Room Name */}
            <h3 className="text-[rgba(0,0,0,0.95)] mb-1 truncate" style={{ fontSize: '16px', fontWeight: 500 }}>
              {room.name}
            </h3>

            {/* Status */}
            <div className="flex items-center gap-1.5 mb-2">
              <FontAwesomeIcon
                icon={room.status === 'available' ? faCircleCheck : faCircleXmark}
                className={`w-3.5 h-3.5 ${room.status === 'available' ? 'text-[#72B433]' : 'text-[#E81C1C]'}`}
              />
              <span className="text-[rgba(0,0,0,0.65)]" style={{ fontSize: '13px', fontWeight: 400 }}>
                {room.status === 'available' ? 'Available now' :
                  room.status === 'occupied' ? 'Currently occupied' :
                    'Currently offline'}
              </span>
            </div>

            {/* Capacity */}
            <div className="flex items-center gap-1.5 text-[rgba(0,0,0,0.65)] mb-2" style={{ fontSize: '14px', fontWeight: 400 }}>
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
              <span>{room.capacity}</span>
            </div>

            {/* Restricted Room */}
            {(room.restricted || room.name === 'Board Room') && (
              <div className="flex items-start gap-1.5 mb-2 text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                <FontAwesomeIcon icon={faBan} className="flex-shrink-0 mt-0.5" style={{ width: '12px', height: '12px' }} />
                <span>You do not have permission to book this room</span>
              </div>
            )}

            {/* Request Only */}
            {room.requestOnly && (
              <div className="flex items-start gap-1.5 mb-2 text-gray-500" style={{ fontSize: '13px', fontWeight: 400 }}>
                <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Request-only</span>
              </div>
            )}

            {/* Amenities */}
            {room.features.length > 0 && (
              <div>
                <div className="text-[rgba(0,0,0,0.55)] mb-1.5" style={{ fontSize: '11px', fontWeight: 500 }}>
                  AMENITIES
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {room.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded-[4px] text-[rgba(0,0,0,0.75)]"
                      style={{ fontSize: '11px', fontWeight: 400 }}
                    >
                      <FontAwesomeIcon icon={getFeatureIcon(feature)} className="w-3 h-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
