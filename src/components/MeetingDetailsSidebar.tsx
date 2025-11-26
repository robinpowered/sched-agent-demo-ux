import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { GlobalTabs } from './GlobalTabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { EditMeetingForm } from './EditMeetingForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faArrowLeft,
  faCalendar,
  faClock,
  faUsers,
  faMapMarkerAlt,
  faMagicWandSparkles,
  faPencilAlt,
  faTrash,
  faWandMagicSparkles,
  faPen,
  faTrashAlt,
  faLock
} from '@fortawesome/free-solid-svg-icons';

// Import shared types
import { Meeting, Room, Attendee } from '../types';

// Import shared utilities
import { formatTimeFloat, formatDuration } from '../utils';

interface MeetingDetailsSidebarProps {
  selectedMeeting: {
    meeting: Meeting;
    room: Room;
  } | null;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onDeleteMeeting?: (meetingId: string) => void;
  onEditMeeting?: (updatedMeeting: Meeting, selectedRooms: string[]) => void;
  allRooms?: Room[];
  onOpenRoomDetails?: (room: Room) => void;
  demoTimeOverride?: number | null;
}

export function MeetingDetailsSidebar({ 
  selectedMeeting, 
  onClose, 
  onBack,
  showBackButton = false,
  showCloseButton = true,
  onDeleteMeeting,
  onEditMeeting,
  allRooms = [],
  onOpenRoomDetails,
  demoTimeOverride
}: MeetingDetailsSidebarProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedMeeting) {
    return null;
  }

  // Helper function to check if a meeting is in the past
  const isMeetingPast = (meeting: Meeting) => {
    // Use demo time override if available, otherwise use real current time
    let currentHourFloat: number;
    if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
      currentHourFloat = demoTimeOverride;
    } else {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      currentHourFloat = hour + minutes / 60;
    }
    const meetingEndTime = meeting.startTime + meeting.duration;
    return meetingEndTime <= currentHourFloat;
  };

  const isPastMeeting = isMeetingPast(selectedMeeting.meeting);

  // Generate mock attendees based on the meeting
  const generateAttendees = (meeting: Meeting): Attendee[] => {
    const firstNames = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Alex', 'Lisa', 'Chris', 'Amanda', 'Ryan', 'Jennifer', 'Daniel'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Garcia', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
    
    const attendees: Attendee[] = [];
    const attendeeCount = meeting.attendees;
    
    // Always include the organizer as the first attendee
    const organizerName = meeting.organizer;
    attendees.push({
      id: 'organizer',
      name: organizerName,
      email: `${organizerName.toLowerCase().replace(' ', '.')}@wayne-enterprises.com`
    });
    
    // Generate remaining attendees
    for (let i = 1; i < attendeeCount; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      
      attendees.push({
        id: `attendee-${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@wayne-enterprises.com`
      });
    }
    
    return attendees;
  };

  const attendees = generateAttendees(selectedMeeting.meeting);

  const handleEditDetails = () => {
    setIsEditMode(true);
  };

  const handleDeleteMeeting = () => {
    if (onDeleteMeeting && selectedMeeting) {
      onDeleteMeeting(selectedMeeting.meeting.id);
      setShowDeleteConfirm(false);
      onClose(); // Close the sidebar after deletion
    }
  };

  const handleSaveEdit = (updatedMeeting: Meeting, selectedRooms: string[]) => {
    if (onEditMeeting) {
      onEditMeeting(updatedMeeting, selectedRooms);
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Generate meeting description based on meeting title
  const getMeetingDescription = (meeting: Meeting) => {
    const title = meeting.title.toLowerCase();
    
    if (title.includes('standup') || title.includes('daily')) {
      return 'Daily team synchronization meeting to discuss progress, blockers, and upcoming tasks. Brief updates from each team member on yesterday\'s work and today\'s priorities.';
    } else if (title.includes('retrospective') || title.includes('retro')) {
      return 'Team retrospective meeting to reflect on recent work, discuss what went well, identify improvement areas, and plan action items for the next iteration.';
    } else if (title.includes('planning') || title.includes('sprint')) {
      return 'Sprint planning session to review upcoming work, estimate tasks, and commit to deliverables for the next development cycle.';
    } else if (title.includes('demo') || title.includes('showcase')) {
      return 'Product demonstration meeting to showcase completed features, gather feedback from stakeholders, and discuss next steps.';
    } else if (title.includes('quarterly') || title.includes('q1') || title.includes('q2') || title.includes('q3') || title.includes('q4')) {
      return 'Quarterly business review meeting to analyze performance metrics, discuss strategic initiatives, and align on priorities for the upcoming quarter.';
    } else if (title.includes('1:1') || title.includes('one-on-one')) {
      return 'One-on-one meeting for career development discussion, feedback exchange, and personal check-in between manager and team member.';
    } else if (title.includes('interview') || title.includes('candidate')) {
      return 'Interview session with potential candidate to assess technical skills, cultural fit, and discuss role expectations and opportunities.';
    } else if (title.includes('design') || title.includes('ux')) {
      return 'Design review meeting to collaborate on user experience, discuss design solutions, and align on product direction and visual standards.';
    } else if (title.includes('all hands') || title.includes('company')) {
      return 'Company-wide meeting to share important updates, celebrate achievements, discuss strategic direction, and foster team alignment.';
    } else if (title.includes('client') || title.includes('customer')) {
      return 'Client meeting to discuss project requirements, provide updates on deliverables, gather feedback, and strengthen business relationships.';
    } else {
      return 'Team collaboration meeting to align on objectives, share updates, make decisions, and coordinate efforts across different workstreams.';
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 hover:bg-gray-100">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">Meeting Details</h2>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Content with Tabs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isEditMode ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-[16px]">
                <EditMeetingForm
                  meeting={selectedMeeting.meeting}
                  currentRoom={selectedMeeting.room}
                  allRooms={allRooms}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pt-4 flex-shrink-0">
              <GlobalTabs 
                tabs={[
                  { value: 'details', label: 'Details' },
                  { value: 'attendees', label: `Attendees (${attendees.length})` }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
            
            {activeTab === 'details' && (
              <div className="flex-1 mt-0 overflow-y-auto">
              <div className="p-4 space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{selectedMeeting.meeting.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {getMeetingDescription(selectedMeeting.meeting)}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-2" />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                        {(() => {
                          const start = selectedMeeting.meeting.startTime;
                          const end = start + selectedMeeting.meeting.duration;
                          const formatTime = (time: number) => {
                            const hour = Math.floor(time);
                            const minutes = (time % 1) * 60;
                            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                            const period = hour >= 12 ? 'PM' : 'AM';
                            const minuteStr = minutes === 0 ? '00' : minutes.toString().padStart(2, '0');
                            return `${displayHour}:${minuteStr} ${period}`;
                          };
                          return `${formatTime(start)} - ${formatTime(end)}`;
                        })()}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                        {selectedMeeting.meeting.attendees} attendees
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-2" />
                        <button
                          onClick={() => onOpenRoomDetails?.(selectedMeeting.room)}
                          className="text-[#2774C1] hover:text-[#1e5a8a] hover:underline cursor-pointer text-left"
                        >
                          {selectedMeeting.meeting.rooms && selectedMeeting.meeting.rooms.length > 1 
                            ? `${selectedMeeting.room.name} +${selectedMeeting.meeting.rooms.length - 1} more`
                            : selectedMeeting.room.name}
                        </button>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-2" />
                        {selectedMeeting.meeting.organizer}
                      </div>
                    </div>
                  </div>

                  {selectedMeeting.meeting.id.includes('-relocated') && (
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-pink-600 mr-2" />
                        <span className="text-sm font-medium text-pink-800">Automatically Relocated</span>
                      </div>
                      <p className="text-xs text-pink-700 mt-1">
                        This meeting was moved due to equipment failure in Conference Room B
                      </p>
                    </div>
                  )}

                  {selectedMeeting.meeting.pendingApproval && (
                    <div className="bg-[#FFFCF0] border border-[#FFEBAB] rounded-lg p-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faLock} className="w-4 h-4 text-[#8A5006] mr-2" />
                        <span className="text-sm font-medium text-[#8A5006]">Waiting for Approval</span>
                      </div>
                      <p className="text-xs text-[#8A5006] mt-1">
                        This meeting is in a request-only space and requires admin approval before it's confirmed.
                      </p>
                    </div>
                  )}

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Room Amenities</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeeting.room.features.map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
              </div>
              </div>
            )}
            
            {activeTab === 'attendees' && (
              <div className="flex-1 mt-0 overflow-y-auto">
              <div className="p-4">
                  <div className="space-y-3">
                    {attendees.map((attendee, index) => (
                      <div key={attendee.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback className="text-xs bg-gray-200">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attendee.name}
                            </p>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Organizer
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {attendee.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isEditMode && (
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          {isPastMeeting && (
            <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                This meeting has ended and cannot be edited or deleted.
              </p>
            </div>
          )}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center space-x-2"
              onClick={handleEditDetails}
              disabled={isPastMeeting}
            >
              <FontAwesomeIcon icon={faPen} className="w-4 h-4 text-gray-500" />
              <span>Edit Details</span>
            </Button>
            
            <Popover open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  disabled={isPastMeeting}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  <span>Delete</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Delete Meeting</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Are you sure you want to delete "{selectedMeeting.meeting.title}"? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteMeeting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}