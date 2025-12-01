import React, { useState, useEffect } from 'react';
import { PageLayout } from './PageLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { RoomPreviewPopover } from './RoomPreviewPopover';
import { ImageWithFallback } from './common/ImageWithFallback';
import { toast } from 'sonner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faChevronRight,
  faChevronLeft,
  faChevronDown,
  faExclamationTriangle,
  faDesktop,
  faMagicWandSparkles,
  faWifi,
  faVolumeUp,
  faGripVertical,
  faSpinner,
  faWandSparkles,
  faThumbtack,
  faCircleXmark,
  faCircleCheck,
  faTv,
  faFileExport,
  faDoorOpen,
  faLock,
  faShieldHalved,
  faArrowRight,
  faUser,
  faBan,
  faSlash,
  faTemperatureHigh
} from '@fortawesome/free-solid-svg-icons';

// Import shared types
import { Message, ChatSession, Meeting, Room } from '../types';

// Import shared utilities
import { formatTimeFloat, formatDuration, getCurrentTimeFloat } from '../utils';

interface MeetingSpacesPageProps {
  // Note: currentView, onNavigate, isWorkplaceExpanded, onWorkplaceExpandedChange,
  // isNavCollapsed, onNavCollapsedChange, sidebarState, and onSidebarStateChange
  // are no longer needed as props since PageLayout handles them via stores
  notifications?: any[];
  hasUnreadNotifications?: boolean;
  onNotificationClick?: (notification: any) => void;
  onNotificationPopoverClose?: () => void;
  hasAvIssueOccurred?: boolean;
  aiAssistantMessages?: Message[];
  onAiAssistantMessagesUpdate?: (messages: Message[]) => void;
  chatHistory?: ChatSession[];
  onLoadChatFromHistory?: (chatSession: ChatSession) => void;
  onStartNewChat?: () => void;
  selectedMeetingDetails?: {
    meeting: Meeting;
    room: Room;
  } | null;
  onCloseMeetingDetails?: () => void;
  onOpenMeetingDetails?: (meetingDetails: any) => void;
  onClearMeetingDetails?: () => void;
  rooms: Room[];
  allRooms?: Room[];
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
  onDeleteMeeting: (meetingId: string) => void;
  onEditMeeting?: (updatedMeeting: Meeting, selectedRooms: string[]) => void;
  onCreateMeeting?: (roomId: string, startTime: number) => void;
  meetingCreationContext?: {
    roomId: string;
    startTime: number;
  } | null;
  onSaveNewMeeting?: (newMeeting: any, selectedRooms: string[]) => void;
  onCancelMeetingCreation?: () => void;
  spotlightMyEvents?: boolean;
  onSpotlightMyEventsChange?: (enabled: boolean) => void;
  compactView?: boolean;
  onCompactViewChange?: (enabled: boolean) => void;
  selectedTimezones?: string[];
  onSelectedTimezonesChange?: (timezones: string[]) => void;
  onPendingMoveChange?: (hasPendingMove: boolean) => void;
  selectedRoomDetails?: Room | null;
  onOpenRoomDetails?: (room: Room) => void;
  onCloseRoomDetails?: () => void;
  onClearRoomDetails?: () => void;
  onBackFromRoomDetails?: () => void;
  showRoomDetailsBackButton?: boolean;
  aiMeetingPreview?: {
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null;
  highlightedRoomId?: string | null;
  onHighlightRoom?: (roomId: string | null) => void;
  onAiMeetingPreviewUpdate?: (preview: {
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null) => void;
  onSelectRoom?: (roomId: string, requirements: any) => void;
  onAddDetails?: (roomId: string, requirements: any) => void;
  syncingMeetings?: Set<string>;
  pinnedRoomIds?: string[];
  onTogglePin?: (roomId: string) => void;
  timeWindowStart?: number;
  onTimeWindowPrevious?: () => void;
  onTimeWindowNext?: () => void;
  onTimeWindowNow?: () => void;
  meetingSpacesViewMode?: 'day' | 'week' | 'month';
  onMeetingSpacesViewModeChange?: (mode: 'day' | 'week' | 'month') => void;
  selectedMonthViewRoom?: string | null;
  onSelectedMonthViewRoomChange?: (roomId: string | null) => void;
  demoTimeOverride?: number | null;
  onDemoTimeOverrideChange?: (time: number | null) => void;
  onToggleRoomOffline?: (roomId: string, isOffline: boolean) => void;
  offlineRoomResolution?: {
    affectedMeetings: Array<{
      meeting: Meeting;
      roomId: string;
      roomName: string;
    }>;
    currentIndex: number;
    selectedAlternativeRoomId: string | null;
  } | null;
  onNextOfflineMeeting?: () => void;
  onPreviousOfflineMeeting?: () => void;
  onSelectOfflineAlternativeRoom?: (roomId: string) => void;
  onMoveOfflineMeeting?: () => void;
  onSkipOfflineMeeting?: () => void;
  onMeetingSelectedForCatering?: (meeting: Meeting, room: Room) => void;
  cateringOrderDetails?: any;
  onCateringOrderUpdate?: (details: any) => void;
  cateringOrderSubmitted?: boolean;
  onCateringOrderSubmittedChange?: (submitted: boolean) => void;
  onCreateServiceTicket?: (ticketData: any) => any;
  onNavigateToTicket?: (ticketId: string) => void;
  cateringTicketNumber?: string | null;
  onCateringTicketNumberChange?: (ticketNumber: string) => void;
  serviceTickets?: any[];
  onOpenServiceTicket?: (ticketId: string) => void;
  selectedServiceTicket?: any | null;
  onCloseServiceTicket?: () => void;
  onBackFromServiceTicket?: () => void;
}

// Note: Meeting and Room types are now imported from '../types'

// Helper component for Month View
function MonthView({
  room,
  allRooms,
  onOpenMeetingDetails,
  onCreateMeeting,
  demoTimeOverride,
  onNavigateToDayView
}: {
  room: Room | undefined;
  allRooms?: Room[];
  onOpenMeetingDetails: (meeting: Meeting, room: Room) => void;
  onCreateMeeting: (roomId: string, startTime: number) => void;
  demoTimeOverride?: number | null;
  onNavigateToDayView?: () => void;
}) {
  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-12 text-gray-500">
          No room selected
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentDate = now.getDate();
  // Use demo time override if available, otherwise use real current time
  const currentTimeFloat = demoTimeOverride !== null && demoTimeOverride !== undefined
    ? demoTimeOverride
    : now.getHours() + now.getMinutes() / 60;

  // Helper function to check if meeting is in the past
  const isMeetingPast = (dayDate: number, meeting: Meeting) => {
    if (dayDate < currentDate) return true; // Past day
    if (dayDate > currentDate) return false; // Future day
    // Same day - check time
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meetingEndTime <= currentTimeFloat;
  };

  // Helper function to check if meeting is currently happening
  const isMeetingCurrent = (dayDate: number, meeting: Meeting) => {
    if (dayDate !== currentDate) return false; // Not today
    // Same day - check if within meeting time
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meeting.startTime <= currentTimeFloat && currentTimeFloat < meetingEndTime;
  };

  // Helper function to format time
  const formatTime = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  // Calculate total meetings across all rooms for each day
  const getOfficeMeetingCounts = () => {
    if (!allRooms || allRooms.length === 0) return {};

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyCounts: Record<number, number> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      let totalMeetings = 0;

      // Count meetings across all rooms for this day
      allRooms.forEach(r => {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Only weekdays
          const dayMeetings = r.meetings.filter((_, meetingIndex) => {
            const pattern1 = day % 3 === 0;
            const pattern2 = day % 5 === meetingIndex % 5;
            const pattern3 = (day + meetingIndex) % 7 === 0;
            return pattern1 || pattern2 || pattern3;
          });
          totalMeetings += dayMeetings.length;
        }
      });

      dailyCounts[day] = totalMeetings;
    }

    return dailyCounts;
  };

  // Determine which days have unusually high meeting counts
  const getHighActivityDays = () => {
    const counts = getOfficeMeetingCounts();
    const values = Object.values(counts).filter(v => v > 0); // Only consider days with meetings

    if (values.length === 0) return new Set<number>();

    // Calculate average and threshold
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const threshold = average * 1.5; // 50% above average is considered "high"

    // Return set of day numbers that exceed threshold
    const highDays = new Set<number>();
    Object.entries(counts).forEach(([day, count]) => {
      if (count >= threshold && count > average) {
        highDays.add(parseInt(day));
      }
    });

    return highDays;
  };

  const highActivityDays = getHighActivityDays();

  // Generate month days with varied meetings
  const getMonthDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();

