import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUsers, faDesktop, faWifi, faVolumeUp, faCalendar, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import svgPaths from '../imports/svg-qkb7ffmkcm';
import { ImageWithFallback } from './common/ImageWithFallback';

// Import shared types
import { Meeting, Room, MeetingRequirements, RoomSuggestion } from '../types';

// Import shared utilities
import { formatTimeFloat, formatDuration } from '../utils';

interface RoomBookingSuggestionsProps {
  meetingRequirements: MeetingRequirements;
  rooms: Room[];
  onSelectRoom: (roomId: string, requirements: MeetingRequirements) => void;
  onHighlightRoom?: (roomId: string | null) => void;
  onAiMeetingPreviewUpdate?: (preview: {
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null) => void;
  onCancel?: () => void;
  onAddDetails?: (roomId: string, requirements: MeetingRequirements) => void;
  className?: string;
}

// Helper function to get room image based on room ID
const getRoomImage = (roomId: string): string => {
  // Map specific room IDs to their Unsplash images
  const roomImages: Record<string, string> = {
    'conf-a': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop&crop=center',
    'conf-b': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=250&fit=crop&crop=center',
    'conf-c': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=250&fit=crop&crop=center',
    'huddle-1': 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=400&h=250&fit=crop&crop=center',
    'focus-room-1': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop&crop=center',
    'creative-space-1': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=250&fit=crop&crop=center',
    'board-room': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop&crop=center',
    'training-room': 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=400&h=250&fit=crop&crop=center',
    'small-meeting-1': 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=250&fit=crop&crop=center',
    'executive-suite': 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=250&fit=crop&crop=center',
    'collaboration-hub': 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=400&h=250&fit=crop&crop=center',
    'innovation-lab': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center'
  };

  // Return the specific image for this room, or default if not found
  return roomImages[roomId] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop&crop=center';
};

export function RoomBookingSuggestions({
  meetingRequirements,
  rooms,
  onSelectRoom,
  onHighlightRoom,
  onAiMeetingPreviewUpdate,
  onCancel,
  onAddDetails,
  className = ""
}: RoomBookingSuggestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<RoomSuggestion[]>([]);
  const [editableTitle, setEditableTitle] = useState(meetingRequirements.title);

  // Update editable title when requirements change
  useEffect(() => {
    setEditableTitle(meetingRequirements.title);
  }, [meetingRequirements.title]);

  // Find best room suggestions based on requirements
  useEffect(() => {
    const findRoomSuggestions = () => {
      const { attendees, startTime, duration, features } = meetingRequirements;

      const availableRooms = rooms
        .filter(room => {
          // Must be available
          if (room.status !== 'available') return false;

          // Good fit: capacity is within attendees to attendees + 3
          if (room.capacity < attendees || room.capacity > attendees + 3) {
            return false;
          }

          // Must have all required features
          const requiredFeatures = features || [];
          if (requiredFeatures.length > 0) {
            const hasAllFeatures = requiredFeatures.every(requiredFeature =>
              room.features.some(roomFeature =>
                roomFeature.toLowerCase().includes(requiredFeature.toLowerCase()) ||
                requiredFeature.toLowerCase().includes(roomFeature.toLowerCase())
              )
            );
            if (!hasAllFeatures) return false;
          }

          // Must not have conflicts at the meeting time
          const meetingEnd = startTime + duration;
          const hasConflict = room.meetings.some(existingMeeting => {
            const existingStart = existingMeeting.startTime;
            const existingEnd = existingMeeting.startTime + existingMeeting.duration;

            // Check for overlap
            return !(meetingEnd <= existingStart || startTime >= existingEnd);
          });

          return !hasConflict;
        })
        .map(room => {
          // Calculate match score
          let score = 0;

          // Capacity scoring - good fits are up to 3 extra seats
          // attendees <= capacity <= attendees + 3 is a good fit
          // capacity >= attendees + 4 is a poor fit (too big)
          const extraSeats = room.capacity - attendees;

          if (extraSeats >= 0 && extraSeats <= 3) {
            // Good fit - prefer tighter fits within the good range
            score += 100 - (extraSeats * 5); // 100, 95, 90, 85 for 0-3 extra seats
          } else if (extraSeats >= 4) {
            // Poor fit - too many seats
            score += Math.max(0, 50 - extraSeats); // Decreasing score as it gets bigger
          }

          // Feature matching
          const requiredFeatures = features || [];
          const featureMatches = requiredFeatures.filter(feature =>
            room.features.some(roomFeature =>
              roomFeature.toLowerCase().includes(feature.toLowerCase()) ||
              feature.toLowerCase().includes(roomFeature.toLowerCase())
            )
          ).length;

          score += featureMatches * 10;

          // Bonus for having all required features
          if (requiredFeatures.length > 0 && featureMatches === requiredFeatures.length) {
            score += 20;
          }

          // Floor preference (ground floor gets slight bonus for accessibility)
          if (room.floor === 1) {
            score += 5;
          }

          return {
            roomId: room.id,
            roomName: room.name,
            roomCapacity: room.capacity,
            roomFeatures: room.features,
            floor: room.floor,
            score
          };
        })
        .sort((a, b) => b.score - a.score); // Sort by score descending - no limit!

      // Only reset currentIndex if suggestions array has actually changed
      const haveSuggestionsChanged = availableRooms.length !== suggestions.length ||
        availableRooms.some((room, index) => room.roomId !== suggestions[index]?.roomId);

      setSuggestions(availableRooms);
      if (haveSuggestionsChanged) {
        setCurrentIndex(0);
      }
    };

    findRoomSuggestions();
  }, [meetingRequirements, rooms]);

  // Update meeting preview to show where the meeting would be placed
  useEffect(() => {
    if (suggestions.length > 0) {
      const currentSuggestion = suggestions[currentIndex];

      // Update meeting preview to show where the meeting would be placed
      if (onAiMeetingPreviewUpdate && currentSuggestion) {
        onAiMeetingPreviewUpdate({
          roomId: currentSuggestion.roomId,
          startTime: meetingRequirements.startTime,
          duration: meetingRequirements.duration,
          title: meetingRequirements.title
        });
      }
    }

    // Don't cleanup preview on unmount - parent will handle clearing when booking
    // return () => {
    //   if (onAiMeetingPreviewUpdate) {
    //     onAiMeetingPreviewUpdate(null);
    //   }
    // };
  }, [currentIndex, suggestions, meetingRequirements.startTime, meetingRequirements.duration, meetingRequirements.title, onAiMeetingPreviewUpdate]);

  const handlePrevious = () => {
    setCurrentIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev >= suggestions.length - 1 ? 0 : prev + 1);
  };

