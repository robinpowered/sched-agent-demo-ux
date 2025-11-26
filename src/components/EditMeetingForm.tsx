import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { ImageWithFallback } from './common/ImageWithFallback';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faPlus,
  faUsers,
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faCheck,
  faSort,
  faTrash,
  faMagicWandSparkles
} from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';

// Import shared types
import { Meeting, Room } from '../types';

// Import shared utilities
import { formatTimeFloat } from '../utils';

interface EditMeetingFormProps {
  meeting: Meeting;
  currentRoom: Room;
  allRooms: Room[];
  onSave: (updatedMeeting: Meeting, selectedRooms: string[]) => void;
  onCancel: () => void;
  showActions?: boolean;
  fromAiSuggestion?: boolean;
  onMeetingPreviewUpdate?: (updatedFields: Partial<{
    startTime: number;
    duration: number;
    title: string;
    roomIds: string[];
  }>) => void;
  onFormValidityChange?: (isValid: boolean) => void;
}

export const EditMeetingForm = React.forwardRef<HTMLFormElement, EditMeetingFormProps>(({
  meeting,
  currentRoom,
  allRooms,
  onSave,
  onCancel,
  showActions = true,
  fromAiSuggestion = false,
  onMeetingPreviewUpdate,
  onFormValidityChange
}, ref) => {
  // Generate meeting description using the same logic as the details view
  const getMeetingDescription = (meeting: Meeting) => {
    if (meeting.description) return meeting.description;

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

  // Generate attendees using the same logic as the details view
  const generateAttendeeList = (meeting: Meeting): string[] => {
    if (meeting.attendeeList && meeting.attendeeList.length > 0) {
      return meeting.attendeeList;
    }

    // Generate attendee emails based on the meeting data
    const attendeeEmails: string[] = [];
    const attendeeCount = meeting.attendees;

    // Always include the organizer as the first attendee
    const organizerEmail = `${meeting.organizer.toLowerCase().replace(' ', '.')}@wayne-enterprises.com`;
    attendeeEmails.push(organizerEmail);

    // Generate remaining attendees using the same logic
    const firstNames = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Alex', 'Lisa', 'Chris', 'Amanda', 'Ryan', 'Jennifer', 'Daniel'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Garcia', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

    for (let i = 1; i < attendeeCount; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];

      attendeeEmails.push(`${firstName.toLowerCase()}.${lastName.toLowerCase()}@wayne-enterprises.com`);
    }

    return attendeeEmails;
  };

  // Form state
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(
    // For new meetings (empty title), start with empty description
    meeting.title === '' ? '' : getMeetingDescription(meeting)
  );
  const [date, setDate] = useState<Date>(() => {
    // Parse the meeting date or default to Oct 2, 2024
    const dateStr = meeting.date || '2024-10-02';
    return new Date(dateStr);
  });
  const [startTime, setStartTime] = useState(meeting.startTime);
  const [endTime, setEndTime] = useState(meeting.startTime + meeting.duration);
  const [isAllDay, setIsAllDay] = useState(false);
  const [attendeeList, setAttendeeList] = useState<string[]>(generateAttendeeList(meeting));
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    meeting.rooms || [currentRoom.id]
  );
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddAttendee, setShowAddAttendee] = useState(false);

  // Generate time options (8 AM to 6 PM in 30-minute intervals)
  const timeOptions = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
      const timeValue = hour + minute / 60;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      const minuteStr = minute === 0 ? '00' : minute.toString();
      timeOptions.push({
        value: timeValue,
        label: `${displayHour}:${minuteStr} ${period}`
      });
    }
  }

  // Generate all available users using the same logic as the details view
  const generateAllUsers = () => {
    const firstNames = ['Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Alex', 'Lisa', 'Chris', 'Amanda', 'Ryan', 'Jennifer', 'Daniel'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Garcia', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

    const users = [];

    for (let i = 0; i < firstNames.length; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i % lastNames.length];
      const department = departments[i % departments.length];

      users.push({
        id: `user-${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@wayne-enterprises.com`,
        department
      });
    }

    return users;
  };

  const allUsers = generateAllUsers();

  // Filter available rooms (only those that appear in the meeting grid)
  const availableRooms = allRooms.filter(room =>
    room.meetings && room.meetings.length > 0
  );

  // Get room thumbnail image
  const getRoomImage = (roomName: string) => {
    // You can customize this based on room names if needed
    return 'https://images.unsplash.com/photo-1758521541622-d1e6be8c39bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTQxNTU2OXww&ixlib=rb-4.1.0&q=80&w=1080';
  };

  const handleAddAttendee = (userEmail: string) => {
    if (userEmail && !attendeeList.includes(userEmail)) {
      setAttendeeList([...attendeeList, userEmail]);
      setShowAddAttendee(false);
    }
  };

  const handleRemoveAttendee = (email: string) => {
    const organizerEmail = `${meeting.organizer.toLowerCase().replace(' ', '.')}@wayne-enterprises.com`;
    if (email !== organizerEmail) {
      setAttendeeList(attendeeList.filter(attendee => attendee !== email));
    }
  };

  const handleAddRoom = (roomId: string) => {
    if (!selectedRooms.includes(roomId)) {
      setSelectedRooms([...selectedRooms, roomId]);
      setShowAddRoom(false);
    }
  };

  const handleRemoveRoom = (roomId: string) => {
    setSelectedRooms(selectedRooms.filter(id => id !== roomId));
  };

  const handleAllDayChange = (checked: boolean) => {
    setIsAllDay(checked);
    if (checked) {
      setStartTime(8); // 8 AM
      setEndTime(17); // 5 PM
    }
  };

  // Update meeting preview when form fields change
  useEffect(() => {
    if (onMeetingPreviewUpdate) {
      const duration = isAllDay ? 9 : endTime - startTime;
      const finalStartTime = isAllDay ? 8 : startTime;

      onMeetingPreviewUpdate({
        title,
        startTime: finalStartTime,
        duration: Math.max(0.5, duration), // Minimum 30 minutes
        roomIds: selectedRooms
      });
    }
  }, [title, startTime, endTime, isAllDay, selectedRooms, onMeetingPreviewUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const duration = isAllDay ? 9 : endTime - startTime; // 9 hours for all day (8 AM to 5 PM)
    const finalStartTime = isAllDay ? 8 : startTime;

    const updatedMeeting: Meeting = {
      ...meeting,
      title,
      description,
      date: format(date, 'yyyy-MM-dd'),
      startTime: finalStartTime,
      duration,
      attendees: attendeeList.length,
      attendeeList,
      rooms: selectedRooms
    };

    onSave(updatedMeeting, selectedRooms);
  };

  // Validation helpers
  const isValidTimeRange = !isAllDay && endTime > startTime;
  const isFormValid = selectedRooms.length > 0 && title.trim() && (isAllDay || isValidTimeRange);

  // Notify parent of form validity changes
  useEffect(() => {
    if (onFormValidityChange) {
      onFormValidityChange(isFormValid);
    }
  }, [isFormValid, onFormValidityChange]);

  const isRoomAvailable = (room: Room): boolean => {
    // Check if room has conflicting meetings at the selected time
    const meetingStart = startTime;
    const meetingEnd = endTime;

    return !room.meetings.some(existingMeeting => {
      // Skip the current meeting being edited
      if (existingMeeting.id === meeting.id) return false;

      const existingStart = existingMeeting.startTime;
      const existingEnd = existingMeeting.startTime + existingMeeting.duration;

      // Check for overlap
      return !(meetingEnd <= existingStart || meetingStart >= existingEnd);
    });
  };

  const canAccommodateAttendees = (room: Room): boolean => {
    return room.capacity >= attendeeList.length;
  };

  // Get selected room objects
  const selectedRoomObjects = selectedRooms.map(roomId =>
    availableRooms.find(room => room.id === roomId) || allRooms.find(room => room.id === roomId)
  ).filter(Boolean) as Room[];

  // Get available rooms for adding (excluding already selected ones)
  const availableRoomsForAdd = availableRooms.filter(room =>
    !selectedRooms.includes(room.id) &&
    isRoomAvailable(room) &&
    canAccommodateAttendees(room) &&
    room.status !== 'offline'
  );

  // Get available users for adding (excluding already selected ones)
  const availableUsersForAdd = allUsers.filter(user =>
    !attendeeList.includes(user.email)
  );

  return (
    <div className="w-full min-w-0">
      <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
        {/* Meeting Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Meeting Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              className="mt-1 w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting description"
              className="mt-1 w-full"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-1 w-full justify-start text-left border-[#868686] hover:border-[#868686] hover:bg-white"
                  style={{ fontSize: '14px', fontWeight: 400 }}
                >
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4 text-gray-500" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={isAllDay}
                onCheckedChange={handleAllDayChange}
              />
              <Label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                All day
              </Label>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Start Time
                  </Label>
                  <Select value={startTime.toString()} onValueChange={(value) => setStartTime(parseFloat(value))}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    End Time
                  </Label>
                  <Select value={endTime.toString()} onValueChange={(value) => setEndTime(parseFloat(value))}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {!isAllDay && endTime <= startTime && (
              <p className="text-sm text-red-600">End time must be after start time.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Room Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">
              Meeting Rooms ({selectedRooms.length} selected)
            </Label>
          </div>

          {/* Selected Rooms */}
          <div className="space-y-3">
            {selectedRoomObjects.map((room) => (
              <Card key={room.id} className="overflow-hidden border-gray-200 rounded-[4px]">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <ImageWithFallback
                        src={getRoomImage(room.name)}
                        alt={room.name}
                        className="w-full h-full object-cover"
                        fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2'/%3E%3Cpath d='M3 11h18'/%3E%3Cpath d='M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4'/%3E%3C/svg%3E"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {room.name}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRoom(room.id)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 flex-shrink-0"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {room.capacity} people
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">Floor {room.floor}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {room.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Room Button */}
          {availableRoomsForAdd.length > 0 && (
            <Popover open={showAddRoom} onOpenChange={setShowAddRoom}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2 text-gray-500" />
                  Add Room
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search rooms..." />
                  <CommandEmpty>No rooms found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableRoomsForAdd.map((room) => (
                      <CommandItem
                        key={room.id}
                        onSelect={() => handleAddRoom(room.id)}
                        className="flex items-center space-x-3 p-3"
                      >
                        <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback
                            src={getRoomImage(room.name)}
                            alt={room.name}
                            className="w-full h-full object-cover"
                            fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2'/%3E%3Cpath d='M3 11h18'/%3E%3Cpath d='M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4'/%3E%3C/svg%3E"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {room.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              Floor {room.floor}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {room.capacity} people • {room.features.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {selectedRooms.length === 0 && (
            <p className="text-sm text-red-600">Please select at least one room for the meeting.</p>
          )}
        </div>

        <Separator />

        {/* Attendees */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">
              Attendees ({attendeeList.length})
            </Label>
          </div>

          <div className="space-y-2">
            {attendeeList.map((attendeeEmail, index) => {
              const user = allUsers.find(u => u.email === attendeeEmail);
              const isOrganizer = attendeeEmail === `${meeting.organizer.toLowerCase().replace(' ', '.')}@wayne-enterprises.com`;

              // Generate name from email if user not found
              const displayName = user ? user.name :
                attendeeEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
              const displayDepartment = user ? user.department : 'Unknown';

              return (
                <React.Fragment key={index}>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-pink-600">
                        {displayName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {displayName}
                        </span>
                        {isOrganizer && (
                          <Badge variant="secondary" className="text-xs">
                            Organizer
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {attendeeEmail} • {displayDepartment}
                      </div>
                    </div>
                    {!isOrganizer && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttendee(attendeeEmail)}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 flex-shrink-0"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* AI Banner after organizer */}
                  {isOrganizer && fromAiSuggestion && attendeeList.length > 1 && (
                    <div className="relative rounded-lg p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faMagicWandSparkles} className="w-4 h-4 text-pink-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          These 3 people usually attend your team meetings.
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Add Attendee */}
          {availableUsersForAdd.length > 0 && (
            <Popover open={showAddAttendee} onOpenChange={setShowAddAttendee}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2 text-gray-500" />
                  Add Attendee
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search people..." />
                  <CommandEmpty>No people found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {availableUsersForAdd.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleAddAttendee(user.email)}
                        className="flex items-center space-x-3 p-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-pink-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email} • {user.department}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Form Actions */}
        {showActions && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-pink-600 hover:bg-pink-700"
            >
              {meeting.id === 'new-meeting' ? 'Book' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  );
});

EditMeetingForm.displayName = 'EditMeetingForm';