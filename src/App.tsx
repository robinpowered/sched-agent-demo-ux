import React, { useState, useCallback } from 'react';
import { PageLayout } from './components/PageLayout';
import { MeetingSpacesPage } from './components/MeetingSpacesPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './components/ui/alert-dialog';
import { CateringOrderDetails } from './components/CateringOrderPreview';

// Import shared types
import { View, SidebarType, Message, ChatSession, Meeting, Room, MeetingRoomFilters, MeetingCreationContext, ServiceTicket } from './types';

// Import shared constants
import { DEFAULT_TIME_WINDOW } from './constants';

// Import shared utilities
import { getPageTitle, getFilteredRooms as filterRooms, getRoomType, getPreviousTimeWindow, getNextTimeWindow, shouldHideLocationPicker, shouldHideDatePicker, formatTimeFloat } from './utils';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('meeting-spaces');

  // AI Assistant state - persistent across navigation
  const [aiAssistantMessages, setAiAssistantMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Catering order state
  const [cateringOrderDetails, setCateringOrderDetails] = useState<CateringOrderDetails>({
    items: [],
    totalCost: 0,
  });
  const [isWaitingForMeetingSelection, setIsWaitingForMeetingSelection] = useState(false);
  const [cateringOrderSubmitted, setCateringOrderSubmitted] = useState(false);
  const [cateringTicketNumber, setCateringTicketNumber] = useState<string | null>(null);

  // Service tickets state
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>([
    {
      id: 'SRV-001425',
      status: 'completed',
      eventStartTime: '2025-11-05T09:00:00.000Z',
      serviceName: 'Coffee & Pastries',
      space: 'Conference Room A',
      eventTitle: 'Marketing Review',
      approver: 'Jennifer Martin',
      requester: 'Sarah Johnson',
      assignee: 'ezCater Services',
      category: 'catering',
      created: '2025-11-04T15:30:00.000Z',
      lastUpdated: '2025-11-05T09:15:00.000Z',
      description: 'Morning coffee service with assorted pastries for team meeting',
      items: [
        { name: 'Coffee Service (12 cups)', quantity: 1, price: 35.00 },
        { name: 'Assorted Pastries', quantity: 12, price: 48.00 }
      ],
      totalCost: 83.00,
    },
    {
      id: 'SRV-001398',
      status: 'in-progress',
      eventStartTime: '2025-11-07T14:00:00.000Z',
      serviceName: 'AV Equipment Setup',
      space: 'Board Room',
      eventTitle: 'Executive Board Meeting',
      approver: 'Robert Thompson',
      requester: 'David Kim',
      assignee: 'Marcus Johnson',
      category: 'av-support',
      created: '2025-11-03T10:20:00.000Z',
      lastUpdated: '2025-11-07T08:30:00.000Z',
      description: 'Setup dual displays, video conferencing equipment, and wireless presentation system',
      notes: 'Test all equipment 1 hour before meeting starts',
    },
    {
      id: 'SRV-001412',
      status: 'approved',
      eventStartTime: '2025-11-08T12:00:00.000Z',
      serviceName: 'Lunch Catering - Italian',
      space: 'Large Conference Room',
      eventTitle: 'Product Launch Planning',
      approver: 'Jennifer Martin',
      requester: 'Emily Rodriguez',
      assignee: 'ezCater Services',
      category: 'catering',
      created: '2025-11-06T09:15:00.000Z',
      lastUpdated: '2025-11-06T14:20:00.000Z',
      description: 'Italian lunch buffet for 25 people',
      items: [
        { name: 'Caesar Salad (serves 25)', quantity: 1, price: 75.00 },
        { name: 'Pasta Primavera', quantity: 2, price: 120.00 },
        { name: 'Chicken Parmesan', quantity: 2, price: 150.00 },
        { name: 'Garlic Bread', quantity: 3, price: 24.00 },
        { name: 'Tiramisu (serves 25)', quantity: 1, price: 85.00 }
      ],
      totalCost: 454.00,
    },
    {
      id: 'SRV-001389',
      status: 'pending',
      eventStartTime: '2025-11-09T10:00:00.000Z',
      serviceName: 'Room Setup - Theater Style',
      space: 'Multi-Purpose Room',
      eventTitle: 'All-Hands Company Meeting',
      approver: 'Robert Thompson',
      requester: 'HR Department',
      assignee: 'Facilities Team',
      category: 'setup',
      created: '2025-11-02T16:45:00.000Z',
      lastUpdated: '2025-11-02T16:45:00.000Z',
      description: 'Theater-style seating for 80 people, podium, microphone, and projector setup',
      notes: 'Setup required by 9:00 AM',
    },
    {
      id: 'SRV-001356',
      status: 'completed',
      eventStartTime: '2025-11-04T13:30:00.000Z',
      serviceName: 'Post-Event Cleaning',
      space: 'Training Room B',
      eventTitle: 'Customer Workshop',
      approver: 'Jennifer Martin',
      requester: 'Training Department',
      assignee: 'Cleaning Services',
      category: 'cleaning',
      created: '2025-11-03T11:00:00.000Z',
      lastUpdated: '2025-11-04T16:30:00.000Z',
      description: 'Deep cleaning after full-day workshop with food service',
    },
    {
      id: 'SRV-001403',
      status: 'approved',
      eventStartTime: '2025-11-07T15:30:00.000Z',
      serviceName: 'Coffee & Snacks',
      space: 'Innovation Lab',
      eventTitle: 'Design Sprint Day 3',
      approver: 'Jennifer Martin',
      requester: 'Michael Torres',
      assignee: 'ezCater Services',
      category: 'catering',
      created: '2025-11-05T13:20:00.000Z',
      lastUpdated: '2025-11-06T09:10:00.000Z',
      description: 'Afternoon coffee service and healthy snacks for design team',
      items: [
        { name: 'Coffee Service (15 cups)', quantity: 1, price: 42.00 },
        { name: 'Assorted Energy Bars', quantity: 15, price: 30.00 },
        { name: 'Fresh Fruit Platter', quantity: 1, price: 35.00 }
      ],
      totalCost: 107.00,
    },
    {
      id: 'SRV-001367',
      status: 'cancelled',
      eventStartTime: '2025-11-06T09:00:00.000Z',
      serviceName: 'Breakfast Catering',
      space: 'Conference Room C',
      eventTitle: 'Team Sync',
      approver: 'Jennifer Martin',
      requester: 'Alex Chen',
      assignee: 'ezCater Services',
      category: 'catering',
      created: '2025-11-01T14:30:00.000Z',
      lastUpdated: '2025-11-05T10:15:00.000Z',
      description: 'Breakfast meeting cancelled due to schedule conflict',
      notes: 'Cancelled with 24hr notice - no fees',
    },
    {
      id: 'SRV-001378',
      status: 'in-progress',
      eventStartTime: '2025-11-08T09:00:00.000Z',
      serviceName: 'Video Recording Setup',
      space: 'Presentation Studio',
      eventTitle: 'Webinar Recording Session',
      approver: 'Robert Thompson',
      requester: 'Marketing Team',
      assignee: 'Marcus Johnson',
      category: 'av-support',
      created: '2025-11-01T09:00:00.000Z',
      lastUpdated: '2025-11-07T14:45:00.000Z',
      description: 'Professional video recording setup with lighting and audio for webinar content',
      notes: 'Test recording session scheduled for Nov 7 at 4pm',
    },
  ]);
  const [selectedServiceTicket, setSelectedServiceTicket] = useState<ServiceTicket | null>(null);

  // Sidebar state - persistent across navigation
  const [sidebarState, setSidebarState] = useState<SidebarType>('none');
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [isWorkplaceExpanded, setIsWorkplaceExpanded] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  // Meeting details state - for meeting details sidebar
  const [selectedMeetingDetails, setSelectedMeetingDetails] = useState<{
    meeting: {
      id: string;
      title: string;
      organizer: string;
      startTime: number;
      duration: number;
      attendees: number;
    };
    room: {
      id: string;
      name: string;
      capacity: number;
      floor: number;
      status: string;
      features: string[];
    };
  } | null>(null);

  // Meeting creation state
  const [meetingCreationContext, setMeetingCreationContext] = useState<{
    roomId: string;
    startTime: number;
    title?: string;
    duration?: number;
    attendees?: number;
    fromAiSuggestion?: boolean;
  } | null>(null);

  // Room details state - for room details sidebar
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);

  // Navigation context - tracks if room details was opened from meeting details
  const [roomDetailsNavigationContext, setRoomDetailsNavigationContext] = useState<{
    previousSidebar: 'meeting-details' | null;
    previousMeetingDetails?: typeof selectedMeetingDetails;
  } | null>(null);

  // Rooms data - moved from MeetingSpacesPage to make it modifiable
  const [rooms, setRooms] = useState<Room[]>([
    // Floor 1 Rooms
    {
      id: 'conf-a',
      name: 'Conference Room A',
      capacity: 8,
      floor: 1,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Video Conf'],
      meetings: [
        { id: 'meet-1', title: 'Marketing Review', organizer: 'Sarah Johnson', startTime: 9, duration: 1, attendees: 6 },
        { id: 'meet-2', title: 'Client Presentation', organizer: 'Mike Chen', startTime: 14, duration: 2, attendees: 4 }
      ]
    },
    {
      id: 'conf-b',
      name: 'Executive Conference Room B',
      capacity: 12,
      floor: 1,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System'],
      requestOnly: true,
      meetings: [
        { id: 'meet-3', title: 'Team Standup', organizer: 'Alex Rodriguez', startTime: 10, duration: 0.5, attendees: 8 },
        { id: 'meet-4', title: 'Product Demo', organizer: 'Lisa Wang', startTime: 15, duration: 1.5, attendees: 10 },
        { id: 'meet-5', title: 'Sprint Planning', organizer: 'Jane Doe', startTime: 8, duration: 2, attendees: 7 }
      ]
    },
    {
      id: 'conf-c',
      name: 'Conference Room C',
      capacity: 6,
      floor: 1,
      status: 'available',
      features: ['Whiteboard', 'Monitor', 'Video Conf'],
      meetings: [
        { id: 'meet-6', title: 'Design Review', organizer: 'Emma Thompson', startTime: 11, duration: 1, attendees: 5 },
        { id: 'meet-7', title: 'Budget Review', organizer: 'Jane Doe', startTime: 16, duration: 1, attendees: 4 }
      ]
    },
    {
      id: 'huddle-1',
      name: 'Huddle Room 1',
      capacity: 4,
      floor: 1,
      status: 'available',
      features: ['Monitor', 'Video Conf'],
      meetings: [
        { id: 'meet-8', title: '1:1 Check-in', organizer: 'Michael Brown', startTime: 13, duration: 0.5, attendees: 2 },
        { id: 'meet-9', title: 'Quick Sync', organizer: 'Amanda Foster', startTime: 17, duration: 0.5, attendees: 3 }
      ]
    },
    {
      id: 'focus-room-1',
      name: 'Focus Room 1',
      capacity: 6,
      floor: 1,
      status: 'available',
      features: ['Whiteboard', 'Monitor', 'Video Conf', 'Noise Cancellation'],
      meetings: [
        { id: 'meet-10', title: 'Engineering Deep Dive', organizer: 'Carlos Martinez', startTime: 9, duration: 3, attendees: 5 },
        { id: 'meet-11', title: 'Code Review Session', organizer: 'Tom Wilson', startTime: 14, duration: 1, attendees: 4 }
      ]
    },
    {
      id: 'creative-space-1',
      name: 'Creative Space 1',
      capacity: 10,
      floor: 1,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Flexible Seating', 'Art Supplies', 'Video Conf'],
      meetings: [
        { id: 'meet-12', title: 'Brand Workshop', organizer: 'Jessica Lee', startTime: 10, duration: 2, attendees: 8 },
        { id: 'meet-13', title: 'Innovation Brainstorm', organizer: 'Mark Thompson', startTime: 15, duration: 1.5, attendees: 6 }
      ]
    },

    // Floor 2 Rooms
    {
      id: 'board-room',
      name: 'Board Room',
      capacity: 16,
      floor: 2,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'Executive Seating'],
      meetings: [
        { id: 'meet-14', title: 'Board Meeting', organizer: 'David Kim', startTime: 13, duration: 2, attendees: 12 },
        { id: 'meet-15', title: 'Quarterly Review', organizer: 'Jane Doe', startTime: 10, duration: 2, attendees: 8 }
      ]
    },
    {
      id: 'training-room',
      name: 'Professional Development Center',
      capacity: 20,
      floor: 2,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Audio System', 'Multiple Monitors', 'Video Conf'],
      meetings: [
        { id: 'meet-16', title: 'New Hire Training', organizer: 'Rachel Green', startTime: 9, duration: 4, attendees: 15 },
        { id: 'meet-17', title: 'Sales Workshop', organizer: 'Steve Davis', startTime: 14, duration: 2, attendees: 12 }
      ]
    },
    {
      id: 'small-meeting-1',
      name: 'Small Meeting Room 1',
      capacity: 4,
      floor: 2,
      status: 'available',
      features: ['Monitor', 'Whiteboard', 'Video Conf'],
      meetings: [
        { id: 'meet-18', title: 'Performance Review', organizer: 'Linda Johnson', startTime: 11, duration: 1, attendees: 2 },
        { id: 'meet-19', title: 'Vendor Call', organizer: 'Robert Chen', startTime: 16, duration: 1, attendees: 3 }
      ]
    },
    {
      id: 'executive-suite',
      name: 'Executive Suite',
      capacity: 8,
      floor: 2,
      status: 'available',
      features: ['Projector', 'Video Conf', 'Audio System', 'Premium Seating'],
      requestOnly: true,
      meetings: [
        { id: 'meet-20', title: 'Leadership Sync', organizer: 'Patricia Moore', startTime: 8, duration: 1, attendees: 6 },
        { id: 'meet-21', title: 'Strategic Planning', organizer: 'William Taylor', startTime: 15, duration: 2, attendees: 7 },
        { id: 'meet-pending-1', title: 'Executive Review', organizer: 'Jane Doe', startTime: 11, duration: 1, attendees: 5 }
      ]
    },
    {
      id: 'collaboration-hub',
      name: 'Collaboration Hub',
      capacity: 12,
      floor: 2,
      status: 'available',
      features: ['Multiple Monitors', 'Whiteboard', 'Video Conf', 'Flexible Layout'],
      meetings: [
        { id: 'meet-22', title: 'Cross-team Alignment', organizer: 'Nancy Williams', startTime: 9, duration: 1.5, attendees: 10 },
        { id: 'meet-23', title: 'Product Roadmap', organizer: 'Kevin Anderson', startTime: 13, duration: 2, attendees: 9 }
      ]
    },
    {
      id: 'innovation-lab',
      name: 'Innovation Lab',
      capacity: 14,
      floor: 2,
      status: 'available',
      features: ['Interactive Display', 'Whiteboard', 'Video Conf', 'Research Tools'],
      meetings: [
        { id: 'meet-24', title: 'Research Review', organizer: 'Daniel Garcia', startTime: 10, duration: 2, attendees: 8 },
        { id: 'meet-25', title: 'Tech Talk', organizer: 'Sarah Martinez', startTime: 16, duration: 1, attendees: 12 }
      ]
    },

    // Floor 3 Rooms
    {
      id: 'skyline-suite',
      name: 'Skyline Suite - Premium View',
      capacity: 18,
      floor: 3,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'Premium View'],
      requestOnly: true,
      meetings: [
        { id: 'meet-26', title: 'Executive Presentation', organizer: 'Bruce Wayne', startTime: 9, duration: 2, attendees: 15 },
        { id: 'meet-27', title: 'Investor Meeting', organizer: 'Lucius Fox', startTime: 14, duration: 1.5, attendees: 12 }
      ]
    },
    {
      id: 'design-studio',
      name: 'Design Studio',
      capacity: 10,
      floor: 3,
      status: 'available',
      features: ['Whiteboard', 'Multiple Monitors', 'Video Conf', 'Art Supplies', 'Standing Desks'],
      meetings: [
        { id: 'meet-28', title: 'UX Review', organizer: 'Selina Kyle', startTime: 10, duration: 1.5, attendees: 7 },
        { id: 'meet-29', title: 'Design Sprint', organizer: 'Dick Grayson', startTime: 15, duration: 2, attendees: 8 }
      ]
    },
    {
      id: 'tech-lab',
      name: 'Tech Lab',
      capacity: 8,
      floor: 3,
      status: 'available',
      features: ['Multiple Monitors', 'Whiteboard', 'Video Conf', 'Dev Tools'],
      meetings: [
        { id: 'meet-30', title: 'Architecture Review', organizer: 'Barbara Gordon', startTime: 8.5, duration: 1.5, attendees: 6 },
        { id: 'meet-31', title: 'Code Demo', organizer: 'Tim Drake', startTime: 13, duration: 1, attendees: 5 }
      ]
    },
    {
      id: 'huddle-2',
      name: 'Huddle Room 2',
      capacity: 4,
      floor: 3,
      status: 'available',
      features: ['Monitor', 'Video Conf'],
      meetings: [
        { id: 'meet-32', title: 'Weekly 1:1', organizer: 'Alfred Pennyworth', startTime: 11, duration: 0.5, attendees: 2 },
        { id: 'meet-33', title: 'Quick Standup', organizer: 'Commissioner Gordon', startTime: 16.5, duration: 0.5, attendees: 3 }
      ]
    },
    {
      id: 'penthouse-conf',
      name: 'Penthouse Conference',
      capacity: 12,
      floor: 3,
      status: 'available',
      features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'City View'],
      meetings: [
        { id: 'meet-34', title: 'All Hands Meeting', organizer: 'You', startTime: 9, duration: 1, attendees: 11 },
        { id: 'meet-35', title: 'Strategy Session', organizer: 'Rachel Dawes', startTime: 14.5, duration: 2, attendees: 10 }
      ]
    },
    {
      id: 'think-tank',
      name: 'Think Tank',
      capacity: 6,
      floor: 3,
      status: 'available',
      features: ['Whiteboard', 'Monitor', 'Video Conf', 'Quiet Space'],
      meetings: [
        { id: 'meet-36', title: 'Problem Solving Workshop', organizer: 'Edward Nygma', startTime: 10.5, duration: 2, attendees: 5 },
        { id: 'meet-37', title: 'Innovation Brainstorm', organizer: 'Harvey Dent', startTime: 15.5, duration: 1.5, attendees: 6 }
      ]
    }
  ]);

  // Spotlight my events state for meeting spaces
  const [spotlightMyEvents, setSpotlightMyEvents] = useState(false);

  // Compact view state for meeting spaces (default is true - compact view is default)
  const [compactView, setCompactView] = useState(true);

  // Timezone state for meeting spaces
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['America/New_York']); // Default timezone

  // Pinned rooms state for meeting spaces
  const [pinnedRoomIds, setPinnedRoomIds] = useState<string[]>([]);

  // Filter state for meeting spaces
  const [activeFilters, setActiveFilters] = useState<MeetingRoomFilters>({
    duration: 'any',
    amenities: [],
    capacity: 'any',
    types: [],
    show: 'all',
    onlyShowAvailable: false
  });

  // Floor selection state for map page
  const [selectedFloor, setSelectedFloor] = useState<string>('1');

  // Tab state for my-schedule page
  const [myScheduleTab, setMyScheduleTab] = useState<string>('workweek');

  // Tab state for people page
  const [peopleTab, setPeopleTab] = useState<string>('organization');

  // Time window state for meeting spaces grid (startHour in 24-hour format)
  const [timeWindowStart, setTimeWindowStart] = useState<number>(DEFAULT_TIME_WINDOW);

  // Meeting spaces view mode state (day/week/month)
  const [meetingSpacesViewMode, setMeetingSpacesViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedMonthViewRoom, setSelectedMonthViewRoom] = useState<string | null>(null);

  // Handlers for time navigation - cycles through three windows
  const handleTimeWindowPrevious = () => {
    setTimeWindowStart(prev => getPreviousTimeWindow(prev));
  };

  const handleTimeWindowNext = () => {
    setTimeWindowStart(prev => getNextTimeWindow(prev));
  };

  const handleTimeWindowNow = () => {
    setTimeWindowStart(DEFAULT_TIME_WINDOW);
  };

  // Use shared filter function (imported as filterRooms to avoid naming conflict)
  const getFilteredRoomsLocal = (rooms: Room[], filters: MeetingRoomFilters): Room[] => {
    return filterRooms(rooms, filters, demoTimeOverride);
  };

  // Navigation warning state - for unsaved meeting moves
  const [hasPendingMove, setHasPendingMove] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<View | null>(null);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);

  // Basic notification system
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 'welcome-1',
      type: 'info',
      title: 'Welcome to Robin!',
      description: 'Your workplace management dashboard is ready to use',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true,
      action: null
    },
    {
      id: 'system-1',
      type: 'success',
      title: 'System Update Complete',
      description: 'All room displays have been updated successfully',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      action: null
    }
  ]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Timestamp state for forcing re-renders when time changes (for filter updates)
  const [currentTimeStamp, setCurrentTimeStamp] = React.useState(Date.now());

  // Demo mode: Override current time for demonstration purposes
  const [demoTimeOverride, setDemoTimeOverride] = React.useState<number | null>(null);

  // Offline room meeting resolution state
  const [offlineRoomResolution, setOfflineRoomResolution] = useState<{
    affectedMeetings: Array<{
      meeting: Meeting;
      roomId: string;
      roomName: string;
    }>;
    currentIndex: number;
    selectedAlternativeRoomId: string | null;
  } | null>(null);

  // Auto check-in meetings when current time passes their start time
  React.useEffect(() => {
    // Determine the current effective time
    const now = new Date();
    const currentHour = demoTimeOverride !== null ? demoTimeOverride : (now.getHours() + now.getMinutes() / 60);

    // Update timestamp to force re-render for filters
    setCurrentTimeStamp(Date.now());

    // Check in meetings based on current time (real or demo)
    setRooms(prevRooms => {
      let updated = false;
      const newRooms = prevRooms.map(room => {
        const updatedMeetings = room.meetings.map(meeting => {
          // Auto check-in if:
          // 1. Not already checked in
          // 2. Current time is past start time
          // 3. Meeting hasn't ended yet
          const meetingEndTime = meeting.startTime + meeting.duration;
          const shouldCheckIn = !meeting.checkedIn &&
            currentHour >= meeting.startTime &&
            currentHour < meetingEndTime;

          if (shouldCheckIn) {
            updated = true;
            return {
              ...meeting,
              checkedIn: true,
              checkInTime: currentHour
            };
          }
          return meeting;
        });

        if (JSON.stringify(updatedMeetings) !== JSON.stringify(room.meetings)) {
          return { ...room, meetings: updatedMeetings };
        }
        return room;
      });

      return updated ? newRooms : prevRooms;
    });

    // Set up interval only when NOT in demo mode
    if (demoTimeOverride === null) {
      const checkInInterval = setInterval(() => {
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;

        // Update timestamp to force re-render for filters
        setCurrentTimeStamp(Date.now());

        setRooms(prevRooms => {
          let updated = false;
          const newRooms = prevRooms.map(room => {
            const updatedMeetings = room.meetings.map(meeting => {
              const meetingEndTime = meeting.startTime + meeting.duration;
              const shouldCheckIn = !meeting.checkedIn &&
                currentHour >= meeting.startTime &&
                currentHour < meetingEndTime;

              if (shouldCheckIn) {
                updated = true;
                return {
                  ...meeting,
                  checkedIn: true,
                  checkInTime: currentHour
                };
              }
              return meeting;
            });

            if (JSON.stringify(updatedMeetings) !== JSON.stringify(room.meetings)) {
              return { ...room, meetings: updatedMeetings };
            }
            return room;
          });

          return updated ? newRooms : prevRooms;
        });
      }, 60000); // Check every minute

      return () => clearInterval(checkInInterval);
    }
  }, [demoTimeOverride]);

  // Detect meetings in offline rooms and set up resolution workflow
  React.useEffect(() => {
    const now = new Date();
    const currentHour = demoTimeOverride !== null ? demoTimeOverride : (now.getHours() + now.getMinutes() / 60);

    // Find all offline rooms
    const offlineRooms = rooms.filter(room => room.status === 'offline');

    if (offlineRooms.length === 0) {
      // No offline rooms, clear resolution state if it exists
      if (offlineRoomResolution) {
        setOfflineRoomResolution(null);
      }
      return;
    }

    // Find all meetings in offline rooms that haven't ended yet (present or future)
    const affectedMeetings: Array<{
      meeting: Meeting;
      roomId: string;
      roomName: string;
    }> = [];

    offlineRooms.forEach(room => {
      room.meetings.forEach(meeting => {
        const meetingEndTime = meeting.startTime + meeting.duration;
        // Include if meeting hasn't ended yet (current time < end time)
        if (currentHour < meetingEndTime) {
          affectedMeetings.push({
            meeting,
            roomId: room.id,
            roomName: room.name
          });
        }
      });
    });

    // Sort by start time (earliest first)
    affectedMeetings.sort((a, b) => a.meeting.startTime - b.meeting.startTime);

    // If there are affected meetings and we don't have an active resolution, start one
    if (affectedMeetings.length > 0 && !offlineRoomResolution) {
      setOfflineRoomResolution({
        affectedMeetings,
        currentIndex: 0,
        selectedAlternativeRoomId: null
      });
    } else if (affectedMeetings.length === 0 && offlineRoomResolution) {
      // All meetings resolved, clear the state
      setOfflineRoomResolution(null);
    }
  }, [rooms, demoTimeOverride, offlineRoomResolution]);

  // Handler to navigate to next offline meeting
  const handleNextOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    const nextIndex = offlineRoomResolution.currentIndex + 1;
    // Wrap around to start if at the end
    const newIndex = nextIndex >= offlineRoomResolution.affectedMeetings.length
      ? 0
      : nextIndex;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      currentIndex: newIndex,
      selectedAlternativeRoomId: null // Reset selection for new meeting
    });
  };

  // Handler to navigate to previous offline meeting
  const handlePreviousOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    const prevIndex = offlineRoomResolution.currentIndex - 1;
    // Wrap around to end if at the start
    const newIndex = prevIndex < 0
      ? offlineRoomResolution.affectedMeetings.length - 1
      : prevIndex;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      currentIndex: newIndex,
      selectedAlternativeRoomId: null // Reset selection for new meeting
    });
  };

  // Handler to select alternative room for current offline meeting
  const handleSelectOfflineAlternativeRoom = (roomId: string) => {
    if (!offlineRoomResolution) return;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      selectedAlternativeRoomId: roomId
    });
  };

  // Handler to move current offline meeting to selected alternative room
  const handleMoveOfflineMeeting = () => {
    if (!offlineRoomResolution || !offlineRoomResolution.selectedAlternativeRoomId) return;

    const currentMeetingData = offlineRoomResolution.affectedMeetings[offlineRoomResolution.currentIndex];
    const targetRoomId = offlineRoomResolution.selectedAlternativeRoomId;

    // Move the meeting
    handleEditMeeting(currentMeetingData.meeting, [targetRoomId]);

    // Remove this meeting from affected meetings list
    const updatedAffectedMeetings = offlineRoomResolution.affectedMeetings.filter(
      (_, index) => index !== offlineRoomResolution.currentIndex
    );

    if (updatedAffectedMeetings.length === 0) {
      // No more meetings to resolve
      setOfflineRoomResolution(null);
      toast.success('All offline room meetings have been relocated!', { duration: 3000 });
    } else {
      // Move to next meeting (or stay at same index if we were on the last one)
      const newIndex = offlineRoomResolution.currentIndex >= updatedAffectedMeetings.length
        ? updatedAffectedMeetings.length - 1
        : offlineRoomResolution.currentIndex;

      setOfflineRoomResolution({
        affectedMeetings: updatedAffectedMeetings,
        currentIndex: newIndex,
        selectedAlternativeRoomId: null
      });

      const room = rooms.find(r => r.id === targetRoomId);
      toast.success(`Meeting moved to ${room?.name || 'new room'}!`, { duration: 3000 });
    }
  };

  // Handler to skip current offline meeting
  const handleSkipOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    // Remove this meeting from affected meetings list
    const updatedAffectedMeetings = offlineRoomResolution.affectedMeetings.filter(
      (_, index) => index !== offlineRoomResolution.currentIndex
    );

    if (updatedAffectedMeetings.length === 0) {
      // No more meetings to resolve
      setOfflineRoomResolution(null);
    } else {
      // Move to next meeting (or stay at same index if we were on the last one)
      const newIndex = offlineRoomResolution.currentIndex >= updatedAffectedMeetings.length
        ? updatedAffectedMeetings.length - 1
        : offlineRoomResolution.currentIndex;

      setOfflineRoomResolution({
        affectedMeetings: updatedAffectedMeetings,
        currentIndex: newIndex,
        selectedAlternativeRoomId: null
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Check if any notifications are still unread
    const stillHasUnread = notifications.some(n => n.id !== notification.id && !n.read);
    setHasUnreadNotifications(stillHasUnread);

    // Handle navigation based on notification action
    if (notification.action === 'view-tickets') {
      setCurrentView('tickets');
    } else if (notification.action === 'view-meeting-spaces') {
      setCurrentView('meeting-spaces');
    }
  };

  const handleNotificationPopoverClose = () => {
    // Mark all unread notifications as read when popover closes
    const hasUnread = notifications.some(n => !n.read);
    if (hasUnread) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setHasUnreadNotifications(false);
    }
  };

  // Chat history management functions
  const generateChatTitle = (messages: Message[]): string => {
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return 'New Chat';

    const firstMessage = userMessages[0].content;
    // Take first 50 characters and add ellipsis if longer
    return firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage;
  };

  const saveCurrentChatToHistory = () => {
    if (aiAssistantMessages.length === 0) return;

    const chatSession: ChatSession = {
      id: currentChatId || Date.now().toString(),
      title: generateChatTitle(aiAssistantMessages),
      messages: [...aiAssistantMessages],
      createdAt: currentChatId ? chatHistory.find(c => c.id === currentChatId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(c => c.id === chatSession.id);
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prev];
        updated[existingIndex] = chatSession;
        return updated;
      } else {
        // Add new chat to the beginning
        return [chatSession, ...prev];
      }
    });
  };

  const loadChatFromHistory = (chatSession: ChatSession) => {
    setAiAssistantMessages(chatSession.messages);
    setCurrentChatId(chatSession.id);

    // Clear current preview first
    setAiMeetingPreview(null);
    setHighlightedRoomId(null);
    setPreviewChatId(null);

    // Check if this chat has active room suggestions and restore preview
    const lastMessageWithSuggestions = [...chatSession.messages]
      .reverse()
      .find(msg => msg.showRoomSuggestions && msg.meetingRequirements);

    if (lastMessageWithSuggestions?.meetingRequirements) {
      // Restore the preview for this chat
      setPreviewChatId(chatSession.id);
      // The preview will be set by the RoomBookingSuggestions component when it renders
    }
  };

  const startNewChat = () => {
    if (aiAssistantMessages.length > 0) {
      saveCurrentChatToHistory();
    }
    setAiAssistantMessages([]);
    setCurrentChatId(null);

    // Clear preview when starting new chat
    setAiMeetingPreview(null);
    setHighlightedRoomId(null);
    setPreviewChatId(null);
  };

  const handleAiAssistantMessagesUpdate = (messages: Message[]) => {
    setAiAssistantMessages(messages);

    // If this is the first message and we don't have a currentChatId yet, create one
    if (messages.length > 0 && !currentChatId) {
      setCurrentChatId(Date.now().toString());
      return; // Don't auto-save on the first message, just assign ID
    }

    // Auto-save to history when messages are updated (for real-time persistence)
    if (messages.length > 0 && currentChatId) {
      // Debounced save - only save if this is an existing chat
      setTimeout(() => {
        const chatSession: ChatSession = {
          id: currentChatId,
          title: generateChatTitle(messages),
          messages: [...messages],
          createdAt: chatHistory.find(c => c.id === currentChatId)?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setChatHistory(prev => {
          const existingIndex = prev.findIndex(c => c.id === currentChatId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = chatSession;
            return updated;
          }
          return prev;
        });
      }, 1000);
    }
  };

  const handleNavigate = (view: View) => {
    // Check if we're leaving meeting-spaces with a pending move
    if (currentView === 'meeting-spaces' && hasPendingMove && view !== 'meeting-spaces') {
      setPendingNavigation(view);
      setShowNavigationWarning(true);
      return;
    }

    // Proceed with navigation
    performNavigation(view);
  };

  const performNavigation = (view: View) => {
    setCurrentView(view);

    // Manage sidebar state on navigation
    if (!aiAssistantOpen) {
      setSidebarState('none');
    } else {
      // Keep AI assistant open
      setSidebarState('ai-assistant');
    }
  };

  const handleNavigationConfirm = () => {
    if (pendingNavigation) {
      performNavigation(pendingNavigation);
    }
    setShowNavigationWarning(false);
    setPendingNavigation(null);
    setHasPendingMove(false); // Clear pending move since we're leaving
  };

  const handleNavigationCancel = () => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };

  const handlePendingMoveChange = (hasPending: boolean) => {
    setHasPendingMove(hasPending);
  };

  // Service ticket handlers
  const handleCreateServiceTicket = useCallback((ticketData: Omit<ServiceTicket, 'id' | 'created' | 'lastUpdated'>) => {
    const ticketId = `SRV-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();
    const newTicket: ServiceTicket = {
      id: ticketId,
      ...ticketData,
      created: now,
      lastUpdated: now,
    };

    setServiceTickets(prev => [newTicket, ...prev]);

    // Store the ticket number for the AI to reference (especially for catering orders)
    setCateringTicketNumber(ticketId);

    return newTicket;
  }, []);

  const handleOpenServiceTicket = useCallback((ticketId: string) => {
    const ticket = serviceTickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedServiceTicket(ticket);
      setSidebarState('service-ticket');
    }
  }, [serviceTickets]);

  const handleCloseServiceTicket = useCallback(() => {
    setSidebarState('none');
    setSelectedServiceTicket(null);
  }, []);

  const handleBackFromServiceTicket = useCallback(() => {
    // Navigate back to AI assistant if it was open
    if (aiAssistantOpen) {
      setSidebarState('ai-assistant');
      setSelectedServiceTicket(null);
    } else {
      handleCloseServiceTicket();
    }
  }, [aiAssistantOpen, handleCloseServiceTicket]);

  const handleNavigateToTicket = useCallback((ticketId: string) => {
    // Navigate to meeting-services page and open ticket sidebar
    setCurrentView('meeting-services');

    // Use functional update to access the latest serviceTickets state
    setServiceTickets(currentTickets => {
      const ticket = currentTickets.find(t => t.id === ticketId);
      if (ticket) {
        setSelectedServiceTicket(ticket);
        setSidebarState('service-ticket');
      }
      return currentTickets; // Don't modify the tickets, just use this to access latest state
    });
  }, []);

  const handleSidebarStateChange = (type: SidebarType, wasAiAssistant?: boolean) => {
    setSidebarState(type);
    setAiAssistantOpen(type === 'ai-assistant');

    // Clear navigation context when closing sidebar completely or switching away from room-details
    if (type === 'none' || type !== 'room-details') {
      setRoomDetailsNavigationContext(null);
    }

    // Clear preview and overlay when closing AI assistant or switching to non-AI content
    // EXCEPT when switching to create-meeting from AI suggestion (keep preview visible)
    if (type !== 'ai-assistant' && type !== 'create-meeting') {
      setAiMeetingPreview(null);
      setHighlightedRoomId(null);
      // Keep previewChatId so we can restore when reopening
    }

    // Restore preview when opening AI assistant if current chat has active suggestions
    if (type === 'ai-assistant' && currentChatId === previewChatId) {
      // The preview will be restored by RoomBookingSuggestions component when it renders
    }

    // Only clear meeting details when explicitly closing the sidebar completely
    // Don't clear when switching between ai-assistant and meeting-details
  };

  // Function to open meeting details (cooperative with other sidebars)
  const handleOpenMeetingDetails = (meetingDetails: any) => {
    setSelectedMeetingDetails(meetingDetails);
    setSidebarState('meeting-details');
  };

  // Function to close meeting details sidebar
  const handleCloseMeetingDetails = () => {
    setRoomDetailsNavigationContext(null);
    setSidebarState('none');
  };

  // Function to clear meeting details state (separate from closing)
  const handleClearMeetingDetails = () => {
    setSelectedMeetingDetails(null);
    setRoomDetailsNavigationContext(null);
  };

  // Function to delete a meeting from the rooms data
  const handleDeleteMeeting = (meetingId: string) => {
    setRooms(prevRooms =>
      prevRooms.map(room => ({
        ...room,
        meetings: room.meetings.filter(meeting => meeting.id !== meetingId)
      }))
    );
  };

  // Function to edit a meeting and potentially move it to different rooms
  const handleEditMeeting = (updatedMeeting: Meeting, selectedRooms: string[]) => {
    setRooms(prevRooms => {
      // First, remove the meeting from all rooms
      const roomsWithoutMeeting = prevRooms.map(room => ({
        ...room,
        meetings: room.meetings.filter(meeting => meeting.id !== updatedMeeting.id)
      }));

      // Check if any of the new rooms require approval
      const anyRoomRequiresApproval = roomsWithoutMeeting
        .filter(room => selectedRooms.includes(room.id))
        .some(room => room.requestOnly);

      // If moving to a non-request-only room, convert pending approval to regular meeting
      const finalMeeting = {
        ...updatedMeeting,
        pendingApproval: anyRoomRequiresApproval ? updatedMeeting.pendingApproval : undefined
      };

      // Then, add the updated meeting to the selected rooms
      return roomsWithoutMeeting.map(room => {
        if (selectedRooms.includes(room.id)) {
          return {
            ...room,
            meetings: [...room.meetings, finalMeeting]
          };
        }
        return room;
      });
    });

    // Clear meeting details since we've updated the meeting
    setSelectedMeetingDetails(null);
  };

  // Function to handle creating a new meeting
  const handleCreateMeeting = (roomId: string, startTime: number) => {
    setMeetingCreationContext({ roomId, startTime });
    setSidebarState('create-meeting');
  };

  // Function to handle "Add Details" from AI room suggestions
  const handleAddDetailsFromAi = (roomId: string, requirements: any) => {
    setMeetingCreationContext({
      roomId,
      startTime: requirements.startTime,
      title: requirements.title,
      duration: requirements.duration,
      attendees: requirements.attendees,
      fromAiSuggestion: true
    });
    setSidebarState('create-meeting');
    // Keep the preview and highlighted room - don't clear them
  };

  // Function to save a new meeting from the creation form
  const handleSaveNewMeeting = (newMeeting: any, selectedRooms: string[]) => {
    // Generate a unique ID for the new meeting
    const meetingId = Date.now().toString();
    const meetingWithId = {
      ...newMeeting,
      id: meetingId,
      // Mark as AI-created if it originated from an AI suggestion
      ...(meetingCreationContext?.fromAiSuggestion && { aiCreated: true })
    };

    // Add the meeting to the selected rooms
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (selectedRooms.includes(room.id)) {
          return {
            ...room,
            meetings: [...room.meetings, meetingWithId]
          };
        }
        return room;
      })
    );

    // Clear AI preview and highlighted room if this was from AI suggestion
    if (meetingCreationContext?.fromAiSuggestion) {
      setAiMeetingPreview(null);
      setHighlightedRoomId(null);
      setPreviewChatId(null);

      // Show success toast
      const roomName = rooms.find(r => selectedRooms.includes(r.id))?.name || 'room';
      toast.success(`Meeting "${meetingWithId.title}" booked successfully in ${roomName}!`, {
        duration: 3000,
      });
    }

    // Clear the creation context
    setMeetingCreationContext(null);

    // Open meeting details sidebar for the newly created meeting
    // Use the first selected room for the meeting details
    const primaryRoom = rooms.find(r => selectedRooms.includes(r.id));
    if (primaryRoom) {
      setSelectedMeetingDetails({
        meeting: {
          id: meetingWithId.id,
          title: meetingWithId.title,
          organizer: meetingWithId.organizer,
          startTime: meetingWithId.startTime,
          duration: meetingWithId.duration,
          attendees: meetingWithId.attendees
        },
        room: {
          id: primaryRoom.id,
          name: primaryRoom.name,
          capacity: primaryRoom.capacity,
          floor: primaryRoom.floor,
          status: primaryRoom.status,
          features: primaryRoom.features
        }
      });
      // Set sidebar state to meeting-details (replaces create-meeting, no stack push)
      setSidebarState('meeting-details');
    } else {
      // Fallback: close sidebar if room not found
      setSidebarState('none');
    }
  };

  // Function to cancel meeting creation
  const handleCancelMeetingCreation = () => {
    setMeetingCreationContext(null);
    setSidebarState('none');
  };

  // Function to open room details sidebar
  const handleOpenRoomDetails = (room: Room) => {
    // Only track navigation context if we're currently in meeting details
    if (sidebarState === 'meeting-details' && selectedMeetingDetails) {
      setRoomDetailsNavigationContext({
        previousSidebar: 'meeting-details',
        previousMeetingDetails: selectedMeetingDetails
      });
    } else {
      // Clear any existing navigation context
      setRoomDetailsNavigationContext(null);
    }

    setSelectedRoomDetails(room);
    setSidebarState('room-details');
  };

  // Function to close room details sidebar
  const handleCloseRoomDetails = () => {
    setRoomDetailsNavigationContext(null);
    setSidebarState('none');
  };

  // Function to go back from room details to meeting details
  const handleBackFromRoomDetails = () => {
    if (roomDetailsNavigationContext?.previousSidebar === 'meeting-details' && roomDetailsNavigationContext.previousMeetingDetails) {
      // Restore the previous meeting details
      setSelectedMeetingDetails(roomDetailsNavigationContext.previousMeetingDetails);
      setSidebarState('meeting-details');
      setRoomDetailsNavigationContext(null);
    } else {
      // Fallback to just closing
      handleCloseRoomDetails();
    }
  };

  // Function to clear room details state
  const handleClearRoomDetails = () => {
    setSelectedRoomDetails(null);
    setRoomDetailsNavigationContext(null);
  };

  // Function to toggle pin status of a room
  const handleTogglePin = (roomId: string) => {
    setPinnedRoomIds(prev => {
      if (prev.includes(roomId)) {
        // Unpin: remove from array
        return prev.filter(id => id !== roomId);
      } else {
        // Pin: add to array
        return [...prev, roomId];
      }
    });
  };

  // Function to toggle room offline status
  const handleToggleRoomOffline = (roomId: string, isOffline: boolean) => {
    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            status: isOffline ? 'offline' : 'available'
          };
        }
        return room;
      })
    );

    // Update selected room details if this room is currently selected
    if (selectedRoomDetails?.id === roomId) {
      setSelectedRoomDetails(prev => prev ? {
        ...prev,
        status: isOffline ? 'offline' : 'available'
      } : null);
    }

    // Show toast notification
    const room = rooms.find(r => r.id === roomId);
    const roomName = room?.name || 'Room';
    if (isOffline) {
      toast.info(`${roomName} is now offline`, { duration: 3000 });
    } else {
      toast.success(`${roomName} is back online`, { duration: 3000 });
    }
  };

  // Meeting preview state for AI assistant room suggestions
  const [aiMeetingPreview, setAiMeetingPreview] = useState<{
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null>(null);

  // Track which chat the preview belongs to
  const [previewChatId, setPreviewChatId] = useState<string | null>(null);

  // Room highlighting state for AI assistant
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(null);

  // Syncing meetings state - tracks meetings that are currently syncing after being booked via AI
  const [syncingMeetings, setSyncingMeetings] = useState<Set<string>>(new Set());

  // Room highlighting for AI assistant
  const handleHighlightRoom = (roomId: string | null) => {
    setHighlightedRoomId(roomId);
  };

  // Meeting preview update for AI assistant suggestions
  const handleAiMeetingPreviewUpdate = useCallback((preview: {
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null) => {
    setAiMeetingPreview(preview);

    // Track which chat this preview belongs to
    if (preview && currentChatId) {
      setPreviewChatId(currentChatId);
    } else if (!preview) {
      setPreviewChatId(null);
    }
  }, [currentChatId]);

  // Room selection from AI assistant - books meeting and creates confirmation messages
  const handleSelectRoom = (roomId: string, requirements: any) => {
    if (requirements?.startTime && roomId) {
      // Get room name and details
      const room = rooms.find(r => r.id === roomId);
      const roomName = room?.name || 'Unknown Room';
      const floor = room?.floor || 1;

      // Format time for display
      const formatTime = (timeSlot: number) => {
        const hour = Math.floor(timeSlot);
        const minutes = (timeSlot % 1) * 60;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
        return `${displayHour}${displayMinutes} ${period}`;
      };

      const startTimeStr = formatTime(requirements.startTime);
      const duration = requirements.duration || 1;
      const attendees = requirements.attendees || 1;
      const features = requirements.features || [];
      const title = requirements.title || 'New Meeting';

      // Generate unique IDs with timestamps
      const timestamp = Date.now();

      // Create user message requesting the booking
      const userMessage: Message = {
        id: `user-${timestamp}`,
        content: `Book ${roomName} at ${startTimeStr} for ${duration}h with ${attendees} attendee${attendees > 1 ? 's' : ''}${features.length > 0 ? ` (${features.join(', ')})` : ''}`,
        sender: 'user'
      };

      // Create AI confirmation message (with incremented timestamp to ensure uniqueness)
      const aiMessage: Message = {
        id: `ai-${timestamp + 1}`,
        content: `Perfect! I've booked ${roomName} (Floor ${floor}) for "${title}" at ${startTimeStr} for ${duration} hour${duration > 1 ? 's' : ''}. The room is confirmed and ready for your ${attendees} attendee${attendees > 1 ? 's' : ''}.`,
        sender: 'assistant'
      };

      // Update messages: hide room suggestions, add user request and AI confirmation
      setAiAssistantMessages(prevMessages => {
        // Hide room suggestions in existing messages
        const messagesWithoutSuggestions = prevMessages.map(msg =>
          msg.showRoomSuggestions ? { ...msg, showRoomSuggestions: false } : msg
        );

        // Add user message and AI confirmation
        return [...messagesWithoutSuggestions, userMessage, aiMessage];
      });

      // Generate meeting ID and create meeting object
      const meetingId = Date.now().toString();
      const newMeeting = {
        id: meetingId,
        title: title,
        organizer: 'You',
        startTime: requirements.startTime,
        duration: duration,
        attendees: attendees,
        description: `Meeting scheduled via AI assistant in ${roomName}`,
        date: new Date().toISOString().split('T')[0],
        attendeeList: [],
        rooms: [roomId],
        aiCreated: true
      };

      // Clear AI preview immediately 
      setAiMeetingPreview(null);
      setPreviewChatId(null);
      if (handleHighlightRoom) {
        handleHighlightRoom(null);
      }

      // Add the meeting to the selected room
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              meetings: [...room.meetings, newMeeting]
            };
          }
          return room;
        })
      );

      // Start syncing state for this meeting
      setSyncingMeetings(prev => new Set(prev).add(meetingId));

      // Clear syncing state after 4 seconds and show success toast
      setTimeout(() => {
        setSyncingMeetings(prev => {
          const newSet = new Set(prev);
          newSet.delete(meetingId);
          return newSet;
        });

        // Show success toast after loading animation completes
        toast.success(`Meeting "${newMeeting.title}" booked successfully in ${roomName}!`, {
          duration: 3000,
        });
      }, 4000);
    }
  };

  // Handle meeting selection for catering
  const handleMeetingSelectedForCatering = (meeting: Meeting, room: Room) => {
    // Only process if we're actually waiting for catering meeting selection
    const hasEzCaterAgent = aiAssistantMessages.some(msg => msg.agentType === 'ezcater');
    if (!hasEzCaterAgent) return;

    const startTimeStr = formatTimeFloat(meeting.startTime);

    // Remove the meeting list widget but keep the message
    const updatedMessages = aiAssistantMessages.map(msg => {
      if (msg.showMeetingListWidget) {
        return {
          ...msg,
          showMeetingListWidget: false,
        };
      }
      return msg;
    });

    // Create user message with meeting details
    const timestamp = Date.now();
    const userMessage: Message = {
      id: `user-${timestamp}`,
      content: `I'd like to add catering to "${meeting.title}" at ${startTimeStr} in ${room.name} for ${meeting.attendees} attendees.`,
      sender: 'user'
    };

    // Update catering order with meeting details
    setCateringOrderDetails({
      meeting: {
        title: meeting.title,
        location: room.name,
        time: startTimeStr,
        attendees: meeting.attendees,
      },
      items: [],
      totalCost: 0
    });

    // Add user message to conversation (with widget removed)
    setAiAssistantMessages([...updatedMessages, userMessage]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${timestamp + 1}`,
        content: `Perfect! I've noted that you want catering for "${meeting.title}" at ${startTimeStr} in ${room.name} for ${meeting.attendees} attendees. What would you like to order? I can help you browse menus from local restaurants and caterers.`,
        sender: 'assistant',
        agentType: 'ezcater',
        showCuisineOptions: false, // Don't show card yet
        isTyping: true
      };

      setAiAssistantMessages(prevMessages => [...prevMessages, aiResponse]);

      // Show cuisine options AFTER typing animation completes
      // Message: ~220 chars (varies with meeting details)
      // Animation time: 2000ms bouncing + 220 chars * 20ms + 100ms cleanup = 6500ms
      // Add 500ms buffer to ensure typing is completely finished before card appears
      setTimeout(() => {
        setAiAssistantMessages(prevMessages =>
          prevMessages.map(m =>
            m.id === `ai-${timestamp + 1}`
              ? { ...m, showCuisineOptions: true }
              : m
          )
        );
      }, 7000);
    }, 1000);

    // Clear waiting state
    setIsWaitingForMeetingSelection(false);
  };

  // Special handling for meeting-spaces view
  if (currentView === 'meeting-spaces') {
    return (
      <>
        <MeetingSpacesPage
          currentView={currentView}
          onNavigate={handleNavigate}
          notifications={notifications}
          hasUnreadNotifications={hasUnreadNotifications}
          onNotificationClick={handleNotificationClick}
          onNotificationPopoverClose={handleNotificationPopoverClose}
          aiAssistantMessages={aiAssistantMessages}
          onAiAssistantMessagesUpdate={handleAiAssistantMessagesUpdate}
          chatHistory={chatHistory}
          onLoadChatFromHistory={loadChatFromHistory}
          onStartNewChat={startNewChat}
          isWorkplaceExpanded={isWorkplaceExpanded}
          onWorkplaceExpandedChange={setIsWorkplaceExpanded}
          isNavCollapsed={isNavCollapsed}
          onNavCollapsedChange={setIsNavCollapsed}
          sidebarState={sidebarState}
          onSidebarStateChange={handleSidebarStateChange}
          selectedMeetingDetails={selectedMeetingDetails}
          onCloseMeetingDetails={handleCloseMeetingDetails}
          onOpenMeetingDetails={handleOpenMeetingDetails}
          onClearMeetingDetails={handleClearMeetingDetails}
          rooms={getFilteredRoomsLocal(rooms, activeFilters)}
          allRooms={rooms}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onDeleteMeeting={handleDeleteMeeting}
          onEditMeeting={handleEditMeeting}
          onCreateMeeting={handleCreateMeeting}
          meetingCreationContext={meetingCreationContext}
          onSaveNewMeeting={handleSaveNewMeeting}
          onCancelMeetingCreation={handleCancelMeetingCreation}
          spotlightMyEvents={spotlightMyEvents}
          onSpotlightMyEventsChange={setSpotlightMyEvents}
          compactView={compactView}
          onCompactViewChange={setCompactView}
          selectedTimezones={selectedTimezones}
          onSelectedTimezonesChange={setSelectedTimezones}
          onPendingMoveChange={handlePendingMoveChange}
          selectedRoomDetails={selectedRoomDetails}
          onOpenRoomDetails={handleOpenRoomDetails}
          onCloseRoomDetails={handleCloseRoomDetails}
          onClearRoomDetails={handleClearRoomDetails}
          onBackFromRoomDetails={handleBackFromRoomDetails}
          showRoomDetailsBackButton={roomDetailsNavigationContext?.previousSidebar === 'meeting-details'}
          aiMeetingPreview={aiMeetingPreview}
          highlightedRoomId={highlightedRoomId}
          onHighlightRoom={handleHighlightRoom}
          onAiMeetingPreviewUpdate={handleAiMeetingPreviewUpdate}
          onSelectRoom={handleSelectRoom}
          onAddDetails={handleAddDetailsFromAi}
          syncingMeetings={syncingMeetings}
          onMeetingSelectedForCatering={handleMeetingSelectedForCatering}
          cateringOrderDetails={cateringOrderDetails}
          onCateringOrderUpdate={setCateringOrderDetails}
          cateringOrderSubmitted={cateringOrderSubmitted}
          onCateringOrderSubmittedChange={setCateringOrderSubmitted}
          onCreateServiceTicket={handleCreateServiceTicket}
          onNavigateToTicket={handleNavigateToTicket}
          cateringTicketNumber={cateringTicketNumber}
          onCateringTicketNumberChange={setCateringTicketNumber}
          serviceTickets={serviceTickets}
          onOpenServiceTicket={handleOpenServiceTicket}
          selectedServiceTicket={selectedServiceTicket}
          onCloseServiceTicket={handleCloseServiceTicket}
          onBackFromServiceTicket={handleBackFromServiceTicket}
          pinnedRoomIds={pinnedRoomIds}
          onTogglePin={handleTogglePin}
          timeWindowStart={timeWindowStart}
          onTimeWindowPrevious={handleTimeWindowPrevious}
          onTimeWindowNext={handleTimeWindowNext}
          onTimeWindowNow={handleTimeWindowNow}
          meetingSpacesViewMode={meetingSpacesViewMode}
          onMeetingSpacesViewModeChange={setMeetingSpacesViewMode}
          selectedMonthViewRoom={selectedMonthViewRoom}
          onSelectedMonthViewRoomChange={setSelectedMonthViewRoom}
          demoTimeOverride={demoTimeOverride}
          onDemoTimeOverrideChange={setDemoTimeOverride}
          onToggleRoomOffline={handleToggleRoomOffline}
          offlineRoomResolution={offlineRoomResolution}
          onNextOfflineMeeting={handleNextOfflineMeeting}
          onPreviousOfflineMeeting={handlePreviousOfflineMeeting}
          onSelectOfflineAlternativeRoom={handleSelectOfflineAlternativeRoom}
          onMoveOfflineMeeting={handleMoveOfflineMeeting}
          onSkipOfflineMeeting={handleSkipOfflineMeeting}
        />
        <Toaster position="top-center" />

        {/* Navigation Warning Dialog */}
        <AlertDialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Meeting Move</AlertDialogTitle>
              <AlertDialogDescription>
                You have a meeting move in progress that hasn't been confirmed yet. If you navigate away now, your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleNavigationCancel}>
                Stay on page
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleNavigationConfirm}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Leave and lose changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Default shell page for all other views
  return (
    <>
      <PageLayout
        currentView={currentView}
        onNavigate={handleNavigate}
        notifications={notifications}
        hasUnreadNotifications={hasUnreadNotifications}
        onNotificationClick={handleNotificationClick}
        onNotificationPopoverClose={handleNotificationPopoverClose}
        pageTitle={getPageTitle(currentView)}
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
        aiAssistantMessages={aiAssistantMessages}
        onAiAssistantMessagesUpdate={handleAiAssistantMessagesUpdate}
        chatHistory={chatHistory}
        onLoadChatFromHistory={loadChatFromHistory}
        onStartNewChat={startNewChat}
        isWorkplaceExpanded={isWorkplaceExpanded}
        onWorkplaceExpandedChange={setIsWorkplaceExpanded}
        isNavCollapsed={isNavCollapsed}
        onNavCollapsedChange={setIsNavCollapsed}
        sidebarType={sidebarState}
        onSidebarStateChange={handleSidebarStateChange}
        selectedMeetingDetails={selectedMeetingDetails}
        onCloseMeetingDetails={handleCloseMeetingDetails}
        onOpenMeetingDetails={handleOpenMeetingDetails}
        onClearMeetingDetails={handleClearMeetingDetails}
        onDeleteMeeting={handleDeleteMeeting}
        onEditMeeting={handleEditMeeting}
        allRooms={rooms}
        meetingCreationContext={meetingCreationContext}
        onSaveNewMeeting={handleSaveNewMeeting}
        onCancelMeetingCreation={handleCancelMeetingCreation}
        spotlightMyEvents={spotlightMyEvents}
        onSpotlightMyEventsChange={setSpotlightMyEvents}
        compactView={compactView}
        onCompactViewChange={setCompactView}
        selectedTimezones={selectedTimezones}
        onSelectedTimezonesChange={setSelectedTimezones}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        selectedRoomDetails={selectedRoomDetails}
        onOpenRoomDetails={handleOpenRoomDetails}
        onCloseRoomDetails={handleCloseRoomDetails}
        onClearRoomDetails={handleClearRoomDetails}
        onBackFromRoomDetails={handleBackFromRoomDetails}
        showRoomDetailsBackButton={roomDetailsNavigationContext?.previousSidebar === 'meeting-details'}
        aiMeetingPreview={aiMeetingPreview}
        highlightedRoomId={highlightedRoomId}
        onHighlightRoom={handleHighlightRoom}
        onAiMeetingPreviewUpdate={handleAiMeetingPreviewUpdate}
        onSelectRoom={handleSelectRoom}
        onAddDetails={handleAddDetailsFromAi}
        onMeetingSelectedForCatering={handleMeetingSelectedForCatering}
        cateringOrderDetails={cateringOrderDetails}
        onCateringOrderUpdate={setCateringOrderDetails}
        cateringOrderSubmitted={cateringOrderSubmitted}
        onCateringOrderSubmittedChange={setCateringOrderSubmitted}
        onCreateServiceTicket={handleCreateServiceTicket}
        onNavigateToTicket={handleNavigateToTicket}
        cateringTicketNumber={cateringTicketNumber}
        onCateringTicketNumberChange={setCateringTicketNumber}
        serviceTickets={serviceTickets}
        onOpenServiceTicket={handleOpenServiceTicket}
        selectedServiceTicket={selectedServiceTicket}
        onCloseServiceTicket={handleCloseServiceTicket}
        onBackFromServiceTicket={handleBackFromServiceTicket}
        hideLocationPicker={shouldHideLocationPicker(currentView)}
        hideDatePicker={shouldHideDatePicker(currentView)}
        pageTabs={
          currentView === 'my-schedule' ? [
            { value: 'workweek', label: 'Workweek' },
            { value: 'my-meetings', label: 'My meetings' }
          ] : currentView === 'people' ? [
            { value: 'organization', label: 'Organization' },
            { value: 'favorites', label: 'Favorites' }
          ] : undefined
        }
        activePageTab={
          currentView === 'my-schedule' ? myScheduleTab :
            currentView === 'people' ? peopleTab :
              undefined
        }
        onPageTabChange={
          currentView === 'my-schedule' ? setMyScheduleTab :
            currentView === 'people' ? setPeopleTab :
              undefined
        }
      >
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-gray-600 mb-2" style={{ fontSize: '30px', fontWeight: 400 }}>{getPageTitle(currentView)}</h2>
            <p className="text-gray-500">This page is under development.</p>
          </div>
        </div>
      </PageLayout>
      <Toaster position="top-center" />

      {/* Navigation Warning Dialog */}
      <AlertDialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Meeting Move</AlertDialogTitle>
            <AlertDialogDescription>
              You have a meeting move in progress that hasn't been confirmed yet. If you navigate away now, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleNavigationCancel}>
              Stay on page
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleNavigationConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Leave and lose changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}