  const handleSelectRoom = () => {
    if (suggestions[currentIndex]) {
      // Use the edited title if available
      const updatedRequirements = {
        ...meetingRequirements,
        title: editableTitle || meetingRequirements.title
      };
      onSelectRoom(suggestions[currentIndex].roomId, updatedRequirements);
    }
  };

  const handleAddDetails = () => {
    if (suggestions[currentIndex] && onAddDetails) {
      // Use the edited title if available
      const updatedRequirements = {
        ...meetingRequirements,
        title: editableTitle || meetingRequirements.title
      };
      onAddDetails(suggestions[currentIndex].roomId, updatedRequirements);
    }
  };

  const formatTime = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  const getFeatureIcon = (feature: string) => {
    const featureLower = feature.toLowerCase();
    if (featureLower.includes('video') || featureLower.includes('conf')) return <Monitor className="w-3 h-3" />;
    if (featureLower.includes('audio') || featureLower.includes('sound')) return <Volume2 className="w-3 h-3" />;
    if (featureLower.includes('wifi') || featureLower.includes('internet')) return <Wifi className="w-3 h-3" />;
    return null;
  };

  if (suggestions.length === 0) {
    return (
      <Card className={`p-4 bg-red-50 border-red-200 ${className}`}>
        <div className="text-center">
          <h4 className="font-medium text-red-800 mb-2">No Available Rooms</h4>
          <p className="text-sm text-red-600">
            No rooms are available for your requirements. Try adjusting the time, capacity, or features needed.
          </p>
        </div>
      </Card>
    );
  }

  const currentSuggestion = suggestions[currentIndex];