      // Show meetings on weekdays only, varied distribution
      let dayMeetings: Meeting[] = [];
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday-Friday
        // Distribute meetings across month - different patterns for variety
        dayMeetings = room.meetings.filter((_, meetingIndex) => {
          // Create varied patterns: some days have more meetings, some have fewer
          const pattern1 = i % 3 === 0; // Every 3rd day
          const pattern2 = i % 5 === meetingIndex % 5; // Rotating meetings
          const pattern3 = (i + meetingIndex) % 7 === 0; // Another pattern

          return pattern1 || pattern2 || pattern3;
        }).slice(0, 3); // Limit to 3 meetings per day max
      }

      days.push({
        date: i,
        isToday: i === now.getDate(),
        dayOfWeek: dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        meetings: dayMeetings
      });
    }
    return { days, firstDay };
  };

  const { days, firstDay } = getMonthDays();

  const handleExport = () => {
    // Placeholder for export functionality
    // TODO: Implement export functionality
  };

  // Calculate number of weeks needed for the calendar grid
  const totalCells = firstDay + days.length;
  const weeksNeeded = Math.ceil(totalCells / 7);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Row with Room Name and Export Button */}
      <div className="bg-white border-b border-[#D6D6D6] shadow-sm px-6 py-2 flex items-center justify-between flex-shrink-0">
        <h3 style={{ fontSize: '20px', fontWeight: 500 }} className="text-gray-900">
          {room.name}
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="h-8 px-3 border-[#868686]"
          style={{ fontSize: '14px', fontWeight: 400 }}
        >
          <FontAwesomeIcon icon={faFileExport} className="w-3.5 h-3.5 mr-2" />
          Export
        </Button>
      </div>

      {/* Calendar Content - fills available vertical space */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6">
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center p-1 bg-gray-50 rounded" style={{ fontSize: '11px', fontWeight: 500 }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - dynamic row heights to fill vertical space */}
        <div className="grid grid-cols-7 gap-1 flex-1" style={{ gridTemplateRows: `repeat(${weeksNeeded}, 1fr)` }}>
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="flex flex-col" />
          ))}

          {/* Day cells with meetings */}
          {days.map((day) => {
            const dayMeetings = day.meetings;
            const isWeekend = day.isWeekend;
            const isHighActivity = highActivityDays.has(day.date);

            return (
              <TooltipProvider key={day.date}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`rounded p-1 relative flex flex-col cursor-pointer transition-all hover:shadow-sm ${isHighActivity
                        ? 'border-2 border-red-500 bg-red-50'
                        : day.isToday
                          ? 'border-2 border-[#3b82f6] bg-[#f0f6ff]'
                          : isWeekend
                            ? 'border border-[#868686] bg-white office-closed'
                            : 'border border-[#868686] bg-white'
                        }`}
                      onClick={() => {
                        if (!isWeekend) {
                          onNavigateToDayView?.();
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-1 relative z-10 flex-shrink-0">
                        <div style={{ fontSize: '11px', fontWeight: day.isToday ? 500 : 400 }} className={`text-center flex-1 ${isWeekend ? 'text-gray-400' : ''}`}>
                          {day.date}
                        </div>
                        {isHighActivity && (
                          <FontAwesomeIcon
                            icon={faTemperatureHigh}
                            className="w-3 h-3 text-red-500 flex-shrink-0"
                          />
                        )}
                      </div>
                      {dayMeetings.length > 0 && (
                        <div className="space-y-0.5 overflow-y-auto scrollbar-overlay relative z-10 flex-1">
                          {dayMeetings.map((meeting, idx) => {
                            const isPast = isMeetingPast(day.date, meeting);
                            const isCurrent = isMeetingCurrent(day.date, meeting);

                            return (
                              <button
                                key={idx}
                                className={`w-full p-1 text-white rounded cursor-pointer transition-colors text-left ${isPast
                                  ? 'bg-gray-400 hover:bg-gray-500'
                                  : 'bg-[#2774C1] hover:bg-[#1e5a8a]'
                                  }`}
                                style={{
                                  boxShadow: isCurrent ? '0 0 0 3px rgba(59, 130, 246, 0.25)' : undefined
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenMeetingDetails(meeting, room);
                                }}
                              >
                                <div style={{ fontSize: '9px', fontWeight: 500 }} className="truncate">
                                  {meeting.title}
                                </div>
                                <div style={{ fontSize: '8px' }} className="opacity-75 truncate">
                                  {formatTime(meeting.startTime)} - {formatTime(meeting.startTime + meeting.duration)}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  {isHighActivity && (
                    <TooltipContent>
                      <p>This office has an unusually high number of meetings today</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper component for Week View
function WeekView({
  rooms,
  onOpenMeetingDetails,
  pinnedRoomIds,
  onTogglePin,
  onOpenRoomDetails,
  compactView,
  selectedTimezones
}: {
  rooms: Room[];
  onOpenMeetingDetails: (meeting: Meeting, room: Room) => void;
  pinnedRoomIds: string[];
  onTogglePin: (roomId: string) => void;
  onOpenRoomDetails: (room: Room) => void;
  compactView: boolean;
  selectedTimezones: string[];
}) {
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set([1, 2, 3]));
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeFloat = currentHour + currentMinutes / 60;

  // Determine today's day of the week (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri)
  const getTodayIndex = () => {
    const today = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    if (today === 0 || today === 6) return -1; // Weekend, no highlight
    return today - 1; // Convert to 0-based Mon-Fri (Mon=0, Fri=4)
  };
  const todayIndex = getTodayIndex();

  // Helper function to check if meeting is in the past
  const isMeetingPast = (dayIndex: number, meeting: Meeting) => {
    if (dayIndex < todayIndex) return true; // Past day
    if (dayIndex > todayIndex) return false; // Future day
    // Same day - check time
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meetingEndTime <= currentTimeFloat;
  };

  // Helper function to check if meeting is currently happening
  const isMeetingCurrent = (dayIndex: number, meeting: Meeting) => {
    if (dayIndex !== todayIndex) return false; // Not today
    // Same day - check if within meeting time
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meeting.startTime <= currentTimeFloat && currentTimeFloat < meetingEndTime;
  };

  // Helper function to format time
  const formatTime = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  // Mock meetings for each day (would normally come from real data)
  const getMeetingsForDay = (room: Room, dayIndex: number): Meeting[] => {
    // Create varied distribution of meetings across the week
    // Strategy: Hash room ID to create consistent but varied patterns
    const roomHash = room.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const meetings = room.meetings;

    // Different distribution patterns based on room
    const pattern = roomHash % 5;

    switch (pattern) {
      case 0: // Busy early week, lighter later
        if (dayIndex === 0) return meetings.slice(0, Math.ceil(meetings.length * 0.4));
        if (dayIndex === 1) return meetings.slice(Math.ceil(meetings.length * 0.4), Math.ceil(meetings.length * 0.7));
        if (dayIndex === 2) return meetings.slice(Math.ceil(meetings.length * 0.7), Math.ceil(meetings.length * 0.85));
        if (dayIndex === 3) return meetings.slice(Math.ceil(meetings.length * 0.85), Math.ceil(meetings.length * 0.95));
        if (dayIndex === 4) return meetings.slice(Math.ceil(meetings.length * 0.95));
        break;

      case 1: // Evenly distributed
        const perDay = Math.ceil(meetings.length / 5);
        return meetings.slice(dayIndex * perDay, (dayIndex + 1) * perDay);

      case 2: // Busy mid-week
        if (dayIndex === 0) return meetings.slice(0, 1);
        if (dayIndex === 1) return meetings.slice(1, Math.ceil(meetings.length * 0.3));
        if (dayIndex === 2) return meetings.slice(Math.ceil(meetings.length * 0.3), Math.ceil(meetings.length * 0.7));
        if (dayIndex === 3) return meetings.slice(Math.ceil(meetings.length * 0.7), meetings.length - 1);
        if (dayIndex === 4) return meetings.slice(meetings.length - 1);
        break;

      case 3: // Busy Friday (today)
        if (dayIndex === 0) return meetings.slice(0, 1);
        if (dayIndex === 1) return meetings.slice(1, 2);
        if (dayIndex === 2) return meetings.slice(2, 3);
        if (dayIndex === 3) return meetings.slice(3, Math.ceil(meetings.length * 0.4));
        if (dayIndex === 4) return meetings.slice(Math.ceil(meetings.length * 0.4));
        break;

      case 4: // Alternating pattern
        if (dayIndex % 2 === 0) {
          // Mon, Wed, Fri get more meetings
          const chunk = Math.ceil(meetings.length / 3);
          const chunkIndex = Math.floor(dayIndex / 2);
          return meetings.slice(chunkIndex * chunk, (chunkIndex + 1) * chunk);
        } else {
          // Tue, Thu get fewer meetings
          const remaining = meetings.filter((_, idx) => {
            const chunk = Math.ceil(meetings.length / 3);
            const chunkIndex = Math.floor(idx / chunk);
            return chunkIndex >= 3;
          });
          const halfIndex = dayIndex === 1 ? 0 : 1;
          const half = Math.ceil(remaining.length / 2);
          return remaining.slice(halfIndex * half, (halfIndex + 1) * half);
        }
        break;
    }

    return [];
  };

  // Get max meeting count for a room to determine row height
  const getMaxMeetingCount = (room: Room): number => {
    let maxCount = 0;
    for (let i = 0; i < 5; i++) {
      const dayMeetings = getMeetingsForDay(room, i);
      maxCount = Math.max(maxCount, dayMeetings.length);
    }
    return maxCount;
  };

  // Group rooms by floor, excluding pinned rooms from their normal positions
  const groupedRooms = rooms.reduce((acc, room) => {
    // Skip pinned rooms - they only appear in the Pinned Spaces section
    if (normalizedPinnedRoomIds.includes(room.id)) {
      return acc;
    }

    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(groupedRooms).map(Number).sort((a, b) => a - b);

  const toggleFloor = (floor: number) => {
    setExpandedFloors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(floor)) {
        newSet.delete(floor);
      } else {
        newSet.add(floor);
      }
      return newSet;
    });
  };

  // Helper function to check if a room is restricted (user cannot book)
  const isRoomRestricted = (room: Room) => {
    return room.restricted || room.name === 'Board Room';
  };

  const RoomRow = ({ room }: { room: Room }) => {
    const isPinned = normalizedPinnedRoomIds.includes(room.id);
    const isRestricted = isRoomRestricted(room);
    const isOffline = room.status === 'offline';
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div className="flex border-b border-[#D6D6D6] min-h-[64px]">
        {/* Left: Room name (w-60 to match day view) - stretches full height */}
        <div
          className={`w-60 max-[600px]:w-32 ${isOffline ? 'bg-[#FFD6D6]' : 'bg-gray-50'} flex items-start pl-[16px] pr-2 max-[600px]:px-2 py-3 flex-shrink-0`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center w-full">
            <div className="flex-1 min-w-0 overflow-hidden">
              <RoomPreviewPopover room={room}>
                <div
                  className="cursor-pointer"
                  onClick={() => onOpenRoomDetails(room)}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    {isRestricted ? (
                      <FontAwesomeIcon
                        icon={faBan}
                        className="text-gray-400 flex-shrink-0"
                        style={{ width: '12px', height: '12px' }}
                      />
                    ) : room.requestOnly && (
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-gray-400 flex-shrink-0"
                        style={{ width: '12px', height: '12px' }}
                      />
                    )}
                    <div className="flex items-center gap-1 min-w-0">
                      <div className={`text-sm max-[600px]:text-xs text-[rgba(0,0,0,0.95)] truncate ${!isRestricted && !room.requestOnly ? 'ml-4' : ''}`} style={{ fontWeight: 400 }}>
                        {room.name}
                      </div>
                      {room.status === 'offline' && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 flex-shrink-0">
                          Offline
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!compactView && (
                    <div className="text-xs max-[600px]:hidden text-[rgba(0,0,0,0.75)] flex items-center mt-1 ml-4">
                      <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                      {room.capacity} people
                    </div>
                  )}
                </div>
              </RoomPreviewPopover>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 max-[600px]:hidden w-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(room.id);
                }}
                className={`p-1 hover:bg-gray-200 rounded transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              >
                {isPinned ? (
                  <span className="fa-layers fa-fw w-4 h-4">
                    <FontAwesomeIcon icon={faThumbtack} className="text-[#2774C1]" />
                    <FontAwesomeIcon icon={faSlash} className="text-[#2774C1]" />
                  </span>
                ) : (
                  <FontAwesomeIcon
                    icon={faThumbtack}
                    className="w-4 h-4 text-gray-400"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Week grid (5 columns) */}
        <div className="flex-1 grid grid-cols-5">
          {weekdays.map((day, dayIndex) => {
            const dayMeetings = getMeetingsForDay(room, dayIndex);
            const isToday = dayIndex === todayIndex;

            return (
              <div
                key={day}
                className={`p-2 flex flex-col gap-1.5 ${dayIndex < 4 ? 'border-r border-[#D6D6D6]' : ''} ${isOffline ? 'bg-[#FFD6D6]' : isToday ? 'bg-[#f0f6ff]' : ''}`}
              >
                {dayMeetings.map((meeting) => {
                  const isPast = isMeetingPast(dayIndex, meeting);
                  const isCurrent = isMeetingCurrent(dayIndex, meeting);

                  return (
                    <button
                      key={meeting.id}
                      className={`w-full p-1.5 text-white rounded cursor-pointer transition-colors text-left flex-shrink-0 ${isPast
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : 'bg-[#2774C1] hover:bg-[#1e5a8a]'
                        }`}
                      style={{
                        boxShadow: isCurrent ? '0 0 0 3px rgba(59, 130, 246, 0.25)' : undefined
                      }}
                      onClick={() => onOpenMeetingDetails(meeting, room)}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 500 }} className="truncate">
                        {meeting.title}
                      </div>
                      <div style={{ fontSize: '9px' }} className="opacity-75 truncate">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.startTime + meeting.duration)}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col relative">
      {/* Fixed vertical divider line */}
      <div className="absolute left-60 max-[600px]:left-32 top-0 bottom-0 w-px bg-[#D9D9D9] z-10 pointer-events-none" />

      {/* Fixed Headers */}
      <div className="flex border-b border-[#D6D6D6] shadow-sm bg-white relative z-20">
        {/* Left Sidebar Header - Blank like day view but matches height */}
        <div className="w-60 max-[600px]:w-32 bg-white flex flex-col justify-center">
          <div className="flex items-center justify-between px-[16px] max-[600px]:px-2 py-2 max-[600px]:py-1">
            {/* Invisible spacer to match button height in day view */}
            <div className="h-7" />

            {/* Invisible spacer to match timezone labels height in day view */}
            <div className="text-right flex flex-col justify-center">
              {selectedTimezones.map((timezone, index) => (
                <div key={timezone} className={index > 0 ? 'mt-2' : ''} style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.5', color: 'transparent' }}>
                  {timezone === 'America/Los_Angeles' ? 'PST' :
                    timezone === 'America/Denver' ? 'MST' :
                      timezone === 'America/Chicago' ? 'CST' :
                        timezone === 'America/New_York' ? 'EST' :
                          timezone === 'Europe/London' ? 'GMT' :
                            timezone === 'Europe/Paris' ? 'CET' :
                              timezone === 'Asia/Tokyo' ? 'JST' :
                                timezone === 'Asia/Shanghai' ? 'CST' :
                                  timezone === 'Asia/Dubai' ? 'GST' :
                                    timezone === 'Australia/Sydney' ? 'AEST' :
                                      timezone}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Week Day Headers */}
        <div className="flex-1 bg-white overflow-hidden h-full">
          <div className="grid grid-cols-5 h-full">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className={`flex items-center justify-center ${index < 4 ? 'border-r border-[#D6D6D6]' : ''} ${index === todayIndex ? 'bg-[#f0f6ff]' : ''}`}
                style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.75)' }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="flex-1 overflow-auto scrollbar-overlay bg-white">
        {/* Pinned Spaces Section */}
        {normalizedPinnedRoomIds.length > 0 && (
          <div>
            {/* Pinned Spaces Header - Two column layout */}
            <div className="flex">
              <button
                onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                className="w-60 max-[600px]:w-32 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors border-b border-[#D6D6D6] h-10 px-[16px] max-[600px]:px-2 flex-shrink-0"
              >
                <div className="flex items-center">
                  <div className="text-[rgba(0,0,0,0.95)] max-[600px]:text-xs" style={{ fontSize: '14px', fontWeight: 700 }}>Pinned Spaces</div>
                </div>
                {isPinnedExpanded ? (
                  <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                ) : (
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                )}
              </button>
              <div className="flex-1 bg-gray-100 border-b border-[#D6D6D6]"></div>
            </div>

            {/* Pinned Rooms */}
            {isPinnedExpanded && (
              <div>
                {normalizedPinnedRoomIds.map(roomId => {
                  const room = rooms.find(r => r.id === roomId);
                  if (!room) return null;
                  return <RoomRow key={room.id} room={room} />;
                })}
              </div>
            )}
          </div>
        )}

        {/* Floors */}
        {floors.map(floor => (
          <div key={floor}>
            {/* Floor Header - Two column layout */}
            <div className="flex">
              <button
                onClick={() => toggleFloor(floor)}
                className="w-60 max-[600px]:w-32 flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors border-b border-[#D6D6D6] h-10 px-[16px] max-[600px]:px-2 flex-shrink-0"
              >
                <div className="flex items-center">
                  <div className="text-[rgba(0,0,0,0.95)] max-[600px]:text-xs" style={{ fontSize: '14px', fontWeight: 700 }}>Floor {floor}</div>
                </div>
                {expandedFloors.has(floor) ? (
                  <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                ) : (
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                )}
              </button>
              <div className="flex-1 bg-gray-100 border-b border-[#D6D6D6]"></div>
            </div>

            {/* Room List */}
            {expandedFloors.has(floor) && (
              <div>
                {groupedRooms[floor].map(room => (
                  <RoomRow key={room.id} room={room} />
                ))}
              </div>
            )}
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No rooms available
          </div>
        )}
      </div>
    </div>
  );
}

export function MeetingSpacesPage({
  notifications,
  hasUnreadNotifications,
  onNotificationClick,
  onNotificationPopoverClose,
  hasAvIssueOccurred = false,
  aiAssistantMessages = [],
  onAiAssistantMessagesUpdate,
  chatHistory = [],
  onLoadChatFromHistory,
  onStartNewChat,
  selectedMeetingDetails,
  onCloseMeetingDetails,
  onOpenMeetingDetails,
  onClearMeetingDetails,
  rooms,
  allRooms = [],
  activeFilters,
  onFiltersChange,
  onDeleteMeeting,
  onEditMeeting,
  onCreateMeeting,
  meetingCreationContext,
  onSaveNewMeeting,
  onCancelMeetingCreation,
  spotlightMyEvents = false,
  onSpotlightMyEventsChange,
  compactView = false,
  onCompactViewChange,
  selectedTimezones = ['America/New_York'],
  onSelectedTimezonesChange,
  onPendingMoveChange,
  selectedRoomDetails,
  onOpenRoomDetails,
  onCloseRoomDetails,
  onClearRoomDetails,
  onBackFromRoomDetails,
  showRoomDetailsBackButton = false,
  aiMeetingPreview,
  highlightedRoomId,
  onHighlightRoom,
  onAiMeetingPreviewUpdate,
  onSelectRoom,
  onAddDetails,
  syncingMeetings,
  pinnedRoomIds = [],
  onTogglePin,
  timeWindowStart = 8,
  onTimeWindowPrevious,
  onTimeWindowNext,
  onTimeWindowNow,
  meetingSpacesViewMode = 'day',
  onMeetingSpacesViewModeChange,
  selectedMonthViewRoom,
  onSelectedMonthViewRoomChange,
  demoTimeOverride,
  onDemoTimeOverrideChange,
  onToggleRoomOffline,
  offlineRoomResolution,
  onNextOfflineMeeting,
  onPreviousOfflineMeeting,
  onSelectOfflineAlternativeRoom,
  onMoveOfflineMeeting,
  onSkipOfflineMeeting,
  onMeetingSelectedForCatering,
  cateringOrderDetails,
  onCateringOrderUpdate,
  cateringOrderSubmitted,
  onCateringOrderSubmittedChange,
  onCreateServiceTicket,
  onNavigateToTicket,
  cateringTicketNumber,
  onCateringTicketNumberChange
}: MeetingSpacesPageProps) {
  // Note: PageLayout now handles currentView, onNavigate, isWorkplaceExpanded, 
  // onWorkplaceExpandedChange, isNavCollapsed, onNavCollapsedChange, sidebarType,
  // and onSidebarStateChange via stores internally

  // Ensure pinnedRoomIds is always an array
  const normalizedPinnedRoomIds = Array.isArray(pinnedRoomIds) ? pinnedRoomIds : [];

  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set([1, 2, 3]));
  const [isPinnedExpanded, setIsPinnedExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDraggingTime, setIsDraggingTime] = useState(false);
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState<{ roomId: string, timeSlot: number } | null>(null);
  const [meetingPreview, setMeetingPreview] = useState<{
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null>(null);

  // Drag and drop state
  const [draggedMeeting, setDraggedMeeting] = useState<{
    meeting: Meeting;
    sourceRoomId: string;
    isPreview?: boolean;
  } | null>(null);

  // Pending move confirmation state
  const [pendingMove, setPendingMove] = useState<{
    meeting: Meeting;
    sourceRoomId: string;
    targetRoomId: string;
    targetTimeSlot: number;
    isPreview?: boolean;
  } | null>(null);

  // Conflict resolution state - tracks both moves when there's a conflict
  const [conflictResolution, setConflictResolution] = useState<{
    autoMovedMeeting: {
      meeting: Meeting;
      sourceRoomId: string;
      targetTimeSlot: number;
    };
    draggedMeeting: {
      meeting: Meeting;
      sourceRoomId: string;
      targetRoomId: string;
      targetTimeSlot: number;
    };
    availableOptions: {
      roomId: string;
      roomName: string;
      roomCapacity: number;
      roomFeatures: string[];
    }[];
    currentOptionIndex: number;
    currentConfirmation: 'auto-moved' | 'dragged' | 'complete';
  } | null>(null);

  // Hover state for meeting blocks
  const [hoveredMeeting, setHoveredMeeting] = useState<string | null>(null);

  // Drag hover state for tooltips
  const [dragHoverRoom, setDragHoverRoom] = useState<{
    roomId: string;
    roomCapacity: number;
    reasons: string[];
    isRestricted?: boolean;
    isOffline?: boolean;
  } | null>(null);

  // Mouse position for tooltip during drag
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Confirmation loading state
  const [confirmationState, setConfirmationState] = useState<'idle' | 'checking-capacity' | 'checking-permissions' | 'ready'>('idle');

  // Track if this is the first load of conflict resolution (to show loading only once)
  const [isFirstConflictLoad, setIsFirstConflictLoad] = useState(true);



  // Syncing meetings state - tracks meetings that are currently syncing after being moved
  const [localSyncingMeetings, setLocalSyncingMeetings] = useState<Set<string>>(new Set());

  // Combine local syncing meetings with those passed from parent (AI bookings)
  const allSyncingMeetings = new Set([...localSyncingMeetings, ...(syncingMeetings || [])]);

  // Current user for spotlight functionality
  const currentUser = 'Jane Doe';

  // Refs for focus management in confirmation modal
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);


  // Generate full 24-hour grid (midnight to midnight)
  // This renders all time slots, and we'll scroll to show the current window
  const generateFullDayTimeSlots = () => {
    const slots: string[] = [];
    const values: number[] = [];
    const labels: string[] = [];

    // Generate 48 half-hour slots (24 hours)
    for (let i = 0; i < 48; i++) {
      const hourValue = Math.floor(i / 2);
      const minutes = (i % 2) * 30;
      values.push(hourValue + (minutes / 60));

      // Format time label
      const hour24 = hourValue % 24;
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const minuteStr = minutes === 0 ? '' : `:${minutes}`;

      slots.push(`${hour12}${minuteStr === ':00' ? '' : minuteStr} ${period}`);

      // Add hour label for every 2 slots (on the hour)
      if (i % 2 === 0) {
        labels.push(`${hour12} ${period}`);
      }
    }

    return { slots, values, labels };
  };

  const { slots: timeSlots, values: timeSlotValues, labels: hourLabels } = generateFullDayTimeSlots();



  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Set initial meeting preview when creation context is available
  useEffect(() => {
    if (meetingCreationContext) {
      setMeetingPreview({
        roomId: meetingCreationContext.roomId,
        startTime: meetingCreationContext.startTime,
        duration: 0.5, // Default 30 minutes
        title: ''
      });
    } else {
      setMeetingPreview(null);
    }
  }, [meetingCreationContext]);

  // Global drag handling to ensure browser allows drops
  React.useEffect(() => {
    const handleDocumentDragOver = (e: DragEvent) => {
      if (draggedMeeting) {
        e.preventDefault();
      }
    };

    const handleDocumentDrop = (e: DragEvent) => {
      if (draggedMeeting) {
        e.preventDefault();
      }
    };

    document.addEventListener('dragover', handleDocumentDragOver);
    document.addEventListener('drop', handleDocumentDrop);

    return () => {
      document.removeEventListener('dragover', handleDocumentDragOver);
      document.removeEventListener('drop', handleDocumentDrop);
    };
  }, [draggedMeeting]);

  // Handle confirmation loading sequence
  useEffect(() => {
    if (pendingMove || (conflictResolution && isFirstConflictLoad)) {
      // Start the loading sequence only for pendingMove or first-time conflict resolution
      setConfirmationState('checking-capacity');

      // After 2 seconds, switch to checking permissions
      const timer1 = setTimeout(() => {
        setConfirmationState('checking-permissions');

        // After another 2 seconds, switch to ready
        const timer2 = setTimeout(() => {
          setConfirmationState('ready');
          // Mark that we've completed the first load for conflict resolution
          if (conflictResolution) {
            setIsFirstConflictLoad(false);
          }
        }, 2000);

        return () => clearTimeout(timer2);
      }, 2000);

      return () => {
        clearTimeout(timer1);
      };
    } else if (conflictResolution && !isFirstConflictLoad) {
      // For subsequent option navigation, set to ready immediately
      setConfirmationState('ready');
    } else {
      // Reset state when pendingMove is cleared and no conflict resolution is active
      setConfirmationState('idle');
      setIsFirstConflictLoad(true); // Reset for next time
    }
  }, [pendingMove, conflictResolution, isFirstConflictLoad]);

  // Focus the confirm button when it becomes enabled
  useEffect(() => {
    if (confirmationState === 'ready' && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [confirmationState]);

  // Notify parent about pending move changes for navigation warning
  useEffect(() => {
    if (onPendingMoveChange) {
      onPendingMoveChange(!!pendingMove || !!conflictResolution);
    }
  }, [pendingMove, conflictResolution, onPendingMoveChange]);

  const toggleFloor = (floor: number) => {
    setExpandedFloors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(floor)) {
        newSet.delete(floor);
      } else {
        newSet.add(floor);
      }
      return newSet;
    });
  };

  // Helper function to check if a meeting is in the past
  const isMeetingPast = (meeting: Meeting) => {
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meetingEndTime <= currentHourFloat;
  };

  // Helper function to check if a meeting is currently happening
  const isMeetingCurrent = (meeting: Meeting) => {
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }
    return meeting.startTime <= currentHourFloat && currentHourFloat < (meeting.startTime + meeting.duration);
  };

  // Helper function to check if a meeting is in the future (hasn't started yet)
  const isMeetingFuture = (meeting: Meeting) => {
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }
    return meeting.startTime > currentHourFloat;
  };

  // Helper function to check if a room is restricted (user cannot book)
  const isRoomRestricted = (room: Room) => {
    return room.restricted || room.name === 'Board Room';
  };

  // Helper function to check if a meeting should be checked in (started earlier today)
  const shouldBeCheckedIn = (meeting: any) => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const currentHourFloat = hour + minutes / 60;
    // Meeting started in the past (but might still be ongoing or finished)
    return meeting.startTime <= currentHourFloat;
  };

  const handleMeetingClick = (meeting: Meeting, room: Room) => {
    // Check if ezCater agent is active and waiting for meeting selection
    const hasEzCaterAgent = aiAssistantMessages?.some(msg => msg.agentType === 'ezcater');

    if (hasEzCaterAgent && onMeetingSelectedForCatering) {
      // Handle catering meeting selection
      onMeetingSelectedForCatering(meeting, room);
    } else if (onOpenMeetingDetails) {
      // Allow clicking on past meetings to view details (editing will be disabled in the sidebar)
      onOpenMeetingDetails({ meeting, room });
    }
  };

  const handleMeetingPreviewUpdate = (updatedFields: Partial<{
    startTime: number;
    duration: number;
    title: string;
    roomIds: string[];
  }>) => {
    if (meetingPreview && meetingCreationContext) {
      setMeetingPreview(prev => prev ? {
        ...prev,
        startTime: updatedFields.startTime ?? prev.startTime,
        duration: updatedFields.duration ?? prev.duration,
        title: updatedFields.title ?? prev.title,
        roomId: updatedFields.roomIds?.[0] ?? prev.roomId
      } : null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, meeting: Meeting, roomId: string, isPreview = false) => {
    const dragData = { meeting, sourceRoomId: roomId, isPreview };
    setDraggedMeeting(dragData);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));

    // Initialize mouse position
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e: React.DragEvent, roomId: string, timeSlot: number) => {
    if (!draggedMeeting) {
      return;
    }

    e.preventDefault(); // Allow drop
    e.dataTransfer.dropEffect = 'move';

    // Update mouse position for tooltip
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Prevent clearing preview when moving between child elements
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetRoomId: string, targetTimeSlot: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedMeeting) {
      return;
    }

    const { meeting, sourceRoomId, isPreview } = draggedMeeting;

    // Check for conflicts
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!targetRoom) {
      setDraggedMeeting(null);
      setDragHoverRoom(null);
      return;
    }

    // Note: We allow dropping even if room capacity is insufficient
    // The room will show a warning color (red) during drag

    // Check for conflicts at target location - don't skip any meetings since this is a different room
    const hasConflictAtTarget = targetRoom.meetings.some(existingMeeting => {
      const meetingStart = targetTimeSlot;
      const meetingEnd = targetTimeSlot + meeting.duration;
      const existingStart = existingMeeting.startTime;
      const existingEnd = existingMeeting.startTime + existingMeeting.duration;

      // Check for overlap
      const hasOverlap = !(meetingEnd <= existingStart || meetingStart >= existingEnd);

      return hasOverlap;
    });



    if (hasConflictAtTarget) {
      // Find the conflicted meeting
      const conflictedMeeting = targetRoom.meetings.find(existingMeeting => {
        const endTime = existingMeeting.startTime + existingMeeting.duration;
        const newEndTime = targetTimeSlot + meeting.duration;

        return !(targetTimeSlot >= endTime || newEndTime <= existingMeeting.startTime);
      });

      if (conflictedMeeting) {
        // Find alternative rooms for the conflicted meeting


        const alternatives = findAlternativeRooms(conflictedMeeting, targetRoomId, conflictedMeeting.startTime);



        if (alternatives.length === 0) {
          // No alternatives available - show error and cancel drop
          const conflictedMeetingTitle = conflictedMeeting.title;
          const conflictedRoomName = targetRoom.name;
          toast.error(
            `Cannot move meeting here. "${conflictedMeetingTitle}" is currently in ${conflictedRoomName} and there are no available rooms with suitable capacity and features to relocate it.`,
            { duration: 5000 }
          );
          setDraggedMeeting(null);
          return;
        }

        // Set up conflict resolution with multiple options
        setIsFirstConflictLoad(true); // Reset for new conflict resolution
        setConflictResolution({
          autoMovedMeeting: {
            meeting: conflictedMeeting,
            sourceRoomId: targetRoomId,
            targetTimeSlot: conflictedMeeting.startTime
          },
          draggedMeeting: {
            meeting,
            sourceRoomId,
            targetRoomId,
            targetTimeSlot
          },
          availableOptions: alternatives,
          currentOptionIndex: 0,
          currentConfirmation: 'auto-moved'
        });

        // Clear drag state and tooltip
        setDraggedMeeting(null);
        setDragHoverRoom(null);
        return;
      }

      // No specific conflicted meeting found (shouldn't happen)
      setDraggedMeeting(null);
      setDragHoverRoom(null);
      return;
    }

    if (isPreview) {
      // Update meeting preview and form
      setMeetingPreview({
        roomId: targetRoomId,
        startTime: targetTimeSlot,
        duration: meeting.duration,
        title: meeting.title
      });

      // Update the form in the sidebar by calling the preview update
      handleMeetingPreviewUpdate({
        roomIds: [targetRoomId],
        startTime: targetTimeSlot
      });
    } else {
      // Create pending move for confirmation
      setPendingMove({
        meeting,
        sourceRoomId,
        targetRoomId,
        targetTimeSlot,
        isPreview
      });
    }

    // Clear drag state and tooltip
    setDraggedMeeting(null);
    setDragHoverRoom(null);
  };

  const handleDragEnd = () => {
    // Clear drag state and tooltip
    setDraggedMeeting(null);
    setDragHoverRoom(null);
  };

  // Handle confirming a pending move
  const handleConfirmMove = () => {
    if (!pendingMove) return;

    const { meeting, targetRoomId, targetTimeSlot } = pendingMove;

    // Check if target room is request-only
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    const isRequestOnly = targetRoom?.requestOnly === true;

    // Update existing meeting
    const updatedMeeting = {
      ...meeting,
      startTime: targetTimeSlot,
      pendingApproval: isRequestOnly ? true : meeting.pendingApproval
    };

    if (onEditMeeting) {
      onEditMeeting(updatedMeeting, [targetRoomId]);
    }

    // Start syncing state for this meeting
    setLocalSyncingMeetings(prev => new Set(prev).add(meeting.id));

    // Clear syncing state after 4 seconds and show success toast
    setTimeout(() => {
      setLocalSyncingMeetings(prev => {
        const newSet = new Set(prev);
        newSet.delete(meeting.id);
        return newSet;
      });

      // Show appropriate success toast
      if (isRequestOnly) {
        toast.success("Meeting move request sent for approval.", {
          duration: 3000,
        });
      } else {
        toast.success("Meeting successfully moved and synced.", {
          duration: 3000,
        });
      }
    }, 4000);

    // Clear pending move
    setPendingMove(null);


  };

  // Handle canceling a pending move
  const handleCancelMove = () => {
    // Simply clear the pending move, meeting will return to original position
    setPendingMove(null);
  };

  // Handle confirming both moves in conflict resolution workflow
  const handleConfirmConflictMove = () => {
    if (!conflictResolution) return;

    // Execute both moves in a single action
    const { meeting: autoMovedMeeting, targetTimeSlot: autoMovedTimeSlot } = conflictResolution.autoMovedMeeting;
    const { meeting: draggedMeeting, targetRoomId, targetTimeSlot: draggedTimeSlot } = conflictResolution.draggedMeeting;
    const selectedOption = conflictResolution.availableOptions[conflictResolution.currentOptionIndex];

    // Update the auto-moved (conflicted) meeting
    const updatedAutoMovedMeeting = {
      ...autoMovedMeeting,
      startTime: autoMovedTimeSlot
    };

    // Update the dragged (original) meeting
    const updatedDraggedMeeting = {
      ...draggedMeeting,
      startTime: draggedTimeSlot
    };

    if (onEditMeeting) {
      // Move the conflicted meeting to the selected alternative room
      onEditMeeting(updatedAutoMovedMeeting, [selectedOption.roomId]);

      // Move the original meeting to its target location
      onEditMeeting(updatedDraggedMeeting, [targetRoomId]);
    }

    // Start syncing state for both meetings
    setLocalSyncingMeetings(prev => {
      const newSet = new Set(prev);
      newSet.add(autoMovedMeeting.id);
      newSet.add(draggedMeeting.id);
      return newSet;
    });

    // Clear conflict resolution
    setConflictResolution(null);

    // Clear syncing state and show success toast after loading animations complete
    setTimeout(() => {
      setLocalSyncingMeetings(prev => {
        const newSet = new Set(prev);
        newSet.delete(autoMovedMeeting.id);
        newSet.delete(draggedMeeting.id);
        return newSet;
      });

      // Show single consolidated success toast after animations finish
      const alternativeRoom = selectedOption;
      const draggedRoomName = allRooms.find(room => room.id === targetRoomId)?.name || 'the selected room';

      toast.success(
        `Both meetings moved successfully! "${autoMovedMeeting.title}" → ${alternativeRoom.roomName}, "${draggedMeeting.title}" → ${draggedRoomName}`,
        {
          duration: 4000,
          className: 'toast-custom toast-success-custom'
        }
      );
    }, 4000);
  };

  // Handle canceling conflict resolution
  const handleCancelConflictResolution = () => {
    // Clear the entire conflict resolution, both meetings return to original positions
    setConflictResolution(null);
  };

  // Navigate to previous option in conflict resolution (cycles to last item when on first)
  const handlePreviousOption = () => {
    if (!conflictResolution) return;

    setConflictResolution(prev => prev ? {
      ...prev,
      currentOptionIndex: prev.currentOptionIndex <= 0
        ? prev.availableOptions.length - 1
        : prev.currentOptionIndex - 1
    } : null);
  };

  // Navigate to next option in conflict resolution (cycles to first item when on last)
  const handleNextOption = () => {
    if (!conflictResolution) return;

    setConflictResolution(prev => prev ? {
      ...prev,
      currentOptionIndex: prev.currentOptionIndex >= prev.availableOptions.length - 1
        ? 0
        : prev.currentOptionIndex + 1
    } : null);
  };

  // Find alternative rooms for a conflicted meeting
  const findAlternativeRooms = (meeting: Meeting, originalRoomId: string, meetingTime: number) => {
    const originalRoom = rooms.find(r => r.id === originalRoomId);
    if (!originalRoom) {
      return [];
    }

    const alternatives = rooms
      .filter(room => {
        // Don't include the original room
        if (room.id === originalRoomId) return false;

        // Must have sufficient capacity
        if (room.capacity < meeting.attendees) {
          return false;
        }

        // Must not have conflicts at the meeting time
        const meetingStart = meetingTime;
        const meetingEnd = meetingTime + meeting.duration;

        const hasConflict = room.meetings.some(existingMeeting => {
          const existingStart = existingMeeting.startTime;
          const existingEnd = existingMeeting.startTime + existingMeeting.duration;

          // Check for overlap
          return !(meetingEnd <= existingStart || meetingStart >= existingEnd);
        });

        return !hasConflict;
      })
      .map(room => {
        return {
          roomId: room.id,
          roomName: room.name,
          roomCapacity: room.capacity,
          roomFeatures: room.features,
          floor: room.floor
        };
      })
      .sort((a, b) => {
        // Sort by room size proximity - closest size that fits all occupants is best
        // Both rooms can fit the meeting, so prioritize the smallest room that still fits
        const aCapacityDiff = a.roomCapacity - meeting.attendees;
        const bCapacityDiff = b.roomCapacity - meeting.attendees;

        // If both have the same excess capacity, prefer smaller room
        if (aCapacityDiff === bCapacityDiff) {
          return a.roomCapacity - b.roomCapacity;
        }

        // Otherwise, prefer the room with less excess capacity (closer fit)
        return aCapacityDiff - bCapacityDiff;
      })
      .slice(0, 3); // Return only top 3 options

    return alternatives;
  };





  // Helper function to format time for display
  const formatTimeSlot = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  // Helper function to get room name by ID
  const getRoomName = (roomId: string) => {
    const room = updatedRooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  // Handle drag start from grab handle
  const handleGrabHandleDragStart = (e: React.DragEvent, meeting: any, roomId: string) => {
    // Prevent dragging past meetings
    if (isMeetingPast(meeting)) {
      e.preventDefault();
      return;
    }

    e.stopPropagation();

    // Find the parent meeting block element to get content and styling
    const meetingBlock = e.currentTarget.closest('.meeting-block') as HTMLElement;
    if (meetingBlock) {
      // Create a properly sized drag image container
      const dragImage = document.createElement('div');

      // Copy the meeting content but with fixed dimensions
      const meetingColor = meetingBlock.className.match(/(bg-\w+-\d+)/)?.[0] || 'bg-[#2774C1]';
      dragImage.className = `${meetingColor} rounded px-2 text-white flex items-center`;
      dragImage.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: ${meetingBlock.offsetWidth}px;
        height: 40px;
        transform: rotate(2deg);
        opacity: 0.8;
        pointer-events: none;
        z-index: 9999;
        font-family: ${getComputedStyle(meetingBlock).fontFamily};
      `;

      // Copy the inner content
      const contentDiv = meetingBlock.querySelector('.min-w-0.flex-1');
      if (contentDiv) {
        dragImage.innerHTML = contentDiv.outerHTML;
      }

      // Temporarily add to document
      document.body.appendChild(dragImage);

      // Set the custom drag image with cursor positioned over the grab handle
      // Grab handle is positioned at: left padding (8px) + half of grip icon width (8px) = 16px from left
      const handleXOffset = 16;
      const handleYOffset = dragImage.offsetHeight / 2;
      e.dataTransfer.setDragImage(dragImage, handleXOffset, handleYOffset);

      // Clean up the temporary element after drag starts
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 0);
    }

    handleDragStart(e, meeting, roomId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[#72B433]';
      case 'occupied':
        return 'bg-[#E81C1C]';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMeetingColor = (meeting: Meeting, index: number) => {
    // Calculate current time in hours (use demo override if available)
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }

    // Check if meeting has ended (is in the past)
    const meetingEndTime = meeting.startTime + meeting.duration;
    const isPastMeeting = meetingEndTime <= currentHourFloat;

    // Check if meeting is currently happening
    const isCurrentMeeting = meeting.startTime <= currentHourFloat && meetingEndTime > currentHourFloat;

    // AI-created meetings have different gradients based on time status
    if (meeting.aiCreated) {
      if (isPastMeeting) {
        // Past AI meetings: subtle gray gradient for white text legibility
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      } else if (isCurrentMeeting) {
        // Current AI meetings: bright gradient
        return 'bg-gradient-to-r from-primary to-blue-600';
      } else {
        // Future AI meetings: light gradient for blue text
        return 'bg-gradient-to-r from-pink-100 to-blue-100';
      }
    }

    // Gray for past meetings (unless it's a special type that needs its own styling)
    if (isPastMeeting) {
      // Light blue for pending approval meetings (even if past)
      if (meeting.pendingApproval) {
        return 'bg-[#F0FAFF]';
      }
      // Gray for all other past meetings
      return 'bg-gray-400';
    }

    // Light blue for pending approval meetings
    if (meeting.pendingApproval) {
      return 'bg-[#F0FAFF]';
    }
    // Pink color for relocated meetings
    if (meeting.id.includes('-relocated')) {
      return 'bg-[#BE1F77]';
    }
    // Current meetings: dark blue
    if (isCurrentMeeting) {
      return 'bg-[#2774C1]';
    }
    // Future meetings (haven't started yet): light blue
    return 'bg-[#D6E9FF]';
  };

  // Calculate current time line position
  const getCurrentTimeLinePosition = () => {
    let currentHourFloat: number;

    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      // Use demo time override for demo purposes
      currentHourFloat = demoTimeOverride;
    } else {
      // Use actual current time
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }

    // Calculate position relative to the full 24-hour grid (0-100%)
    // The grid spans the full 24 hours, and the visible portion is controlled by the transform
    const position = (currentHourFloat / 24) * 100;

    // Always return the position - it will be visible if it's in the scrolled viewport
    return position;
  };

  // Handle dragging the time line for demo purposes
  const handleTimeLineDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingTime(true);
  };

  const handleTimeLineDrag = (e: MouseEvent, gridElement: HTMLElement) => {
    if (!isDraggingTime) return;

    const rect = gridElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentX = (x / rect.width) * 100;

    // Convert percent to hour (0-24)
    const newHour = (percentX / 100) * 24;

    // Clamp to valid range
    const clampedHour = Math.max(0, Math.min(23.99, newHour));

    if (onDemoTimeOverrideChange) {
      onDemoTimeOverrideChange(clampedHour);
    }
  };

  const handleTimeLineDragEnd = () => {
    setIsDraggingTime(false);
  };

  // Set up global mouse move/up handlers for time line dragging
  useEffect(() => {
    if (!isDraggingTime) return;

    const gridElement = document.querySelector('[data-time-grid="true"]') as HTMLElement;
    if (!gridElement) return;

    const handleMouseMove = (e: MouseEvent) => handleTimeLineDrag(e, gridElement);
    const handleMouseUp = () => handleTimeLineDragEnd();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTime]);

  // Check if a time slot has a meeting conflict
  const hasConflict = (room: Room, timeSlot: number) => {
    return room.meetings.some(meeting => {
      const meetingStart = meeting.startTime;
      const meetingEnd = meeting.startTime + meeting.duration;
      return timeSlot >= meetingStart && timeSlot < meetingEnd;
    });
  };

  // Handle creating a new meeting
  const handleCreateMeeting = (roomId: string, timeSlot: number) => {
    if (onCreateMeeting) {
      onCreateMeeting(roomId, timeSlot);
    }
  };

  const timeLinePosition = getCurrentTimeLinePosition();

  // Function to check if a room is currently occupied
  const isRoomOccupied = (room: Room) => {
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }

    return room.meetings.some(meeting => {
      const meetingStart = meeting.startTime;
      const meetingEnd = meeting.startTime + meeting.duration;
      return currentHourFloat >= meetingStart && currentHourFloat < meetingEnd;
    });
  };

  // Function to check if a room is currently occupied AND has been checked into
  const isRoomCheckedIn = (room: Room) => {
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const hour = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }

    return room.meetings.some(meeting => {
      const meetingStart = meeting.startTime;
      const meetingEnd = meeting.startTime + meeting.duration;
      const isCurrentMeeting = currentHourFloat >= meetingStart && currentHourFloat < meetingEnd;
      return isCurrentMeeting && meeting.checkedIn;
    });
  };

  // Function to check if a room can accommodate a meeting (capacity and time availability)
  const canRoomAccommodateMeeting = (room: Room, meeting: Meeting, excludeRoomId?: string) => {
    // Check capacity
    if (room.capacity < meeting.attendees) return false;

    // Check time availability - no conflicts with existing meetings
    const meetingStart = meeting.startTime;
    const meetingEnd = meeting.startTime + meeting.duration;

    const hasConflict = room.meetings.some(existingMeeting => {
      const existingStart = existingMeeting.startTime;
      const existingEnd = existingMeeting.startTime + existingMeeting.duration;

      // Check for overlap
      return !(meetingEnd <= existingStart || meetingStart >= existingEnd);
    });

    return !hasConflict;
  };

  // Function to check if a meeting can be placed at a specific time slot
  const canPlaceMeeting = (room: Room, meeting: { startTime: number; duration: number; id?: string }) => {
    const meetingStart = meeting.startTime;
    const meetingEnd = meeting.startTime + meeting.duration;

    const hasConflict = room.meetings.some(existingMeeting => {
      // Skip checking against the same meeting if it's being moved
      if (meeting.id && existingMeeting.id === meeting.id) return false;

      const existingStart = existingMeeting.startTime;
      const existingEnd = existingMeeting.startTime + existingMeeting.duration;

      // Check for overlap
      return !(meetingEnd <= existingStart || meetingStart >= existingEnd);
    });

    return !hasConflict;
  };

  // Function to check if a room has insufficient capacity for the dragged meeting
  const hasInsufficientCapacity = (room: Room) => {
    return draggedMeeting && draggedMeeting.meeting.attendees > room.capacity;
  };

  // Function to relocate meetings from Conference Room B when it goes offline
  const relocateMeetingsFromOfflineRoom = (roomsArray: Room[]) => {
    if (!hasAvIssueOccurred) return roomsArray;

    const confRoomB = roomsArray.find(room => room.id === 'conf-b');
    if (!confRoomB || confRoomB.meetings.length === 0) return roomsArray;

    const meetingsToRelocate = [...confRoomB.meetings];
    const updatedRoomsArray = [...roomsArray];

    // Remove meetings from Conference Room B
    const confRoomBIndex = updatedRoomsArray.findIndex(room => room.id === 'conf-b');
    if (confRoomBIndex !== -1) {
      updatedRoomsArray[confRoomBIndex] = {
        ...updatedRoomsArray[confRoomBIndex],
        meetings: [],
        status: 'offline' as const
      };
    }

    // Find new rooms for each meeting
    meetingsToRelocate.forEach(meeting => {
      for (let i = 0; i < updatedRoomsArray.length; i++) {
        const room = updatedRoomsArray[i];

        // Skip Conference Room B and offline rooms
        if (room.id === 'conf-b' || room.status === 'offline') continue;

        if (canRoomAccommodateMeeting(room, meeting)) {
          // Add meeting to this room
          updatedRoomsArray[i] = {
            ...room,
            meetings: [...room.meetings, {
              ...meeting,
              id: `${meeting.id}-relocated`
            }]
          };
          break; // Found a room, move to next meeting
        }
      }
    });

    return updatedRoomsArray;
  };

  // Apply meeting relocation first, then update statuses
  const roomsWithRelocatedMeetings = relocateMeetingsFromOfflineRoom(rooms);

  // Update room statuses based on current time
  const updatedRooms = roomsWithRelocatedMeetings.map(room => {
    // ✅ PRESERVE MANUALLY-SET OFFLINE STATUS
    // If a room is already offline (set via toggle), keep it offline
    if (room.status === 'offline') {
      return { ...room, status: 'offline' as const };
    }

    // Keep offline status for Conference Room B if AV issue occurred (legacy)
    if (room.id === 'conf-b' && hasAvIssueOccurred) {
      return { ...room, status: 'offline' as const };
    }

    // Otherwise, determine status based on active meetings
    const hasActiveMeeting = isRoomOccupied(room);
    return {
      ...room,
      status: hasActiveMeeting ? 'occupied' as const : 'available' as const
    };
  });

  // Group rooms by floor, excluding pinned rooms from their normal positions
  const groupedRooms = updatedRooms.reduce((acc, room) => {
    // Skip pinned rooms - they only appear in the Pinned Spaces section
    if (normalizedPinnedRoomIds.includes(room.id)) {
      return acc;
    }

    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(groupedRooms).map(Number).sort((a, b) => a - b);

  return (
    <PageLayout
      notifications={notifications}
      hasUnreadNotifications={hasUnreadNotifications}
      onNotificationClick={onNotificationClick}
      onNotificationPopoverClose={onNotificationPopoverClose}
      pageTitle="Meeting Spaces"
      aiAssistantMessages={aiAssistantMessages}
      onAiAssistantMessagesUpdate={onAiAssistantMessagesUpdate}
      chatHistory={chatHistory}
      onLoadChatFromHistory={onLoadChatFromHistory}
      onStartNewChat={onStartNewChat}
      selectedMeetingDetails={selectedMeetingDetails}
      onCloseMeetingDetails={onCloseMeetingDetails}
      onOpenMeetingDetails={onOpenMeetingDetails}
      onClearMeetingDetails={onClearMeetingDetails}
      onDeleteMeeting={onDeleteMeeting}
      onEditMeeting={onEditMeeting}
      allRooms={updatedRooms}
      activeFilters={activeFilters}
      onFiltersChange={onFiltersChange}
      meetingCreationContext={meetingCreationContext}
      onSaveNewMeeting={onSaveNewMeeting}
      onCancelMeetingCreation={onCancelMeetingCreation}
      onMeetingPreviewUpdate={handleMeetingPreviewUpdate}
      spotlightMyEvents={spotlightMyEvents}
      onSpotlightMyEventsChange={onSpotlightMyEventsChange}
      compactView={compactView}
      onCompactViewChange={onCompactViewChange}
      selectedTimezones={selectedTimezones}
      onSelectedTimezonesChange={onSelectedTimezonesChange}
      selectedRoomDetails={selectedRoomDetails}
      onOpenRoomDetails={onOpenRoomDetails}
      onCloseRoomDetails={onCloseRoomDetails}
      onClearRoomDetails={onClearRoomDetails}
      onBackFromRoomDetails={onBackFromRoomDetails}
      showRoomDetailsBackButton={showRoomDetailsBackButton}
      onCreateMeeting={onCreateMeeting}
      aiMeetingPreview={aiMeetingPreview}
      onHighlightRoom={onHighlightRoom}
      onAiMeetingPreviewUpdate={onAiMeetingPreviewUpdate}
      onSelectRoom={onSelectRoom}
      onAddDetails={onAddDetails}
      onMeetingSelectedForCatering={onMeetingSelectedForCatering}
      cateringOrderDetails={cateringOrderDetails}
      onCateringOrderUpdate={onCateringOrderUpdate}
      cateringOrderSubmitted={cateringOrderSubmitted}
      onCateringOrderSubmittedChange={onCateringOrderSubmittedChange}
      onCreateServiceTicket={onCreateServiceTicket}
      onNavigateToTicket={onNavigateToTicket}
      cateringTicketNumber={cateringTicketNumber}
      onCateringTicketNumberChange={onCateringTicketNumberChange}
      timeWindowStart={timeWindowStart}
      onTimeWindowPrevious={onTimeWindowPrevious}
      onTimeWindowNext={onTimeWindowNext}
      onTimeWindowNow={onTimeWindowNow}
      meetingSpacesViewMode={meetingSpacesViewMode}
      onMeetingSpacesViewModeChange={onMeetingSpacesViewModeChange}
      selectedMonthViewRoom={selectedMonthViewRoom}
      onSelectedMonthViewRoomChange={onSelectedMonthViewRoomChange}
      onToggleRoomOffline={onToggleRoomOffline}
    >


      {/* Week View */}
      {meetingSpacesViewMode === 'week' ? (
        <WeekView
          rooms={updatedRooms}
          onOpenMeetingDetails={handleMeetingClick}
          pinnedRoomIds={normalizedPinnedRoomIds}
          onTogglePin={onTogglePin || (() => { })}
          onOpenRoomDetails={onOpenRoomDetails || (() => { })}
          compactView={compactView}
          selectedTimezones={selectedTimezones}
        />
      ) : meetingSpacesViewMode === 'month' && selectedMonthViewRoom ? (
        <MonthView
          room={updatedRooms.find(r => r.id === selectedMonthViewRoom)}
          allRooms={updatedRooms}
          onOpenMeetingDetails={handleMeetingClick}
          onCreateMeeting={handleCreateMeeting}
          demoTimeOverride={demoTimeOverride}
          onNavigateToDayView={() => {
            onMeetingSpacesViewModeChange?.('day');
          }}
        />
      ) : (
        /* Default Day Grid View */
        <div className="flex h-full flex-col relative">
          {/* Fixed vertical divider line */}
          <div className="absolute left-60 max-[600px]:left-32 top-0 bottom-0 w-px bg-[#D9D9D9] z-10 pointer-events-none" />

          {/* Fixed Headers */}
          <div className="flex border-b border-[#D6D6D6] shadow-sm bg-white relative z-20">
            {/* Left Sidebar Header with Timezone Labels and Time Navigation */}
            <div className="w-60 max-[600px]:w-32 bg-white flex flex-col justify-center">
              <div className="flex items-center justify-between px-[16px] max-[600px]:px-2 py-2 max-[600px]:py-1">
                {/* Time Navigation Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={onTimeWindowPrevious}
                    className="h-7 w-7 flex items-center justify-center rounded border border-[#868686] hover:bg-gray-100 transition-colors"
                    aria-label="Previous time window"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3 text-gray-600" />
                  </button>
                  <button
                    onClick={onTimeWindowNext}
                    className="h-7 w-7 flex items-center justify-center rounded border border-[#868686] hover:bg-gray-100 transition-colors"
                    aria-label="Next time window"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-600" />
                  </button>
                  {demoTimeOverride !== null && demoTimeOverride !== undefined && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onDemoTimeOverrideChange?.(null)}
                            className="h-7 px-2 flex items-center justify-center rounded bg-[#E81C1C] hover:bg-[#c01616] text-white transition-colors text-xs"
                            aria-label="Reset to current time"
                          >
                            Reset Time
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Exit demo mode and return to current time</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Timezone Labels */}
                <div className="text-right flex flex-col justify-center">
                  {selectedTimezones.map((timezone, index) => {
                    const tzAbbr = timezone === 'America/Los_Angeles' ? 'PST' :
                      timezone === 'America/Denver' ? 'MST' :
                        timezone === 'America/Chicago' ? 'CST' :
                          timezone === 'America/New_York' ? 'EST' :
                            timezone === 'Europe/London' ? 'GMT' :
                              timezone === 'Europe/Paris' ? 'CET' :
                                timezone === 'Asia/Tokyo' ? 'JST' :
                                  timezone === 'Asia/Shanghai' ? 'CST' :
                                    timezone === 'Asia/Dubai' ? 'GST' :
                                      timezone === 'Australia/Sydney' ? 'AEST' :
                                        timezone;

                    return (
                      <div key={timezone} className={index > 0 ? 'mt-2' : ''} style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.5', color: 'rgba(0,0,0,0.75)' }}>
                        {tzAbbr}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Header with Multiple Timezone Rows - Full 24 hours, 11 visible at a time */}
            <div className="flex-1 bg-white overflow-hidden h-full">
              <div className="grid gap-0 h-full transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]" style={{
                gridTemplateColumns: 'repeat(48, minmax(0, 1fr))',
                width: `${(24 / 11) * 100}%`, // Full 24-hour grid, but only 11 hours visible
                transform: `translateX(-${(timeWindowStart / 24) * 100}%)`
              }}>
                {hourLabels.map((time, hourIndex) => {
                  // Each hour label spans 2 columns (matching the 2 half-hour slots per hour)
                  const colSpan = 'col-span-2';

                  return (
                    <div key={time} className={`text-center ${colSpan} ${hourIndex !== 0 ? 'border-l border-[#D6D6D6]' : ''} flex flex-col justify-center items-center h-full`}>
                      {selectedTimezones.map((timezone, tzIndex) => {
                        // Calculate time offset for different timezones
                        // Base timezone is the FIRST selected timezone (user's local time)
                        const getTimezoneOffset = (tz: string): number => {
                          // UTC offsets in hours (standard time, not accounting for DST)
                          if (tz === 'America/Los_Angeles') return -8;
                          if (tz === 'America/Denver') return -7;
                          if (tz === 'America/Chicago') return -6;
                          if (tz === 'America/New_York') return -5;
                          if (tz === 'Europe/London') return 0;
                          if (tz === 'Europe/Paris') return 1;
                          if (tz === 'Asia/Tokyo') return 9;
                          if (tz === 'Asia/Shanghai') return 8;
                          if (tz === 'Asia/Dubai') return 4;
                          if (tz === 'Australia/Sydney') return 11;
                          return 0;
                        };

                        // Calculate offset relative to the first selected timezone
                        const baseTimezoneOffset = getTimezoneOffset(selectedTimezones[0]);
                        const currentTimezoneOffset = getTimezoneOffset(timezone);
                        const offset = currentTimezoneOffset - baseTimezoneOffset;
                        const hour = parseInt(time.replace(/[AP]M/, ''));
                        const isPM = time.includes('PM');
                        let adjustedHour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;
                        adjustedHour = (adjustedHour + offset) % 24;

                        const displayHour = adjustedHour === 0 ? 12 : adjustedHour > 12 ? adjustedHour - 12 : adjustedHour;
                        const displayPeriod = adjustedHour >= 12 ? 'PM' : 'AM';
                        const displayTime = `${displayHour}${displayPeriod}`;

                        return (
                          <div key={timezone} className={tzIndex > 0 ? 'mt-2' : ''} style={{ fontSize: '12px', fontWeight: 500, lineHeight: '1.5', color: 'rgba(0,0,0,0.75)' }}>
                            {displayTime}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Synchronized Scrolling Content */}
          <div className="flex flex-1 overflow-auto scrollbar-overlay relative">
            {/* Left Sidebar - Rooms by Floor */}
            <div className="w-60 max-[600px]:w-32 bg-gray-50 flex-shrink-0 relative z-10">
              <div className="p-[0px]">
                {/* Pinned Spaces Section */}
                {normalizedPinnedRoomIds.length > 0 && (
                  <div>
                    {/* Pinned Spaces Header */}
                    <button
                      onClick={() => setIsPinnedExpanded(!isPinnedExpanded)}
                      className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors border-b border-[#D6D6D6] h-10 pl-2 pr-[16px] max-[600px]:px-2"
                    >
                      <div className="flex items-center">
                        <div className="text-[rgba(0,0,0,0.95)] max-[600px]:text-xs ml-4" style={{ fontSize: '14px', fontWeight: 700 }}>Pinned Spaces</div>
                      </div>
                      {isPinnedExpanded ? (
                        <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                      ) : (
                        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                      )}
                    </button>

                    {/* Pinned Rooms List */}
                    {isPinnedExpanded && (
                      <div>
                        {normalizedPinnedRoomIds.map(roomId => {
                          const room = updatedRooms.find(r => r.id === roomId);
                          if (!room) return null;

                          const roomHasInsufficientCapacity = hasInsufficientCapacity(room);
                          const hasExcessCapacity = draggedMeeting &&
                            (room.capacity - draggedMeeting.meeting.attendees) > 4;
                          const isRequestOnlyRoom = room.requestOnly === true;
                          const isRestricted = isRoomRestricted(room);
                          const isOffline = room.status === 'offline';

                          // Determine background color: offline rooms get same red as restricted rooms, other constraint violations get yellow
                          const hasAnyConstraint = isRequestOnlyRoom || roomHasInsufficientCapacity || hasExcessCapacity;
                          const sidebarRowBgColor = isOffline
                            ? 'bg-[#FFD6D6] hover:bg-[#ffbbbb]'
                            : draggedMeeting
                              ? (isRestricted ? 'bg-[#FFD6D6] hover:bg-[#ffbbbb]' : hasAnyConstraint ? 'bg-[#FFFCF0] hover:bg-[#fff8e1]' : 'hover:bg-blue-50')
                              : (roomHasInsufficientCapacity ? 'bg-[#FFFCF0] hover:bg-[#fff8e1]' : 'hover:bg-blue-50');

                          return (
                            <div
                              key={room.id}
                              className={`border-b border-[#D6D6D6] flex items-center transition-colors pl-2 pr-2 max-[600px]:px-2 ${sidebarRowBgColor} ${compactView ? 'h-10' : 'h-16'} group`}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <RoomPreviewPopover room={room}>
                                    <div
                                      className="cursor-pointer"
                                      onClick={() => onOpenRoomDetails?.(room)}
                                    >
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-1 min-w-0">
                                          {isRestricted ? (
                                            <FontAwesomeIcon
                                              icon={faBan}
                                              className="text-gray-400 flex-shrink-0"
                                              style={{ width: '12px', height: '12px' }}
                                            />
                                          ) : room.requestOnly && (
                                            <FontAwesomeIcon
                                              icon={faLock}
                                              className="text-gray-400 flex-shrink-0"
                                              style={{ width: '12px', height: '12px' }}
                                            />
                                          )}
                                          <div className="flex items-center gap-1 min-w-0">
                                            <div className={`text-sm max-[600px]:text-xs text-[rgba(0,0,0,0.95)] truncate ${!isRestricted && !room.requestOnly ? 'ml-4' : ''}`} style={{ fontWeight: 400 }}>
                                              {room.name}
                                            </div>
                                            {room.status === 'offline' && (
                                              <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 flex-shrink-0">
                                                Offline
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        {!compactView && (
                                          <div className="text-xs max-[600px]:hidden text-[rgba(0,0,0,0.75)] flex items-center mt-1 ml-4">
                                            <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                                            {room.capacity} people
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </RoomPreviewPopover>
                                </div>
                                <div className="flex items-center justify-center flex-shrink-0 max-[600px]:hidden w-8">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTogglePin?.(room.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <span className="fa-layers fa-fw w-4 h-4">
                                      <FontAwesomeIcon icon={faThumbtack} className="text-[#2774C1]" />
                                      <FontAwesomeIcon icon={faSlash} className="text-[#2774C1]" />
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {floors.map(floor => (
                  <div key={floor}>
                    {/* Floor Header */}
                    <button
                      onClick={() => toggleFloor(floor)}
                      className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors border-b border-[#D6D6D6] h-10 pl-2 pr-[16px] max-[600px]:px-2"
                    >
                      <div className="flex items-center">
                        <div className="text-[rgba(0,0,0,0.95)] max-[600px]:text-xs ml-4" style={{ fontSize: '14px', fontWeight: 700 }}>Floor {floor}</div>
                      </div>
                      {expandedFloors.has(floor) ? (
                        <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                      ) : (
                        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 max-[600px]:w-3 max-[600px]:h-3 text-[rgba(0,0,0,0.55)]" />
                      )}
                    </button>

                    {/* Room List */}
                    {expandedFloors.has(floor) && (
                      <div>
                        {groupedRooms[floor].map(room => {
                          const roomHasInsufficientCapacity = hasInsufficientCapacity(room);
                          const isPinned = normalizedPinnedRoomIds.includes(room.id);
                          const hasExcessCapacity = draggedMeeting &&
                            (room.capacity - draggedMeeting.meeting.attendees) > 4;
                          const isRequestOnlyRoom = room.requestOnly === true;
                          const isRestricted = isRoomRestricted(room);
                          const isOffline = room.status === 'offline';

                          // Determine background color: offline rooms get same red as restricted rooms, other constraint violations get yellow
                          const hasAnyConstraint = isRequestOnlyRoom || roomHasInsufficientCapacity || hasExcessCapacity;
                          const sidebarRowBgColor = isOffline
                            ? 'bg-[#FFD6D6] hover:bg-[#ffbbbb]'
                            : draggedMeeting
                              ? (isRestricted ? 'bg-[#FFD6D6] hover:bg-[#ffbbbb]' : hasAnyConstraint ? 'bg-[#FFFCF0] hover:bg-[#fff8e1]' : 'hover:bg-blue-50')
                              : (roomHasInsufficientCapacity ? 'bg-[#FFFCF0] hover:bg-[#fff8e1]' : 'hover:bg-blue-50');

                          return (
                            <div
                              key={room.id}
                              className={`border-b border-[#D6D6D6] flex items-center transition-colors pl-2 pr-2 max-[600px]:px-2 ${sidebarRowBgColor} ${compactView ? 'h-10' : 'h-16'} group`}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <RoomPreviewPopover room={room}>
                                    <div
                                      className="cursor-pointer"
                                      onClick={() => onOpenRoomDetails?.(room)}
                                    >
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-1 min-w-0">
                                          {isRestricted ? (
                                            <FontAwesomeIcon
                                              icon={faBan}
                                              className="text-gray-400 flex-shrink-0"
                                              style={{ width: '12px', height: '12px' }}
                                            />
                                          ) : room.requestOnly && (
                                            <FontAwesomeIcon
                                              icon={faLock}
                                              className="text-gray-400 flex-shrink-0"
                                              style={{ width: '12px', height: '12px' }}
                                            />
                                          )}
                                          <div className="flex items-center gap-1 min-w-0">
                                            <div className={`text-sm max-[600px]:text-xs text-[rgba(0,0,0,0.95)] truncate ${!isRestricted && !room.requestOnly ? 'ml-4' : ''}`} style={{ fontWeight: 400 }}>
                                              {room.name}
                                            </div>
                                            {room.status === 'offline' && (
                                              <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 flex-shrink-0">
                                                Offline
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        {!compactView && (
                                          <div className="text-xs max-[600px]:hidden text-[rgba(0,0,0,0.75)] flex items-center mt-1 ml-4">
                                            <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                                            {room.capacity} people
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </RoomPreviewPopover>
                                </div>
                                <div className="flex items-center justify-center flex-shrink-0 max-[600px]:hidden w-8">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onTogglePin?.(room.id);
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <FontAwesomeIcon
                                      icon={faThumbtack}
                                      className="w-4 h-4 text-gray-400"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Grid Area - Full 24 hours with smooth scrolling, 11 visible at a time */}
            <div className="flex-1 bg-gray-50 relative overflow-hidden">
              <div
                data-time-grid="true"
                className="absolute inset-0 bg-gray-50 transition-transform duration-[1000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{
                  width: `${(24 / 11) * 100}%`, // Full 24-hour grid, but only 11 hours visible
                  transform: `translateX(-${(timeWindowStart / 24) * 100}%)`
                }}
              >
                {/* Current Time Line - Draggable for demo purposes */}
                {timeLinePosition !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#E81C1C] z-10 pointer-events-auto group"
                    style={{ left: `${timeLinePosition}%` }}
                    onMouseDown={handleTimeLineDragStart}
                  >
                    <div
                      className={`absolute -top-2 -left-3 w-6 h-4 bg-[#E81C1C] rounded-sm flex items-center justify-center ${isDraggingTime ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-110'} transition-transform`}
                      title="Drag to change time (demo mode)"
                    >
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    {/* Time display when in demo mode or dragging */}
                    {(isDraggingTime || (demoTimeOverride !== null && demoTimeOverride !== undefined)) && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#E81C1C] text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                        {(() => {
                          const hours = Math.floor(demoTimeOverride || 0);
                          const minutes = Math.round(((demoTimeOverride || 0) - hours) * 60);
                          const period = hours >= 12 ? 'PM' : 'AM';
                          const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                          return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                        })()}
                      </div>
                    )}
                    {/* Draggable handle extends full height */}
                    <div className={`absolute inset-0 ${isDraggingTime ? 'cursor-grabbing' : 'cursor-grab'}`} />
                  </div>
                )}
                <div className="min-h-full">
                  {/* Pinned Spaces Grid Section */}
                  {normalizedPinnedRoomIds.length > 0 && (
                    <React.Fragment>
                      {/* Pinned Spaces Header Row */}
                      <div className="bg-gray-100 border-b border-[#D6D6D6] p-[0px] h-10"></div>

                      {/* Pinned Room Rows */}
                      {isPinnedExpanded && pinnedRoomIds.map(roomId => {
                        const room = updatedRooms.find(r => r.id === roomId);
                        if (!room) return null;

                        const roomHasInsufficientCapacity = hasInsufficientCapacity(room);

                        // Check if room has more than 4 extra seats when dragging
                        const hasExcessCapacity = draggedMeeting &&
                          (room.capacity - draggedMeeting.meeting.attendees) > 4;

                        // Check if room is request-only
                        const isRequestOnlyRoom = room.requestOnly === true;

                        // Check if room is restricted
                        const isRestricted = isRoomRestricted(room);

                        // Determine background color: offline rooms get same red as restricted rooms, other constraint violations get yellow
                        const hasAnyConstraint = isRequestOnlyRoom || roomHasInsufficientCapacity || hasExcessCapacity;
                        const rowBgColor = room.status === 'offline'
                          ? 'bg-[#FFD6D6]'
                          : draggedMeeting
                            ? (isRestricted ? 'bg-[#FFD6D6]' : hasAnyConstraint ? 'bg-[#FFFCF0]' : 'bg-white')
                            : 'bg-white';

                        return (
                          <div key={room.id} className={`relative border-b border-[#D6D6D6] ${rowBgColor} ${compactView ? 'h-10' : 'h-16'}`}>
                            {/* Interactive Time Slots - Full 24 hours */}
                            <div className="absolute inset-0 grid gap-0" style={{ gridTemplateColumns: 'repeat(48, minmax(0, 1fr))' }}>
                              {timeSlotValues.map((timeValue, index) => {
                                const hasConflictHere = hasConflict(room, timeValue);
                                const isHovered = hoveredTimeSlot?.roomId === room.id && hoveredTimeSlot?.timeSlot === timeValue;
                                const cannotDrop = hasConflictHere || meetingCreationContext || isRestricted;

                                // Office hours: 9am to 5pm (9-17 in 24-hour format)
                                const hour = Math.floor(timeValue);
                                const isClosed = hour < 9 || hour >= 17;

                                return (
                                  <div
                                    key={index}
                                    className={`
                                ${index % 2 === 0 && index !== 0 ? 'border-l border-[#D6D6D6]' : ''} relative h-full
                                ${cannotDrop ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${isClosed ? 'office-closed' : ''}
                              `}
                                    onMouseEnter={() => {
                                      if (!cannotDrop) {
                                        setHoveredTimeSlot({ roomId: room.id, timeSlot: timeValue });
                                      }
                                      // Set drag hover state for tooltips
                                      if (draggedMeeting && !hasConflictHere) {
                                        setDragHoverRoom({
                                          roomId: room.id,
                                          roomCapacity: room.capacity,
                                          hasExcessCapacity: hasExcessCapacity,
                                          hasInsufficientCapacity: roomHasInsufficientCapacity,
                                          isRequestOnly: isRequestOnlyRoom
                                        });
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredTimeSlot(null);
                                      setDragHoverRoom(null);
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!hasConflictHere && !meetingCreationContext) {
                                        handleCreateMeeting(room.id, timeValue);
                                      }
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.dataTransfer.dropEffect = hasConflictHere ? 'none' : 'move';
                                      return false;
                                    }}
                                    onDragEnter={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      return false;
                                    }}
                                    onDragLeave={(e) => {
                                      if (draggedMeeting) {
                                        e.preventDefault();
                                      }
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (!hasConflictHere) {
                                        handleDrop(e, room.id, timeValue);
                                      }
                                    }}
                                  >
                                    {isHovered && !cannotDrop && (
                                      <div className="absolute inset-0 bg-white border-2 border-[#2774C1] border-dashed rounded-sm"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Meeting Blocks */}
                            <TooltipProvider>
                              {room.meetings
                                .filter(meeting => {
                                  if (pendingMove && meeting.id === pendingMove.meeting.id) return false;
                                  if (conflictResolution) {
                                    if (meeting.id === conflictResolution.autoMovedMeeting.meeting.id) return false;
                                    if (meeting.id === conflictResolution.draggedMeeting.meeting.id) return false;
                                  }
                                  return true;
                                })
                                .map((meeting, meetingIndex) => {
                                  const startCol = meeting.startTime * 2;
                                  const widthCols = meeting.duration * 2;
                                  const leftPercent = (startCol / 48) * 100;
                                  const widthPercent = (widthCols / 48) * 100;

                                  const isMyMeeting = meeting.organizer === currentUser || meeting.aiCreated;
                                  const shouldDimMeeting = spotlightMyEvents && !isMyMeeting;

                                  const shouldDimByDuration = activeFilters?.duration !== 'any' &&
                                    activeFilters?.duration &&
                                    (meeting.duration * 60) < parseInt(activeFilters.duration);
                                  const isSyncing = allSyncingMeetings.has(meeting.id);

                                  // Fade all regular meetings to 10% when special interactions are active (after drop, not during drag)
                                  const shouldFadeForInteraction = aiMeetingPreview || pendingMove || conflictResolution;

                                  const meetingElement = (
                                    <div
                                      key={meeting.id}
                                      className={`meeting-block absolute rounded px-2 flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'} ${isSyncing
                                        ? 'text-[#1e4a6b] cursor-not-allowed skeleton-ripple'
                                        : `${getMeetingColor(meeting, meetingIndex)} ${meeting.pendingApproval ? 'text-[#2774C1] border-2 border-[#2774C1]' : isMeetingFuture(meeting) ? 'text-[#2774C1]' : 'text-white'} cursor-pointer hover:opacity-90`
                                        } ${shouldFadeForInteraction ? 'opacity-25' : (shouldDimMeeting || shouldDimByDuration ? 'opacity-25' : '')
                                        }`}
                                      style={{
                                        left: `calc(${leftPercent}% + 5px)`,
                                        width: `calc(${widthPercent}% - 10px)`
                                      }}
                                      onMouseEnter={() => !isSyncing && setHoveredMeeting(meeting.id)}
                                      onMouseLeave={() => !isSyncing && setHoveredMeeting(null)}
                                      onClick={() => !isSyncing && handleMeetingClick(meeting, room)}
                                    >
                                      <div
                                        className={`flex-shrink-0 transition-all duration-200 ${isSyncing || meeting.pendingApproval || isMeetingPast(meeting)
                                          ? 'opacity-0 w-0 mr-0'
                                          : `cursor-grab active:cursor-grabbing ${hoveredMeeting === meeting.id
                                            ? 'opacity-100 w-4 mr-2'
                                            : 'opacity-0 w-0 mr-0'
                                          }`
                                          }`}
                                        draggable={!isSyncing && !meeting.pendingApproval && !isMeetingPast(meeting) && hoveredMeeting === meeting.id}
                                        onDragStart={(e) => !isSyncing && !meeting.pendingApproval && handleGrabHandleDragStart(e, meeting, room.id)}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4" />
                                      </div>

                                      <div className={`min-w-0 flex-1 transition-all duration-200 ${hoveredMeeting === meeting.id ? 'ml-0' : 'ml-0'
                                        }`}>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-medium truncate">{meeting.title}</span>
                                          {meeting.checkedIn && isMeetingCurrent(meeting) && !isSyncing && (
                                            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 flex-shrink-0 text-white" />
                                          )}
                                          {meeting.aiCreated && !isSyncing && (
                                            <FontAwesomeIcon icon={faMagicWandSparkles} className={`w-3 h-3 flex-shrink-0 ${isMeetingFuture(meeting) ? 'text-[#2774C1]' : 'text-white'}`} />
                                          )}
                                          {meeting.id.includes('-relocated') && (
                                            <FontAwesomeIcon icon={faMagicWandSparkles} className="w-3 h-3 text-yellow-300 flex-shrink-0" />
                                          )}
                                          {meeting.pendingApproval && (
                                            <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-[#2774C1] flex-shrink-0" />
                                          )}
                                        </div>
                                        {!compactView && <div className="text-xs opacity-90 truncate">{meeting.organizer}</div>}
                                      </div>
                                    </div>
                                  );

                                  return isSyncing ? (
                                    <Tooltip key={meeting.id}>
                                      <TooltipTrigger asChild>
                                        {meetingElement}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Meeting is syncing. This may take a moment.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : meetingElement;
                                })}
                            </TooltipProvider>

                            {/* AI Meeting Preview for this pinned room */}
                            {aiMeetingPreview && aiMeetingPreview.roomId === room.id && (() => {
                              const startCol = aiMeetingPreview.startTime * 2;
                              const widthCols = aiMeetingPreview.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              return (
                                <div
                                  className={`absolute bg-gradient-to-r from-primary to-blue-600 rounded px-2 text-white flex items-center z-50 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'}`}
                                  style={{
                                    left: `calc(${leftPercent}% + 2px)`,
                                    width: `calc(${widthPercent}% - 4px)`
                                  }}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium truncate">{aiMeetingPreview.title}</div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  )}

                  {floors.map(floor => (
                    <React.Fragment key={`floor-${floor}`}>
                      {/* Floor Header Row - always visible to match sidebar floor button */}
                      <div className="bg-gray-100 border-b border-[#D6D6D6] p-[0px] h-10"></div>

                      {/* Room Rows for this floor - only show if floor is expanded */}
                      {expandedFloors.has(floor) && groupedRooms[floor].map((room, roomIndex) => {
                        const roomHasInsufficientCapacity = hasInsufficientCapacity(room);

                        // Check if room has more than 4 extra seats when dragging
                        const hasExcessCapacity = draggedMeeting &&
                          (room.capacity - draggedMeeting.meeting.attendees) > 4;

                        // Check if room is request-only
                        const isRequestOnlyRoom = room.requestOnly === true;

                        // Check if room is restricted
                        const isRestricted = isRoomRestricted(room);

                        const isOffline = room.status === 'offline';

                        // Determine background color: offline rooms get same red as restricted rooms, other constraint violations get yellow
                        const hasAnyConstraint = isRequestOnlyRoom || roomHasInsufficientCapacity || hasExcessCapacity;
                        const rowBgColor = isOffline
                          ? 'bg-[#FFD6D6]'
                          : draggedMeeting
                            ? (isRestricted ? 'bg-[#FFD6D6]' : hasAnyConstraint ? 'bg-[#FFFCF0]' : 'bg-white')
                            : 'bg-white';

                        return (
                          <div key={room.id} className={`relative border-b border-[#D6D6D6] ${rowBgColor} ${compactView ? 'h-10' : 'h-16'}`}>
                            {/* Interactive Time Slots - Full 24 hours */}
                            <div className="absolute inset-0 grid gap-0" style={{ gridTemplateColumns: 'repeat(48, minmax(0, 1fr))' }}>
                              {timeSlotValues.map((timeValue, index) => {
                                const hasConflictHere = hasConflict(room, timeValue);
                                const isHovered = hoveredTimeSlot?.roomId === room.id && hoveredTimeSlot?.timeSlot === timeValue;
                                // ✅ Prevent interactions if room is offline
                                const cannotDrop = hasConflictHere || meetingCreationContext || isRestricted || isOffline;

                                // Office hours: 9am to 5pm (9-17 in 24-hour format)
                                const hour = Math.floor(timeValue);
                                const isClosed = hour < 9 || hour >= 17;

                                return (
                                  <div
                                    key={index}
                                    className={`
                                ${index % 2 === 0 && index !== 0 ? 'border-l border-[#D6D6D6]' : ''} relative h-full
                                ${cannotDrop ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${isClosed ? 'office-closed' : ''}
                              `}
                                    onMouseEnter={() => {
                                      if (!cannotDrop) {
                                        setHoveredTimeSlot({ roomId: room.id, timeSlot: timeValue });
                                      }
                                      // Set drag hover state for tooltips
                                      if (draggedMeeting && !hasConflictHere) {
                                        setDragHoverRoom({
                                          roomId: room.id,
                                          roomCapacity: room.capacity,
                                          hasExcessCapacity: hasExcessCapacity,
                                          hasInsufficientCapacity: roomHasInsufficientCapacity,
                                          isRequestOnly: isRequestOnlyRoom,
                                          isRestricted: isRestricted,
                                          isOffline: isOffline
                                        });
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredTimeSlot(null);
                                      setDragHoverRoom(null);
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // ✅ Prevent creating meetings in offline rooms
                                      if (!hasConflictHere && !meetingCreationContext && !isOffline) {
                                        handleCreateMeeting(room.id, timeValue);
                                      }
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      e.dataTransfer.dropEffect = (hasConflictHere || isOffline) ? 'none' : 'move';
                                      // Update mouse position for tooltip
                                      setMousePosition({ x: e.clientX, y: e.clientY });

                                      // Set drag hover state for tooltips during drag
                                      if (draggedMeeting && !hasConflictHere) {
                                        setDragHoverRoom({
                                          roomId: room.id,
                                          roomCapacity: room.capacity,
                                          hasExcessCapacity: hasExcessCapacity,
                                          hasInsufficientCapacity: roomHasInsufficientCapacity,
                                          isRequestOnly: isRequestOnlyRoom,
                                          isRestricted: isRestricted,
                                          isOffline: isOffline
                                        });
                                      }
                                      return false;
                                    }}
                                    onDragEnter={(e) => {
                                      e.preventDefault(); // Always prevent default
                                      e.stopPropagation();

                                      // Set drag hover state when entering a cell
                                      if (draggedMeeting && !hasConflictHere) {
                                        setDragHoverRoom({
                                          roomId: room.id,
                                          roomCapacity: room.capacity,
                                          hasExcessCapacity: hasExcessCapacity,
                                          hasInsufficientCapacity: roomHasInsufficientCapacity,
                                          isRequestOnly: isRequestOnlyRoom,
                                          isRestricted: isRestricted,
                                          isOffline: isOffline
                                        });
                                      }
                                      return false;
                                    }}
                                    onDragLeave={(e) => {
                                      if (draggedMeeting) {
                                        e.preventDefault();
                                        // Clear tooltip when leaving this cell
                                        setDragHoverRoom(null);
                                      }
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // ✅ Prevent dropping meetings in offline rooms
                                      if (!hasConflictHere && !isOffline) {
                                        handleDrop(e, room.id, timeValue);
                                      }
                                    }}
                                  >
                                    {isHovered && !cannotDrop && (
                                      <div className="absolute inset-0 bg-white border-2 border-[#2774C1] border-dashed rounded-sm"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Meeting Blocks */}
                            <TooltipProvider>
                              {room.meetings
                                .filter(meeting => {
                                  // Exclude meetings in regular pending move
                                  if (pendingMove && meeting.id === pendingMove.meeting.id) return false;

                                  // Exclude meetings in conflict resolution
                                  if (conflictResolution) {
                                    if (meeting.id === conflictResolution.autoMovedMeeting.meeting.id) return false;
                                    if (meeting.id === conflictResolution.draggedMeeting.meeting.id) return false;
                                  }

                                  return true;
                                })
                                .map((meeting, meetingIndex) => {
                                  // Convert meeting time to column index - full 24-hour grid
                                  const startCol = meeting.startTime * 2; // Each hour = 2 columns (30-min intervals)
                                  const widthCols = meeting.duration * 2; // Duration in hours * 2 columns per hour
                                  const leftPercent = (startCol / 48) * 100;
                                  const widthPercent = (widthCols / 48) * 100;

                                  // Apply spotlight opacity if enabled and meeting doesn't belong to current user or wasn't created by AI for them
                                  const isMyMeeting = meeting.organizer === currentUser || meeting.aiCreated;
                                  const shouldDimMeeting = spotlightMyEvents && !isMyMeeting;

                                  // Apply duration filter opacity if duration filter is active and meeting doesn't match
                                  const shouldDimByDuration = activeFilters?.duration !== 'any' &&
                                    activeFilters?.duration &&
                                    (meeting.duration * 60) < parseInt(activeFilters.duration); // Convert meeting duration to minutes
                                  const isSyncing = allSyncingMeetings.has(meeting.id);

                                  // Fade all regular meetings to 10% when special interactions are active (after drop, not during drag)
                                  const shouldFadeForInteraction = aiMeetingPreview || pendingMove || conflictResolution;

                                  const meetingElement = (
                                    <div
                                      key={meeting.id}
                                      className={`meeting-block absolute rounded px-2 flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'} ${isSyncing
                                        ? 'text-[#1e4a6b] cursor-not-allowed skeleton-ripple'
                                        : `${getMeetingColor(meeting, meetingIndex)} ${meeting.pendingApproval ? 'text-[#2774C1] border-2 border-[#2774C1]' : isMeetingFuture(meeting) ? 'text-[#2774C1]' : 'text-white'} cursor-pointer hover:opacity-90`
                                        } ${shouldFadeForInteraction ? 'opacity-25' : shouldDimMeeting || shouldDimByDuration ? 'opacity-25' : ''
                                        }`}
                                      style={{
                                        left: `calc(${leftPercent}% + 5px)`,
                                        width: `calc(${widthPercent}% - 10px)`
                                      }}
                                      onMouseEnter={() => !isSyncing && setHoveredMeeting(meeting.id)}
                                      onMouseLeave={() => !isSyncing && setHoveredMeeting(null)}
                                      onClick={() => !isSyncing && handleMeetingClick(meeting, room)}
                                    >
                                      {/* Grab Handle - appears on hover, disabled during syncing */}
                                      <div
                                        className={`flex-shrink-0 transition-all duration-200 ${isSyncing || isMeetingPast(meeting)
                                          ? 'opacity-0 w-0 mr-0'
                                          : `cursor-grab active:cursor-grabbing ${hoveredMeeting === meeting.id
                                            ? 'opacity-100 w-4 mr-2'
                                            : 'opacity-0 w-0 mr-0'
                                          }`
                                          }`}
                                        draggable={!isSyncing && !isMeetingPast(meeting) && hoveredMeeting === meeting.id}
                                        onDragStart={(e) => !isSyncing && handleGrabHandleDragStart(e, meeting, room.id)}
                                        onDragEnd={handleDragEnd}
                                        onClick={(e) => e.stopPropagation()} // Prevent meeting click when clicking handle
                                      >
                                        <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4" />
                                      </div>

                                      <div className={`min-w-0 flex-1 transition-all duration-200 ${hoveredMeeting === meeting.id ? 'ml-0' : 'ml-0'
                                        }`}>
                                        <div className="text-xs font-medium flex items-center gap-1">
                                          <span className="truncate">{meeting.title}</span>
                                          {meeting.checkedIn && isMeetingCurrent(meeting) && !isSyncing && (
                                            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 flex-shrink-0 text-white" />
                                          )}
                                          {meeting.aiCreated && !isSyncing && (
                                            <FontAwesomeIcon icon={faMagicWandSparkles} className={`w-3 h-3 flex-shrink-0 ${isMeetingFuture(meeting) ? 'text-[#2774C1]' : 'text-white'}`} />
                                          )}
                                          {meeting.id.includes('-relocated') && (
                                            <FontAwesomeIcon icon={faMagicWandSparkles} className="w-3 h-3 text-yellow-300 flex-shrink-0" />
                                          )}
                                          {meeting.pendingApproval && (
                                            <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-[#2774C1] flex-shrink-0" />
                                          )}
                                        </div>
                                        {!compactView && <div className="text-xs opacity-90 truncate">{meeting.organizer}</div>}
                                      </div>
                                    </div>
                                  );

                                  // Wrap with tooltip if syncing
                                  return isSyncing ? (
                                    <Tooltip key={meeting.id}>
                                      <TooltipTrigger asChild>
                                        {meetingElement}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Meeting is syncing. This may take a moment.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : meetingElement;
                                })}
                            </TooltipProvider>

                            {/* Pending Meeting Move - Show in target location */}
                            {pendingMove && pendingMove.targetRoomId === room.id && (() => {
                              const startCol = pendingMove.targetTimeSlot * 2;
                              const widthCols = pendingMove.meeting.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              // Apply spotlight opacity for pending moves too
                              const isMyPendingMeeting = pendingMove.meeting.organizer === currentUser || pendingMove.meeting.aiCreated;
                              const shouldDimPendingMeeting = spotlightMyEvents && !isMyPendingMeeting;

                              // Apply duration filter opacity for pending moves
                              const shouldDimPendingByDuration = activeFilters?.duration !== 'any' &&
                                activeFilters?.duration &&
                                (pendingMove.meeting.duration * 60) < parseInt(activeFilters.duration);

                              // Get meeting color (use a dummy index since we need the color logic)
                              const meetingColor = getMeetingColor(pendingMove.meeting, 0);

                              return (
                                <Popover open={true} modal={false}>
                                  <PopoverTrigger asChild>
                                    <div
                                      className={`absolute ${meetingColor} rounded px-2 ${pendingMove.meeting.pendingApproval ? 'text-[#2774C1] border-2 border-[#2774C1]' : isMeetingFuture(pendingMove.meeting) ? 'text-[#2774C1]' : 'text-white'} flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'} ${shouldDimPendingMeeting || shouldDimPendingByDuration ? 'opacity-25' : ''
                                        }`}
                                      style={{
                                        left: `calc(${leftPercent}% + 2px)`,
                                        width: `calc(${widthPercent}% - 4px)`,
                                        zIndex: 50,
                                        pointerEvents: 'auto'
                                      }}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-medium truncate">{pendingMove.meeting.title}</span>
                                          {pendingMove.meeting.pendingApproval && (
                                            <FontAwesomeIcon icon={faLock} className="w-3 h-3 text-[#2774C1] flex-shrink-0" />
                                          )}
                                        </div>
                                        {!compactView && <div className="text-xs opacity-90 truncate">{pendingMove.meeting.organizer}</div>}
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[450px] border-2 border-[#17559C]"
                                    side="right"
                                    align="center"
                                    collisionPadding={20}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && confirmationState === 'ready') {
                                        handleConfirmMove();
                                      } else if (e.key === 'Escape') {
                                        handleCancelMove();
                                      }
                                    }}
                                  >
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium">Confirm Meeting Move</h4>
                                      </div>

                                      <div className="space-y-3">
                                        {/* Meeting time and title */}
                                        <div className="flex flex-col">
                                          <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                            {formatTimeSlot(pendingMove.targetTimeSlot)} - {formatTimeSlot(pendingMove.targetTimeSlot + pendingMove.meeting.duration)}
                                          </p>
                                          <p className="font-['Brown_LL',_sans-serif] leading-[22px] not-italic text-[#1c1c1c] text-[14px] font-medium">{pendingMove.meeting.title}</p>
                                        </div>

                                        {/* Room comparison: Original → New */}
                                        <div className="flex items-center gap-3 w-full">
                                          {/* Original Room */}
                                          <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                            {(() => {
                                              const originalRoom = updatedRooms.find(r =>
                                                r.meetings.some(m => m.id === pendingMove.meeting.id)
                                              );
                                              if (!originalRoom) return null;
                                              const amenitiesCount = originalRoom.features?.length || 0;
                                              return (
                                                <div className="flex flex-col gap-[4px]">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                        {originalRoom.name}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>{originalRoom.name}</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                  <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                    Floor {originalRoom.floor}, 54 State St
                                                  </p>
                                                  <div className="flex flex-wrap gap-[8px] items-center">
                                                    <div className="flex gap-[4px] items-center">
                                                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                      <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                        {originalRoom.capacity}
                                                      </p>
                                                    </div>
                                                    {amenitiesCount > 0 && (
                                                      <div className="flex items-center gap-[4px]">
                                                        <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                        <Tooltip>
                                                          <TooltipTrigger asChild>
                                                            <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                              {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                            </span>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <ul className="text-xs space-y-1">
                                                              {originalRoom.features.map((feature, idx) => (
                                                                <li key={idx}>{feature}</li>
                                                              ))}
                                                            </ul>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })()}
                                          </div>

                                          {/* Arrow */}
                                          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-[#6c6c6c] shrink-0" />

                                          {/* New Room */}
                                          <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                            {(() => {
                                              const targetRoom = updatedRooms.find(r => r.id === pendingMove.targetRoomId);
                                              if (!targetRoom) return null;
                                              const amenitiesCount = targetRoom.features?.length || 0;
                                              return (
                                                <div className="flex flex-col gap-[4px]">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                        {targetRoom.name}
                                                      </p>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>{targetRoom.name}</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                  <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                    Floor {targetRoom.floor}, 54 State St
                                                  </p>
                                                  <div className="flex flex-wrap gap-[8px] items-center">
                                                    <div className="flex gap-[4px] items-center">
                                                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                      <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                        {targetRoom.capacity}
                                                      </p>
                                                    </div>
                                                    {amenitiesCount > 0 && (
                                                      <div className="flex items-center gap-[4px]">
                                                        <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                        <Tooltip>
                                                          <TooltipTrigger asChild>
                                                            <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                              {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                            </span>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <ul className="text-xs space-y-1">
                                                              {targetRoom.features.map((feature, idx) => (
                                                                <li key={idx}>{feature}</li>
                                                              ))}
                                                            </ul>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Warning for request-only rooms */}
                                      {(() => {
                                        const targetRoom = updatedRooms.find(r => r.id === pendingMove.targetRoomId);
                                        if (targetRoom?.requestOnly) {
                                          return (
                                            <div className="bg-[#FFFCF0] border border-[#FFEBAB] rounded-[4px] p-3">
                                              <div className="flex gap-2">
                                                <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[#8A5006] flex-shrink-0 mt-0.5" />
                                                <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#8A5006] text-[13px]">
                                                  Using this space requires approval. Moving a meeting here will send a request to an admin for approval.
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      })()}

                                      <div className="flex gap-2 pt-2">
                                        <Button
                                          ref={cancelButtonRef}
                                          variant="outline"
                                          size="sm"
                                          onClick={handleCancelMove}
                                          className="flex-1"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          ref={confirmButtonRef}
                                          size="sm"
                                          onClick={handleConfirmMove}
                                          disabled={confirmationState !== 'ready'}
                                          className={`flex-1 transition-all duration-300 ${confirmationState === 'ready'
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:shadow-[0_0_0_3px_rgba(219,39,119,0.3)]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                          {confirmationState === 'checking-capacity' && (
                                            <>
                                              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                                              Checking capacity
                                            </>
                                          )}
                                          {confirmationState === 'checking-permissions' && (
                                            <>
                                              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                                              Checking permissions
                                            </>
                                          )}
                                          {confirmationState === 'ready' && 'Confirm'}
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              );
                            })()}

                            {/* Conflict Resolution - Auto-moved Meeting (Step 1) */}
                            {conflictResolution && conflictResolution.availableOptions[conflictResolution.currentOptionIndex]?.roomId === room.id && (() => {
                              const { meeting, targetTimeSlot } = conflictResolution.autoMovedMeeting;
                              const startCol = targetTimeSlot * 2;
                              const widthCols = meeting.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              // Apply spotlight opacity for conflict meetings too
                              const isMyConflictMeeting = meeting.organizer === currentUser || meeting.aiCreated;
                              const shouldDimConflictMeeting = spotlightMyEvents && !isMyConflictMeeting;

                              // Apply duration filter opacity for conflict meetings
                              const shouldDimConflictByDuration = activeFilters?.duration !== 'any' &&
                                activeFilters?.duration &&
                                (meeting.duration * 60) < parseInt(activeFilters.duration);

                              return (
                                <div
                                  className={`absolute bg-[#C20E14] rounded px-2 text-white flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'} ${shouldDimConflictMeeting || shouldDimConflictByDuration ? 'opacity-25' : ''}`}
                                  style={{
                                    left: `calc(${leftPercent}% + 2px)`,
                                    width: `calc(${widthPercent}% - 4px)`,
                                    zIndex: 100,
                                    pointerEvents: 'auto'
                                  }}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium flex items-center gap-1">
                                      <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 text-white flex-shrink-0" />
                                      <span className="truncate">{meeting.title}</span>
                                    </div>
                                    {!compactView && <div className="text-xs opacity-90 truncate">{meeting.organizer}</div>}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Conflict Resolution - Dragged Meeting (Step 2) */}
                            {conflictResolution && conflictResolution.draggedMeeting.targetRoomId === room.id && (() => {
                              const { meeting, targetTimeSlot } = conflictResolution.draggedMeeting;
                              const startCol = targetTimeSlot * 2;
                              const widthCols = meeting.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              // Apply spotlight opacity for conflict meetings too
                              const isMyDraggedMeeting = meeting.organizer === currentUser || meeting.aiCreated;
                              const shouldDimDraggedMeeting = spotlightMyEvents && !isMyDraggedMeeting;

                              // Apply duration filter opacity for conflict meetings
                              const shouldDimDraggedByDuration = activeFilters?.duration !== 'any' &&
                                activeFilters?.duration &&
                                (meeting.duration * 60) < parseInt(activeFilters.duration);

                              // Get meeting color (use a dummy index since we need the color logic)
                              const meetingColor = getMeetingColor(meeting, 0);

                              return (
                                <Popover open={conflictResolution.currentConfirmation === 'auto-moved' || conflictResolution.currentConfirmation === 'dragged'} modal={false}>
                                  <PopoverTrigger asChild>
                                    <div
                                      className={`absolute ${meetingColor} rounded px-2 ${meeting.pendingApproval ? 'text-[#2774C1] border-2 border-[#2774C1]' : isMeetingFuture(meeting) ? 'text-[#2774C1]' : 'text-white'} flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'} ${shouldDimDraggedMeeting || shouldDimDraggedByDuration ? 'opacity-25' : ''
                                        }`}
                                      style={{
                                        left: `calc(${leftPercent}% + 2px)`,
                                        width: `calc(${widthPercent}% - 4px)`,
                                        zIndex: 100,
                                        pointerEvents: 'auto'
                                      }}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-medium flex items-center gap-1">
                                          <span className="truncate">{meeting.title}</span>
                                        </div>
                                        {!compactView && <div className="text-xs opacity-90 truncate">{meeting.organizer}</div>}
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[450px] border-2 border-[#17559C]"
                                    side="left"
                                    align="center"
                                    collisionPadding={20}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && confirmationState === 'ready') {
                                        handleConfirmConflictMove();
                                      } else if (e.key === 'Escape') {
                                        handleCancelConflictResolution();
                                      } else if (conflictResolution.currentConfirmation === 'auto-moved') {
                                        // Only allow navigation during step 1
                                        if (e.key === 'ArrowLeft') {
                                          e.preventDefault();
                                          handlePreviousOption();
                                        } else if (e.key === 'ArrowRight') {
                                          e.preventDefault();
                                          handleNextOption();
                                        }
                                      }
                                    }}
                                  >
                                    {/* Combined single-step conflict resolution */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium flex items-center gap-2">
                                          Conflict Detected
                                        </h4>
                                      </div>

                                      <div className="space-y-3">
                                        {/* Original meeting move details */}
                                        <div className="flex flex-col gap-[12px]">
                                          {/* Meeting time and title */}
                                          <div className="flex flex-col">
                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                              {formatTimeSlot(targetTimeSlot)} - {formatTimeSlot(targetTimeSlot + conflictResolution.draggedMeeting.meeting.duration)}
                                            </p>
                                            <p className="font-['Brown_LL',_sans-serif] leading-[22px] not-italic text-[#1c1c1c] text-[14px] font-medium">{meeting.title}</p>
                                          </div>

                                          {/* Room comparison: Original → New */}
                                          <div className="flex items-center gap-3 w-full">
                                            {/* Original Room */}
                                            <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                              {(() => {
                                                const originalRoom = updatedRooms.find(r => r.id === conflictResolution.draggedMeeting.sourceRoomId);
                                                if (!originalRoom) return null;
                                                const amenitiesCount = originalRoom.features?.length || 0;
                                                return (
                                                  <div className="flex flex-col gap-[4px]">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                          {originalRoom.name}
                                                        </p>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>{originalRoom.name}</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                    <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                      Floor {originalRoom.floor}, 54 State St
                                                    </p>
                                                    <div className="flex flex-wrap gap-[8px] items-center">
                                                      <div className="flex gap-[4px] items-center">
                                                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                          {originalRoom.capacity}
                                                        </p>
                                                      </div>
                                                      {amenitiesCount > 0 && (
                                                        <div className="flex items-center gap-[4px]">
                                                          <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                          <Tooltip>
                                                            <TooltipTrigger asChild>
                                                              <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                              </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                              <ul className="text-xs space-y-1">
                                                                {originalRoom.features.map((feature, idx) => (
                                                                  <li key={idx}>{feature}</li>
                                                                ))}
                                                              </ul>
                                                            </TooltipContent>
                                                          </Tooltip>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              })()}
                                            </div>

                                            {/* Arrow */}
                                            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-[#6c6c6c] shrink-0" />

                                            {/* New Room */}
                                            <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                              {(() => {
                                                const targetRoom = updatedRooms.find(r => r.id === conflictResolution.draggedMeeting.targetRoomId);
                                                if (!targetRoom) return null;
                                                const amenitiesCount = targetRoom.features?.length || 0;
                                                return (
                                                  <div className="flex flex-col gap-[4px]">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                          {targetRoom.name}
                                                        </p>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>{targetRoom.name}</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                    <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                      Floor {targetRoom.floor}, 54 State St
                                                    </p>
                                                    <div className="flex flex-wrap gap-[8px] items-center">
                                                      <div className="flex gap-[4px] items-center">
                                                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                          {targetRoom.capacity}
                                                        </p>
                                                      </div>
                                                      {amenitiesCount > 0 && (
                                                        <div className="flex items-center gap-[4px]">
                                                          <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                          <Tooltip>
                                                            <TooltipTrigger asChild>
                                                              <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                              </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                              <ul className="text-xs space-y-1">
                                                                {targetRoom.features.map((feature, idx) => (
                                                                  <li key={idx}>{feature}</li>
                                                                ))}
                                                              </ul>
                                                            </TooltipContent>
                                                          </Tooltip>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              })()}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Conflicted meeting - alternative room selection */}
                                        <div className="border-2 border-[#dc2626] rounded-lg overflow-hidden">
                                          <div className="content-stretch flex flex-col items-start relative w-full">

                                            {/* Header with navigation */}
                                            <div className="relative shrink-0 w-full">
                                              <div className="flex flex-row items-center size-full">
                                                <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[8px] relative w-full border-b border-[#d6d6d6] bg-white">
                                                  <div className="flex items-center gap-[8px] font-['Brown_LL',_sans-serif] h-[22px] leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#1c1c1c] text-[14px]">
                                                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-[#dc2626] shrink-0" />
                                                    <p className="[white-space-collapse:collapse] leading-[22px] overflow-ellipsis overflow-hidden font-medium text-nowrap">
                                                      Conflicting Meeting
                                                    </p>
                                                  </div>

                                                  {/* Navigation buttons */}
                                                  <div className="flex items-center gap-[8px]">
                                                    <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                      {conflictResolution.currentOptionIndex + 1}/{conflictResolution.availableOptions.length}
                                                    </p>

                                                    <button
                                                      onClick={handlePreviousOption}
                                                      disabled={conflictResolution.availableOptions.length <= 1}
                                                      className="bg-white box-border content-stretch flex items-center justify-center px-[12px] py-0 h-[28px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors relative"
                                                    >
                                                      <div aria-hidden="true" className="absolute border border-[#d6d6d6] border-solid pointer-events-none rounded-[4px] inset-0" />
                                                      <div className="content-stretch flex gap-[8px] items-center justify-center relative">
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1c1c1c] text-[12px] text-nowrap whitespace-pre font-medium">Previous</p>
                                                      </div>
                                                    </button>

                                                    <button
                                                      onClick={handleNextOption}
                                                      disabled={conflictResolution.availableOptions.length <= 1}
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

                                            {/* Room Card Body */}
                                            <div className="relative shrink-0 w-full">
                                              <div className="size-full">
                                                <div className="box-border content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[12px] relative w-full bg-white">
                                                  {/* Meeting time and title */}
                                                  <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                                                    <div className="basis-0 content-stretch flex flex-col grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0">
                                                      <div className="flex flex-col font-['Brown_LL',_sans-serif] justify-center relative shrink-0 text-[#6c6c6c] w-full text-[12px]">
                                                        <p className="leading-[20px]">
                                                          {formatTimeSlot(conflictResolution.autoMovedMeeting.targetTimeSlot)} - {formatTimeSlot(conflictResolution.autoMovedMeeting.targetTimeSlot + conflictResolution.autoMovedMeeting.meeting.duration)}
                                                        </p>
                                                      </div>
                                                      <div className="flex flex-col font-['Brown_LL',_sans-serif] justify-center relative shrink-0 text-[#1c1c1c] w-full text-[14px]">
                                                        <p className="leading-[22px] font-medium">{conflictResolution.autoMovedMeeting.meeting.title}</p>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Room comparison: Original → New */}
                                                  <div className="flex items-center gap-3 w-full">
                                                    {/* Original Room */}
                                                    <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                                      {(() => {
                                                        const originalRoom = updatedRooms.find(r => r.id === conflictResolution.autoMovedMeeting.sourceRoomId);
                                                        if (!originalRoom) return null;
                                                        const amenitiesCount = originalRoom.features?.length || 0;
                                                        return (
                                                          <div className="flex flex-col gap-[4px]">
                                                            <Tooltip>
                                                              <TooltipTrigger asChild>
                                                                <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                                  {originalRoom.name}
                                                                </p>
                                                              </TooltipTrigger>
                                                              <TooltipContent>
                                                                <p>{originalRoom.name}</p>
                                                              </TooltipContent>
                                                            </Tooltip>
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                              Floor {originalRoom.floor}, 54 State St
                                                            </p>
                                                            <div className="flex flex-wrap gap-[8px] items-center">
                                                              <div className="flex gap-[4px] items-center">
                                                                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                                <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                                  {originalRoom.capacity}
                                                                </p>
                                                              </div>
                                                              {amenitiesCount > 0 && (
                                                                <div className="flex items-center gap-[4px]">
                                                                  <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                                  <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                      <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                        {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                                      </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                      <ul className="text-xs space-y-1">
                                                                        {originalRoom.features.map((feature, idx) => (
                                                                          <li key={idx}>{feature}</li>
                                                                        ))}
                                                                      </ul>
                                                                    </TooltipContent>
                                                                  </Tooltip>
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        );
                                                      })()}
                                                    </div>

                                                    {/* Arrow */}
                                                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-[#6c6c6c] shrink-0" />

                                                    {/* New Room */}
                                                    <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                                      {(() => {
                                                        const currentOption = conflictResolution.availableOptions[conflictResolution.currentOptionIndex];
                                                        const room = updatedRooms.find(r => r.id === currentOption?.roomId);
                                                        if (!room) return null;
                                                        const amenitiesCount = room.features?.length || 0;
                                                        return (
                                                          <div className="flex flex-col gap-[4px]">
                                                            <Tooltip>
                                                              <TooltipTrigger asChild>
                                                                <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                                  {room.name}
                                                                </p>
                                                              </TooltipTrigger>
                                                              <TooltipContent>
                                                                <p>{room.name}</p>
                                                              </TooltipContent>
                                                            </Tooltip>
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                              Floor {room.floor}, 54 State St
                                                            </p>
                                                            <div className="flex flex-wrap gap-[8px] items-center">
                                                              <div className="flex gap-[4px] items-center">
                                                                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                                <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                                  {room.capacity}
                                                                </p>
                                                              </div>
                                                              {amenitiesCount > 0 && (
                                                                <div className="flex items-center gap-[4px]">
                                                                  <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                                  <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                      <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                        {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                                      </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                      <ul className="text-xs space-y-1">
                                                                        {room.features.map((feature, idx) => (
                                                                          <li key={idx}>{feature}</li>
                                                                        ))}
                                                                      </ul>
                                                                    </TooltipContent>
                                                                  </Tooltip>
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        );
                                                      })()}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex gap-2 pt-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={handleCancelConflictResolution}
                                          className="flex-1"
                                        >
                                          Cancel All
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={handleConfirmConflictMove}
                                          disabled={confirmationState !== 'ready'}
                                          className={`flex-1 transition-all duration-300 ${confirmationState === 'ready'
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:shadow-[0_0_0_3px_rgba(219,39,119,0.3)]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                          {confirmationState === 'checking-capacity' && (
                                            <>
                                              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                                              Checking capacity
                                            </>
                                          )}
                                          {confirmationState === 'checking-permissions' && (
                                            <>
                                              <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                                              Checking permissions
                                            </>
                                          )}
                                          {confirmationState === 'ready' && 'Confirm Both Moves'}
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              );
                            })()}

                            {/* Offline Room Resolution Popover */}
                            {offlineRoomResolution && offlineRoomResolution.affectedMeetings.length > 0 && (() => {
                              const currentMeetingData = offlineRoomResolution.affectedMeetings[offlineRoomResolution.currentIndex];
                              const meeting = currentMeetingData.meeting;

                              // Get available alternative rooms (no conflicts)
                              const availableRooms = updatedRooms
                                .filter(r => {
                                  if (r.status === 'offline' || r.id === currentMeetingData.roomId) return false;

                                  // Check for conflicts
                                  const hasConflict = r.meetings.some(m => {
                                    const meetingEnd = meeting.startTime + meeting.duration;
                                    const existingEnd = m.startTime + m.duration;
                                    return (
                                      (meeting.startTime >= m.startTime && meeting.startTime < existingEnd) ||
                                      (meetingEnd > m.startTime && meetingEnd <= existingEnd) ||
                                      (meeting.startTime <= m.startTime && meetingEnd >= existingEnd)
                                    );
                                  });

                                  return !hasConflict;
                                });

                              if (availableRooms.length === 0) {
                                return null; // No available rooms
                              }

                              // Auto-select first available room if none selected
                              if (!offlineRoomResolution.selectedAlternativeRoomId) {
                                // Use a timeout to avoid state updates during render
                                setTimeout(() => {
                                  onSelectOfflineAlternativeRoom?.(availableRooms[0].id);
                                }, 0);
                              }

                              // Calculate current room option index (0-based)
                              const selectedRoomIndex = offlineRoomResolution.selectedAlternativeRoomId
                                ? availableRooms.findIndex(r => r.id === offlineRoomResolution.selectedAlternativeRoomId)
                                : 0;

                              const currentRoomOptionIndex = selectedRoomIndex >= 0 ? selectedRoomIndex : 0;
                              const currentRoomOption = availableRooms[currentRoomOptionIndex];

                              // Only show the original meeting block (with popover) if this is the offline room
                              if (currentMeetingData.roomId !== room.id) {
                                return null;
                              }

                              // Calculate position (same logic as regular meetings)
                              const startCol = meeting.startTime * 2;
                              const widthCols = meeting.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              return (
                                <Popover open={true} modal={false}>
                                  <PopoverTrigger asChild>
                                    <div
                                      className={`absolute bg-red-100 border-2 border-red-500 rounded px-2 text-red-900 flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'}`}
                                      style={{
                                        left: `calc(${leftPercent}% + 2px)`,
                                        width: `calc(${widthPercent}% - 4px)`,
                                        zIndex: 100,
                                        pointerEvents: 'auto'
                                      }}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-medium flex items-center gap-1">
                                          <FontAwesomeIcon icon={faExclamationTriangle} className="w-3 h-3 shrink-0" />
                                          <span className="truncate">{meeting.title}</span>
                                        </div>
                                        {!compactView && <div className="text-xs opacity-90 truncate">{meeting.organizer}</div>}
                                      </div>
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[450px] border-2 border-[#17559C]"
                                    side="left"
                                    align="center"
                                    collisionPadding={20}
                                  >
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium flex items-center gap-2">
                                          <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-600" />
                                          Room Offline - Move Required
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                          {currentMeetingData.roomName} is offline. Please select a new room for this meeting.
                                        </p>
                                      </div>

                                      {/* Header with meeting navigation */}
                                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-300">
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                              Meeting {offlineRoomResolution.currentIndex + 1} of {offlineRoomResolution.affectedMeetings.length}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={onPreviousOfflineMeeting}
                                              className="bg-white px-3 py-1 h-7 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                                            >
                                              Previous
                                            </button>

                                            <button
                                              onClick={onNextOfflineMeeting}
                                              className="bg-white px-3 py-1 h-7 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                                            >
                                              Next
                                            </button>
                                          </div>
                                        </div>

                                        {/* Meeting details */}
                                        <div className="p-4 bg-white space-y-3">
                                          {/* Meeting time and title */}
                                          <div className="flex flex-col">
                                            <p className="text-xs text-gray-600">
                                              {formatTimeFloat(meeting.startTime)} - {formatTimeFloat(meeting.startTime + meeting.duration)}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                                            <p className="text-xs text-gray-600">{meeting.organizer}</p>
                                          </div>

                                          {/* Room comparison card with navigation */}
                                          <div className="border border-gray-300 rounded-lg overflow-hidden">
                                            {/* Room navigation header */}
                                            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#d6d6d6]">
                                              <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-[#dc2626] shrink-0" />
                                                <p className="text-sm font-medium text-gray-900">
                                                  Room Change
                                                </p>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-600">
                                                  {currentRoomOptionIndex + 1}/{availableRooms.length}
                                                </p>

                                                <button
                                                  onClick={() => {
                                                    // Loop to last room if at first
                                                    const prevIndex = currentRoomOptionIndex === 0
                                                      ? availableRooms.length - 1
                                                      : currentRoomOptionIndex - 1;
                                                    onSelectOfflineAlternativeRoom?.(availableRooms[prevIndex].id);
                                                  }}
                                                  className="bg-white px-3 py-1 h-7 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                                                >
                                                  Previous
                                                </button>

                                                <button
                                                  onClick={() => {
                                                    // Loop to first room if at last
                                                    const nextIndex = currentRoomOptionIndex === availableRooms.length - 1
                                                      ? 0
                                                      : currentRoomOptionIndex + 1;
                                                    onSelectOfflineAlternativeRoom?.(availableRooms[nextIndex].id);
                                                  }}
                                                  className="bg-white px-3 py-1 h-7 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
                                                >
                                                  Next
                                                </button>
                                              </div>
                                            </div>

                                            {/* Room comparison: Current (Offline) → Alternative */}
                                            <div className="p-4 bg-white">
                                              <div className="flex items-center gap-3 w-full">
                                                {/* Current Room (Offline) */}
                                                <div className="flex-1 min-w-0 border border-red-300 rounded-[4px] p-2 bg-red-50">
                                                  {(() => {
                                                    const offlineRoom = updatedRooms.find(r => r.id === currentMeetingData.roomId);
                                                    if (!offlineRoom) return null;
                                                    const amenitiesCount = offlineRoom.features?.length || 0;
                                                    return (
                                                      <div className="flex flex-col gap-[4px]">
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-red-700 text-[10px] font-medium mb-0.5">
                                                          CURRENT (OFFLINE)
                                                        </p>
                                                        <Tooltip>
                                                          <TooltipTrigger asChild>
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                              {offlineRoom.name}
                                                            </p>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <p>{offlineRoom.name}</p>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                          Floor {offlineRoom.floor}, 54 State St
                                                        </p>
                                                        <div className="flex flex-wrap gap-[8px] items-center">
                                                          <div className="flex gap-[4px] items-center">
                                                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                              {offlineRoom.capacity}
                                                            </p>
                                                          </div>
                                                          {amenitiesCount > 0 && (
                                                            <div className="flex items-center gap-[4px]">
                                                              <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                              <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                  <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                    {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                                  </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                  <ul className="text-xs space-y-1">
                                                                    {offlineRoom.features.map((feature, idx) => (
                                                                      <li key={idx}>{feature}</li>
                                                                    ))}
                                                                  </ul>
                                                                </TooltipContent>
                                                              </Tooltip>
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })()}
                                                </div>

                                                {/* Arrow */}
                                                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-[#6c6c6c] shrink-0" />

                                                {/* Alternative Room */}
                                                <div className="flex-1 min-w-0 border border-[#d6d6d6] rounded-[4px] p-2">
                                                  {(() => {
                                                    const amenitiesCount = currentRoomOption.features?.length || 0;
                                                    return (
                                                      <div className="flex flex-col gap-[4px]">
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#2774C1] text-[10px] font-medium mb-0.5">
                                                          NEW ROOM
                                                        </p>
                                                        <Tooltip>
                                                          <TooltipTrigger asChild>
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#1c1c1c] text-[14px] font-medium truncate">
                                                              {currentRoomOption.name}
                                                            </p>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <p>{currentRoomOption.name}</p>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                        <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">
                                                          Floor {currentRoomOption.floor}, 54 State St
                                                        </p>
                                                        <div className="flex flex-wrap gap-[8px] items-center">
                                                          <div className="flex gap-[4px] items-center">
                                                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-[#6c6c6c]" />
                                                            <p className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap whitespace-pre">
                                                              {currentRoomOption.capacity}
                                                            </p>
                                                          </div>
                                                          {amenitiesCount > 0 && (
                                                            <div className="flex items-center gap-[4px]">
                                                              <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px]">•</span>
                                                              <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                  <span className="font-['Brown_LL',_sans-serif] leading-[20px] not-italic text-[#6c6c6c] text-[12px] text-nowrap border-b border-dashed border-[#6c6c6c] cursor-help">
                                                                    {amenitiesCount} {amenitiesCount === 1 ? 'amenity' : 'amenities'}
                                                                  </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                  <ul className="text-xs space-y-1">
                                                                    {currentRoomOption.features.map((feature, idx) => (
                                                                      <li key={idx}>{feature}</li>
                                                                    ))}
                                                                  </ul>
                                                                </TooltipContent>
                                                              </Tooltip>
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })()}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={onSkipOfflineMeeting}
                                          className="flex-1"
                                        >
                                          Skip
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={onMoveOfflineMeeting}
                                          className="flex-1 bg-[#db2777] text-white hover:bg-[#db2777]/90"
                                        >
                                          Move Meeting
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              );
                            })()}

                            {/* Offline Room Resolution - Preview Block in Alternative Room */}
                            {offlineRoomResolution && offlineRoomResolution.affectedMeetings.length > 0 && (() => {
                              const currentMeetingData = offlineRoomResolution.affectedMeetings[offlineRoomResolution.currentIndex];
                              const meeting = currentMeetingData.meeting;

                              // Get available alternative rooms (no conflicts)
                              const availableRooms = updatedRooms
                                .filter(r => {
                                  if (r.status === 'offline' || r.id === currentMeetingData.roomId) return false;

                                  // Check for conflicts
                                  const hasConflict = r.meetings.some(m => {
                                    const meetingEnd = meeting.startTime + meeting.duration;
                                    const existingEnd = m.startTime + m.duration;
                                    return (
                                      (meeting.startTime >= m.startTime && meeting.startTime < existingEnd) ||
                                      (meetingEnd > m.startTime && meetingEnd <= existingEnd) ||
                                      (meeting.startTime <= m.startTime && meetingEnd >= existingEnd)
                                    );
                                  });

                                  return !hasConflict;
                                });

                              if (availableRooms.length === 0) {
                                return null;
                              }

                              // Calculate current room option index (0-based)
                              const selectedRoomIndex = offlineRoomResolution.selectedAlternativeRoomId
                                ? availableRooms.findIndex(r => r.id === offlineRoomResolution.selectedAlternativeRoomId)
                                : 0;

                              const currentRoomOptionIndex = selectedRoomIndex >= 0 ? selectedRoomIndex : 0;
                              const currentRoomOption = availableRooms[currentRoomOptionIndex];

                              // Only show preview if this is the currently selected alternative room
                              if (!currentRoomOption || currentRoomOption.id !== room.id) {
                                return null;
                              }

                              // Calculate position (same logic as regular meetings)
                              const startCol = meeting.startTime * 2;
                              const widthCols = meeting.duration * 2;
                              const leftPercent = (startCol / 48) * 100;
                              const widthPercent = (widthCols / 48) * 100;

                              return (
                                <div
                                  className={`absolute border-2 border-[#2774C1] border-dashed rounded px-2 flex items-center transition-all duration-200 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'}`}
                                  style={{
                                    left: `calc(${leftPercent}% + 2px)`,
                                    width: `calc(${widthPercent}% - 4px)`,
                                    zIndex: 90,
                                    pointerEvents: 'none',
                                    backgroundColor: 'rgba(39, 116, 193, 0.15)'
                                  }}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div style={{ fontSize: '12px', fontWeight: 500 }} className="flex items-center gap-1.5 text-[#2774C1]">
                                      <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{meeting.title}</span>
                                    </div>
                                    {!compactView && <div style={{ fontSize: '11px' }} className="opacity-90 truncate text-[#2774C1] mt-0.5">{meeting.organizer}</div>}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Meeting Preview (for meetings being created) */}
                            {meetingPreview && meetingPreview.roomId === room.id && (
                              (() => {
                                const startCol = meetingPreview.startTime * 2; // Each hour = 2 columns (30-min intervals)
                                const widthCols = meetingPreview.duration * 2; // Duration in hours * 2 columns per hour
                                const leftPercent = (startCol / 48) * 100;
                                const widthPercent = (widthCols / 48) * 100;

                                return (
                                  <div
                                    className={`absolute bg-[#2774C1] rounded px-2 text-white flex items-center cursor-move ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'}`}
                                    style={{
                                      left: `calc(${leftPercent}% + 2px)`,
                                      width: `calc(${widthPercent}% - 4px)`
                                    }}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, {
                                      id: 'preview',
                                      title: meetingPreview.title || 'New Meeting',
                                      organizer: '',
                                      startTime: meetingPreview.startTime,
                                      duration: meetingPreview.duration,
                                      attendees: 0
                                    }, meetingPreview.roomId, true)}
                                    onDragEnd={handleDragEnd}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-medium">
                                        {meetingPreview.title || 'New Meeting'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            )}

                            {/* AI Meeting Preview (for AI room suggestions) */}
                            {aiMeetingPreview && aiMeetingPreview.roomId === room.id && (
                              (() => {
                                const startCol = aiMeetingPreview.startTime * 2; // Each hour = 2 columns (30-min intervals)
                                const widthCols = aiMeetingPreview.duration * 2; // Duration in hours * 2 columns per hour
                                const leftPercent = (startCol / 48) * 100;
                                const widthPercent = (widthCols / 48) * 100;

                                return (
                                  <div
                                    className={`absolute bg-gradient-to-r from-primary to-blue-600 rounded px-2 text-white flex items-center z-50 ${compactView ? 'top-1 bottom-1' : 'top-2 bottom-2'}`}
                                    style={{
                                      left: `calc(${leftPercent}% + 2px)`,
                                      width: `calc(${widthPercent}% - 4px)`
                                    }}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-medium truncate">
                                        {aiMeetingPreview.title}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            )}

                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Conference Room B Issue Sidebar */}
            {hasAvIssueOccurred && sidebarState !== 'meeting-details' && (
              <div className="w-80 bg-white border-l border-[#D6D6D6] flex flex-col">
                <div className="border-b border-[#D6D6D6] px-[16px] py-[12px]">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5 text-[#E81C1C] mr-2" />
                    <h3 className="font-semibold text-[rgba(0,0,0,0.95)]">Conference Room B Issues</h3>
                  </div>
                </div>

                <div className="flex-1 p-[16px] space-y-4">
                  <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faTv} className="w-4 h-4 text-[#dc2626] mr-2" />
                      <span className="text-sm font-medium text-[#991b1b]">Equipment Failure</span>
                    </div>
                    <p className="text-xs text-[#b91c1c]">
                      Projector malfunction reported in Conference Room B. Room has been taken offline for repairs.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Automated Actions Taken:</h4>
                    <ul className="space-y-2 text-sm text-[rgba(0,0,0,0.75)]">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#2774C1] rounded-full mr-3 flex-shrink-0"></div>
                        <button
                          onClick={() => onNavigate('meeting-spaces')}
                          className="text-[#2774C1] hover:text-[#1e4a6b] hover:underline"
                        >
                          2 meetings reassigned
                        </button>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-[#2774C1] rounded-full mr-3 flex-shrink-0"></div>
                        <button
                          onClick={() => onNavigate('tickets')}
                          className="text-[#2774C1] hover:text-[#1e4a6b] hover:underline"
                        >
                          IT support ticket created
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#f2f8ec] border border-[#d4eac3] rounded-lg p-3">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faWandSparkles} className="w-4 h-4 text-[#5a8c28] mr-2" />
                      <span className="text-sm font-medium text-[#3a5c18]">All Clear</span>
                    </div>
                    <p className="text-xs text-[#4a7420] mt-1">
                      No further action required. All affected meetings have been automatically relocated to available rooms.
                    </p>
                  </div>
                </div>
              </div>
            )}



            {/* Drag Hover Tooltip */}
            {dragHoverRoom && draggedMeeting && (dragHoverRoom.isRestricted || dragHoverRoom.isOffline || dragHoverRoom.isRequestOnly || dragHoverRoom.hasInsufficientCapacity || dragHoverRoom.hasExcessCapacity) && (
              <div
                className="fixed pointer-events-none"
                style={{
                  top: `${mousePosition.y - 10}px`,
                  left: `${mousePosition.x - 15}px`,
                  transform: 'translateX(-100%)',
                  zIndex: 999999
                }}
              >
                <div
                  className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg"
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '1.5'
                  }}
                >
                  {dragHoverRoom.isRestricted ? (
                    'You do not have permission to book this room'
                  ) : dragHoverRoom.isOffline ? (
                    'Room is currently offline'
                  ) : dragHoverRoom.isRequestOnly ? (
                    'Using this space requires admin approval.'
                  ) : dragHoverRoom.hasInsufficientCapacity ? (
                    'Meeting room may be too small'
                  ) : dragHoverRoom.hasExcessCapacity ? (
                    'Meeting room may be too big'
                  ) : null}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </PageLayout>
  );
}