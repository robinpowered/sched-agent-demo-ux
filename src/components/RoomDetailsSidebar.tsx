import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GlobalTabs } from './GlobalTabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faArrowLeft,
  faUsers, 
  faMapMarkerAlt, 
  faCalendar,
  faClock,
  faDesktop,
  faWifi,
  faVolumeUp,
  faProjectDiagram,
  faPen,
  faVideo,
  faMagicWandSparkles,
  faBuilding,
  faWandSparkles,
  faDisplay,
  faCircleCheck,
  faCircleXmark,
  faFileExport,
  faLock,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';

// Import shared types
import { Meeting, Room } from '../types';

// Import shared utilities
import { formatTimeFloat, formatDuration, getCurrentTimeFloat } from '../utils';

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

interface RoomDetailsSidebarProps {
  room: Room;
  onClose: () => void;
  onCreateMeeting: (roomId: string, startTime: number) => void;
  onOpenMeetingDetails: (meetingDetails: { meeting: Meeting; room: Room }) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isNavCollapsed?: boolean;
  onToggleRoomOffline?: (roomId: string, isOffline: boolean) => void;
}

export function RoomDetailsSidebar({
  room,
  onClose,
  onCreateMeeting,
  onOpenMeetingDetails,
  onBack,
  showBackButton = false,
  isNavCollapsed = true,
  onToggleRoomOffline
}: RoomDetailsSidebarProps) {
  const [scheduleView, setScheduleView] = useState<'today' | 'week' | 'month'>('today');
  
  // Time slots from 8 AM to 6 PM in 30-minute intervals
  const timeSlots = [
    8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5,
    12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5,
    16.0, 16.5, 17.0, 17.5, 18.0
  ];

  // Helper function to format time for display
  const formatTimeSlot = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  // Check if a time slot has a meeting
  const getMeetingAtTime = (timeSlot: number): Meeting | null => {
    return room.meetings.find(meeting => {
      const meetingStart = meeting.startTime;
      const meetingEnd = meeting.startTime + meeting.duration;
      return timeSlot >= meetingStart && timeSlot < meetingEnd;
    }) || null;
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (timeSlot: number): boolean => {
    return !getMeetingAtTime(timeSlot);
  };

  // Get feature icon
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'projector':
        return <FontAwesomeIcon icon={faProjectDiagram} className="w-4 h-4" />;
      case 'whiteboard':
        return <FontAwesomeIcon icon={faPen} className="w-4 h-4" />;
      case 'video conf':
        return <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />;
      case 'audio system':
        return <FontAwesomeIcon icon={faVolumeUp} className="w-4 h-4" />;
      case 'monitor':
      case 'multiple monitors':
        return <FontAwesomeIcon icon={faDisplay} className="w-4 h-4" />;
      case 'wifi':
        return <FontAwesomeIcon icon={faWifi} className="w-4 h-4" />;
      default:
        return <FontAwesomeIcon icon={faWandSparkles} className="w-4 h-4" />;
    }
  };



  const handleTimeSlotClick = (timeSlot: number) => {
    const meeting = getMeetingAtTime(timeSlot);
    if (meeting) {
      // Click on existing meeting - open meeting details
      onOpenMeetingDetails({ meeting, room });
    } else {
      // Click on available time - create new meeting
      onCreateMeeting(room.id, timeSlot);
    }
  };

  // Get current date info
  const getCurrentDayOfWeek = () => {
    return new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  };

  // Generate week days (Mon-Fri) with varied meetings
  const getWeekDays = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const today = getCurrentDayOfWeek();
    
    return days.map((day, index) => {
      // Distribute meetings across weekdays - each day gets different meetings
      const dayMeetings = room.meetings.filter((_, meetingIndex) => {
        // Distribute based on meeting index and day index
        return meetingIndex % 5 === index;
      });
      
      return {
        label: day,
        isToday: today === index + 1, // Monday = 1, Friday = 5
        meetings: dayMeetings
      };
    });
  };

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
      
      // Only show meetings on weekdays, varied distribution
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
        meetings: dayMeetings
      });
    }
    return { days, firstDay };
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Export schedule');
  };

  // Calculate dynamic width based on schedule view
  const sidebarWidth = scheduleView === 'today' 
    ? '384px' 
    : `calc(100vw - ${isNavCollapsed ? '92px' : '220px'})`; // nav width + 20px gap

  return (
    <div 
      className={`fixed top-0 right-0 h-full flex flex-col bg-white border-l border-[#D6D6D6] transition-all duration-300 z-50 ${
        scheduleView !== 'today' ? 'shadow-2xl' : ''
      }`}
      style={{ 
        width: sidebarWidth
      }}
    >
      {/* Header */}
      <div className="border-b border-[#D6D6D6] px-4 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 hover:bg-gray-100">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">Space Details</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 h-8 w-8"
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-6">
          {/* Room Name */}
          <div>
            <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.95)] mb-3">
              {room.name}
            </h2>
            
            {/* Status - moved here to be just below room name */}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={room.status === 'available' ? faCircleCheck : faCircleXmark} 
                className={`w-4 h-4 ${room.status === 'available' ? 'text-[#72B433]' : 'text-[#E81C1C]'}`}
              />
              <span className="text-sm text-[rgba(0,0,0,0.75)] capitalize">
                {room.status === 'available' ? 'Available now' :
                 room.status === 'occupied' ? 'Currently occupied' :
                 'Currently offline'}
              </span>
            </div>
          </div>

          {/* Layout switches based on schedule view */}
          {scheduleView === 'today' ? (
            <>
              {/* Today View: Traditional vertical layout */}
              {/* Room Photo */}
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={getRoomImage(room.id)}
                  alt={`${room.name} photo`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Building, Floor, and Capacity - clustered together */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                  <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
                  <span>54 State St.</span>
                </div>
                <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                  <span>Floor {room.floor}</span>
                </div>
                <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                  <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                  <span>Capacity: {room.capacity} people</span>
                </div>
              </div>

              <Separator />

              {/* Policies */}
              {room.requestOnly && (
                <>
                  <div>
                    <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Policies</h4>
                    <div className="bg-[#FFFCF0] border border-[#FFEBAB] rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faLock} className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8A5006]" />
                        <p className="text-sm text-[#8A5006]">
                          Using this space requires approval. Creating a meeting will send a request to an admin.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Amenities */}
              <div>
                <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {getFeatureIcon(feature)}
                      <span>{feature}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Admin Controls */}
              <div>
                <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-3">Admin Controls</h4>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPowerOff} className="w-4 h-4 text-[rgba(0,0,0,0.75)]" />
                    <span className="text-sm text-[rgba(0,0,0,0.75)]">Take room offline</span>
                  </div>
                  <Switch 
                    checked={room.status === 'offline'}
                    onCheckedChange={(checked) => {
                      if (onToggleRoomOffline) {
                        onToggleRoomOffline(room.id, checked);
                      }
                    }}
                  />
                </div>
                <a href="#" className="text-sm underline" style={{ color: '#2774C1' }}>
                  Go to space settings and policies
                </a>
              </div>

              <Separator />
            </>
          ) : (
            <>
              {/* Week/Month View: Horizontal layout with image and details side by side */}
              <div className="flex gap-6">
                {/* Room Photo */}
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0" style={{ width: '400px' }}>
                  <ImageWithFallback
                    src={getRoomImage(room.id)}
                    alt={`${room.name} photo`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Space Details Column */}
                <div className="flex-1 space-y-4">
                  {/* Building, Floor, and Capacity */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                      <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
                      <span>54 State St.</span>
                    </div>
                    <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4" />
                      <span>Floor {room.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[rgba(0,0,0,0.75)]">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                      <span>Capacity: {room.capacity} people</span>
                    </div>
                  </div>

                  {/* Policies */}
                  {room.requestOnly && (
                    <div>
                      <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-2">Policies</h4>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <FontAwesomeIcon icon={faLock} className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            Using this space requires approval. Creating a meeting will send a request to an admin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {getFeatureIcon(feature)}
                          <span>{feature}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Admin Controls */}
                  <div>
                    <h4 className="font-medium text-[rgba(0,0,0,0.95)] mb-2">Admin Controls</h4>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPowerOff} className="w-4 h-4 text-[rgba(0,0,0,0.75)]" />
                        <span className="text-sm text-[rgba(0,0,0,0.75)]">Take room offline</span>
                      </div>
                      <Switch 
                        checked={room.status === 'offline'}
                        onCheckedChange={(checked) => {
                          if (onToggleRoomOffline) {
                            onToggleRoomOffline(room.id, checked);
                          }
                        }}
                      />
                    </div>
                    <a href="#" className="text-sm underline" style={{ color: '#2774C1' }}>
                      Go to space settings and policies
                    </a>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Schedule */}
          <div>
            {/* Schedule Header with Export Button */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[rgba(0,0,0,0.95)]">Schedule</h4>
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

            {/* Schedule Tabs using GlobalTabs */}
            <div className="mb-4">
              <GlobalTabs
                tabs={[
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' }
                ]}
                activeTab={scheduleView}
                onTabChange={(value) => setScheduleView(value as 'today' | 'week' | 'month')}
                gap="16px"
              />
            </div>

            {/* Today View */}
            {scheduleView === 'today' && (
              <div className="space-y-1">
                {timeSlots.map((timeSlot) => {
                  const meeting = getMeetingAtTime(timeSlot);
                  const isAvailable = !meeting;
                  
                  if (meeting) {
                    // Show meeting block
                    const isStartOfMeeting = meeting.startTime === timeSlot;
                    
                    if (!isStartOfMeeting) {
                      // Skip time slots that are part of a longer meeting (not the start)
                      return null;
                    }

                    return (
                      <button
                        key={timeSlot}
                        onClick={() => handleTimeSlotClick(timeSlot)}
                        className="w-full p-3 rounded-lg bg-[#2774C1] text-white hover:bg-[#1e5a8a] transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">
                              {meeting.title}
                            </div>
                            <div className="text-xs opacity-90 truncate">
                              {meeting.organizer}
                            </div>
                          </div>
                          <div className="text-xs opacity-90 ml-2">
                            {formatTimeSlot(meeting.startTime)} - {formatTimeSlot(meeting.startTime + meeting.duration)}
                          </div>
                        </div>
                      </button>
                    );
                  } else {
                    // Show available time slot
                    return (
                      <button
                        key={timeSlot}
                        onClick={() => handleTimeSlotClick(timeSlot)}
                        className="w-full p-3 rounded-lg border border-dashed border-[#868686] hover:border-[#2774C1] hover:bg-[#f0f6ff] transition-colors text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-[rgba(0,0,0,0.5)] group-hover:text-[#2774C1]" />
                            <span className="text-sm text-[rgba(0,0,0,0.75)] group-hover:text-[#2774C1]">
                              {formatTimeSlot(timeSlot)}
                            </span>
                          </div>
                          <span className="text-xs text-[rgba(0,0,0,0.5)] group-hover:text-[#2774C1]">
                            Available
                          </span>
                        </div>
                      </button>
                    );
                  }
                })}
              </div>
            )}

            {/* Week View */}
            {scheduleView === 'week' && (
              <div className="grid grid-cols-5 gap-4">
                {getWeekDays().map((day, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg overflow-hidden bg-white ${
                      day.isToday 
                        ? 'border-2 border-[#3b82f6] bg-[#f0f6ff]' 
                        : 'border border-[#868686]'
                    }`}
                  >
                    <div className="p-2 border-b border-[#868686] text-center bg-gray-50">
                      <div style={{ fontSize: '12px', fontWeight: 500 }}>{day.label}</div>
                    </div>
                    <div className="p-2 space-y-1 max-h-[500px] overflow-y-auto scrollbar-overlay">
                      {day.meetings.length > 0 ? (
                        day.meetings.map((meeting, idx) => (
                          <button
                            key={idx}
                            onClick={() => onOpenMeetingDetails({ meeting, room })}
                            className="w-full p-2 rounded bg-[#2774C1] text-white hover:bg-[#1e5a8a] transition-colors text-left"
                          >
                            <div style={{ fontSize: '11px', fontWeight: 500 }} className="truncate">
                              {meeting.title}
                            </div>
                            <div style={{ fontSize: '10px' }} className="opacity-75">
                              {formatTimeSlot(meeting.startTime)} - {formatTimeSlot(meeting.startTime + meeting.duration)}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <div style={{ fontSize: '11px' }} className="text-[rgba(0,0,0,0.4)]">
                            No meetings
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Month View */}
            {scheduleView === 'month' && (
              <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center p-1 bg-gray-50 rounded" style={{ fontSize: '11px', fontWeight: 500 }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const { days, firstDay } = getMonthDays();
                    const cells = [];
                    
                    // Add empty cells for days before month starts
                    for (let i = 0; i < firstDay; i++) {
                      cells.push(<div key={`empty-${i}`} className="min-h-[120px]" />);
                    }
                    
                    // Add day cells with varied meetings
                    days.forEach((day) => {
                      const dayMeetings = day.meetings;
                      
                      cells.push(
                        <div 
                          key={day.date} 
                          className={`min-h-[120px] rounded p-1 bg-white ${
                            day.isToday 
                              ? 'border-2 border-[#3b82f6] bg-[#f0f6ff]' 
                              : 'border border-[#868686]'
                          }`}
                        >
                          <div style={{ fontSize: '11px', fontWeight: day.isToday ? 500 : 400 }} className="text-center mb-1">
                            {day.date}
                          </div>
                          {dayMeetings.length > 0 && (
                            <div className="space-y-0.5 max-h-[100px] overflow-y-auto scrollbar-overlay">
                              {dayMeetings.map((meeting, idx) => (
                                <button 
                                  key={idx}
                                  className="w-full p-1 bg-[#2774C1] text-white rounded cursor-pointer hover:bg-[#1e5a8a] transition-colors text-left"
                                  onClick={() => onOpenMeetingDetails({ meeting, room })}
                                >
                                  <div style={{ fontSize: '9px', fontWeight: 500 }} className="truncate">
                                    {meeting.title}
                                  </div>
                                  <div style={{ fontSize: '8px' }} className="opacity-75 truncate">
                                    {formatTimeSlot(meeting.startTime)} - {formatTimeSlot(meeting.startTime + meeting.duration)}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    });
                    
                    return cells;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}