  // Calculate end time
  const endTime = meetingRequirements.startTime + meetingRequirements.duration;

  // Count amenities - show main ones and count total
  const amenityIcons = ['Video Conf', 'Whiteboard', 'Projector', 'Phone'];
  const displayAmenities = currentSuggestion.roomFeatures.filter(f =>
    amenityIcons.some(a => f.includes(a))
  ).slice(0, 3);
  const totalAmenities = currentSuggestion.roomFeatures.length;

  return (
    <div className={`content-stretch flex flex-col items-start relative rounded-[8px] w-full ${className}`}>
      <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[8px]" />

      {/* Form Header */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full border-b border-[#d6d6d6]">
            <div className="flex flex-col font-['Brown_LL',_sans-serif] h-[22px] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#1c1c1c] text-[14px] text-nowrap">
              <p className="[white-space-collapse:collapse] leading-[22px] overflow-ellipsis overflow-hidden font-medium">Book Space</p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-[8px]">
              <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                {currentIndex + 1}/{suggestions.length}
              </p>

              <button
                onClick={handlePrevious}
                disabled={suggestions.length <= 1}
                className="bg-white box-border content-stretch flex items-center justify-center px-[12px] py-0 h-[28px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors relative"
              >
                <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid pointer-events-none rounded-[4px] inset-0" />
                <div className="content-stretch flex gap-[8px] items-center justify-center relative">
                  <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap whitespace-pre font-medium">Previous</p>
                </div>
              </button>

              <button
                onClick={handleNext}
                disabled={suggestions.length <= 1}
                className="bg-white box-border content-stretch flex items-center justify-center px-[12px] py-0 h-[28px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors relative"
              >
                <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="content-stretch flex gap-[8px] items-center justify-center relative">
                  <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap whitespace-pre font-medium">
                    Next
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="relative shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[10px] items-start p-[12px] relative w-full">

            {/* Title Input */}
            <div className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[10px] h-[32px] items-center px-[11px] py-0 relative w-full">
                  <div className="basis-0 box-border content-stretch flex gap-[8px] grow h-[32px] items-center min-h-px min-w-px px-0 py-[4px] relative shrink-0">
                    <input
                      type="text"
                      value={editableTitle}
                      onChange={(e) => setEditableTitle(e.target.value)}
                      placeholder="Add a meeting title..."
                      className="[white-space-collapse:collapse] basis-0 font-['Brown_LL',_sans-serif] grow h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-nowrap bg-transparent border-none outline-none text-[#1c1c1c] placeholder:text-[#a1a1a1]"
                    />
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[4px]" />
            </div>

            {/* Time Range */}
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              {/* Start Time */}
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0 w-full">
                  <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-[4px] shrink-0">
                    <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[4px]" />
                    <div className="flex flex-row items-center size-full">
                      <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[11px] py-[4px] relative w-full">
                        <p className="basis-0 font-['Brown_LL',_sans-serif] grow h-[22px] leading-[22px] min-h-px min-w-px not-italic relative shrink-0 text-[#1c1c1c] text-[14px]">
                          {formatTime(meetingRequirements.startTime)}
                        </p>
                        <div className="relative shrink-0 size-[16px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <g>
                              <path d={svgPaths.p929f780} fill="#A1A1A1" />
                              <path d={svgPaths.pdcc780} fill="#A1A1A1" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="css-vc7yd0 font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6c6c6c] text-[14px] text-nowrap whitespace-pre">to</p>

              {/* End Time */}
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex gap-[8px] h-[32px] items-center relative shrink-0 w-full">
                  <div className="basis-0 bg-white grow h-[32px] min-h-px min-w-px relative rounded-[4px] shrink-0">
                    <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[4px]" />
                    <div className="flex flex-row items-center size-full">
                      <div className="box-border content-stretch flex gap-[4px] h-[32px] items-center px-[11px] py-[4px] relative w-full">
                        <p className="basis-0 font-['Brown_LL',_sans-serif] grow h-[22px] leading-[22px] min-h-px min-w-px not-italic relative shrink-0 text-[#1c1c1c] text-[14px]">
                          {formatTime(endTime)}
                        </p>
                        <div className="relative shrink-0 size-[16px]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <g>
                              <path d={svgPaths.p929f780} fill="#A1A1A1" />
                              <path d={svgPaths.pdcc780} fill="#A1A1A1" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Card */}
            <div className="relative rounded-[8px] shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Card Body */}
                <div className="relative shrink-0 w-full">
                  <div className="size-full">
                    <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[12px] relative w-full">
                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                        {/* Text */}
                        <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
                            <p className="font-['Brown_LL',_sans-serif] leading-[24px] relative shrink-0 text-[#1c1c1c] text-[16px] text-nowrap whitespace-pre font-medium">
                              {currentSuggestion.roomName}
                            </p>
                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] min-w-full relative shrink-0 text-[#6c6c6c] text-[12px] w-[min-content]">
                              Floor {currentSuggestion.floor}, Boston HQ
                            </p>
                          </div>

                          {/* Amenities */}
                          <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full mt-1">
                            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                              {/* Capacity */}
                              <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                                <div className="relative shrink-0 size-[16px]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p36908932} fill="#6C6C6C" />
                                  </svg>
                                </div>
                                <p className="css-vc7yd0 font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6c6c6c] text-[14px] text-nowrap whitespace-pre">
                                  {currentSuggestion.roomCapacity}
                                </p>
                              </div>

                              {/* Show 3 main amenity icons */}
                              {currentSuggestion.roomFeatures.some(f => f.toLowerCase().includes('wheelchair') || f.toLowerCase().includes('accessible')) && (
                                <div className="relative shrink-0 size-[16px]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p16e34000} fill="#6C6C6C" />
                                  </svg>
                                </div>
                              )}

                              {currentSuggestion.roomFeatures.some(f => f.toLowerCase().includes('video')) && (
                                <div className="relative shrink-0 size-[16px]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p3669e480} fill="#6C6C6C" />
                                  </svg>
                                </div>
                              )}

                              {currentSuggestion.roomFeatures.some(f => f.toLowerCase().includes('phone') || f.toLowerCase().includes('audio')) && (
                                <div className="relative shrink-0 size-[16px]">
                                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                    <path d={svgPaths.p18884b00} fill="#6C6C6C" />
                                  </svg>
                                </div>
                              )}

                              {/* Amenity count */}
                              {totalAmenities > 0 && (
                                <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
                                  <div aria-hidden="true" className="absolute border-[#a1a1a1] border-[0px_0px_1px] border-dashed inset-0 pointer-events-none" />
                                  <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                    {totalAmenities} amenities
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Room Photo */}
                        <div className="flex flex-row items-center self-stretch">
                          <div className="h-full relative rounded-[4px] shrink-0 w-[64px]">
                            <ImageWithFallback
                              src={getRoomImage(currentSuggestion.roomId)}
                              alt={currentSuggestion.roomName}
                              className="h-full w-full object-cover rounded-[4px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#e693b8] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </div>

          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="relative shrink-0 w-full">
        <div className="bg-[#f0f0f0] h-px shrink-0 w-full" />
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex gap-[8px] items-center px-[16px] py-[12px] relative w-full">
            {/* Add Details Button */}
            <button
              onClick={handleAddDetails}
              className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[4px] shrink-0 h-[28px] hover:bg-gray-50 transition-colors"
            >
              <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[4px]" />
              <div className="flex flex-col items-center justify-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[12px] py-0 relative w-full">
                  <div className="content-stretch flex gap-[8px] h-[28px] items-center justify-center relative shrink-0">
                    <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap whitespace-pre font-medium">
                      Add Details
                    </p>
                  </div>
                </div>
              </div>
            </button>

            {/* Book Button */}
            <button
              onClick={handleSelectRoom}
              className="basis-0 grow min-h-px min-w-px relative rounded-[4px] shrink-0 h-[28px] bg-gradient-to-r from-[#db2777] to-[#3b82f6] hover:from-[#db2777]/90 hover:to-[#3b82f6]/90 transition-colors"
            >
              <div className="flex flex-col items-center justify-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[8px] items-center justify-center px-[12px] py-0 relative w-full">
                  <div className="content-stretch flex gap-[8px] h-[28px] items-center justify-center relative shrink-0">
                    <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre font-medium">
                      Book
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}