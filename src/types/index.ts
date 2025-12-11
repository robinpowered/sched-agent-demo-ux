// ===========================
// SHARED TYPE DEFINITIONS
// ===========================
// This file contains all shared type definitions used across the application
// to prevent duplication and ensure consistency.

// Navigation Types
export type View =
  | "dashboard"
  | "tickets"
  | "map"
  | "meeting-spaces"
  | "my-schedule"
  | "space-planning"
  | "people"
  | "analytics"
  | "settings"
  | "daily-roster"
  | "meeting-services"
  | "space-requests"
  | "issue-reports"
  | "announcements"
  | "visitors"
  | "deliveries"
  | "surveys"
  | "devices"
  | "calendars"
  | "user-profile"
  | "support"
  | "feedback"
  | "notifications"
  | "settings-organization"
  | "settings-offices"
  | "settings-themes"
  | "settings-integrations"
  | "settings-people"
  | "settings-groups"
  | "settings-roles"
  | "settings-calendars"
  | "settings-event-audit-logs"
  | "settings-hybrid-work-policies"
  | "settings-access"
  | "settings-daily-roster"
  | "settings-announcements"
  | "settings-surveys"
  | "settings-devices"
  | "settings-amenities"
  | "settings-stickers"
  | "settings-workplace-services"
  | "settings-notifications"
  | "settings-billing"
  | "settings-priority-support";

export type SidebarType =
  | "none"
  | "ai-assistant"
  | "meeting-details"
  | "create-meeting"
  | "filters"
  | "room-details"
  | "service-ticket";

// Meeting & Room Types
export interface Meeting {
  id: string;
  title: string;
  organizer: string;
  startTime: number; // Hour as number (9.5 = 9:30am)
  duration: number; // Hours (1.5 = 90 minutes)
  attendees: number;
  checkedIn?: boolean; // Auto-checked in when current time >= startTime
  checkInTime?: number; // Time in hours when checked in
  aiCreated?: boolean; // Whether created from AI suggestion
  pendingApproval?: boolean; // For request-only rooms
  rooms?: string[]; // Room IDs this meeting is booked in
  description?: string; // Optional meeting description
  attendeeList?: string[]; // Optional list of attendee names/emails
  date?: string; // Optional date string
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  status: "available" | "occupied" | "offline";
  features: string[];
  meetings: Meeting[];
  requestOnly?: boolean; // Executive rooms requiring approval
  restricted?: boolean; // Rooms that user doesn't have permission to book
}

// Service Ticket Types
export interface ServiceTicket {
  id: string;
  status: "pending" | "approved" | "in-progress" | "completed" | "cancelled";
  eventStartTime: string; // ISO 8601 format
  serviceName: string;
  space: string;
  eventTitle: string;
  approver: string;
  requester: string;
  assignee: string;
  category: "catering" | "av-support" | "setup" | "cleaning" | "other";
  created: string; // ISO 8601 format
  lastUpdated: string; // ISO 8601 format
  // Additional details
  description?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  totalCost?: number;
  notes?: string;
  meetingDetails?: {
    title: string;
    location: string;
    time: string;
    attendees: number;
  };
  restaurant?: string;
  restaurantAddress?: string;
  restaurantDistance?: string;
}

// AI Assistant Types
export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  agentType?: "robin" | "ezcater"; // Which agent is responding
  showRoomSuggestions?: boolean;
  showCuisineOptions?: boolean; // Show cuisine selection card (coffee/pastries, pizza, etc.)
  showCateringOptions?: boolean; // Show restaurant selection card
  cateringItems?: string[]; // Items requested (e.g., ["coffee", "pastries"])
  showCateringMenu?: boolean; // Show menu items card
  restaurantName?: string; // Selected restaurant name
  menuItems?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
  }>;
  showMeetingListWidget?: boolean; // Show meeting list for catering selection
  isThinking?: boolean;
  thinkingText?: string;
  thinkingComplete?: boolean;
  thinkingVisibleLines?: number;
  thinkingRoomData?: {
    goodFitRooms: Array<{
      id: string;
      name: string;
      capacity: number;
      attendees: number;
    }>;
    poorFitRooms: Array<{
      id: string;
      name: string;
      capacity: number;
      attendees: number;
      reason: string;
    }>;
  };
  meetingRequirements?: MeetingRequirements;
  isTyping?: boolean; // Shows bouncing dots animation before text appears
  typedContent?: string; // Partial content during typewriter effect
  isPaused?: boolean; // Whether the message is paused
}

export interface MeetingRequirements {
  title: string;
  attendees: number;
  duration: number;
  startTime: number;
  features: string[];
  type?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Meeting Creation Types
export interface MeetingCreationContext {
  roomId: string;
  startTime: number;
  title?: string;
  duration?: number;
  attendees?: number;
  fromAiSuggestion?: boolean;
}

// Filter Types
export interface MeetingRoomFilters {
  duration: string;
  amenities: string[];
  capacity: string;
  types: string[];
  show: string;
  onlyShowAvailable: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  action: string | null;
}

// Room Suggestions Types
export interface RoomSuggestion {
  roomId: string;
  roomName: string;
  roomCapacity: number;
  roomFloor: number;
  score: number;
  roomFeatures: string[]; // Added missing property
  floor: number; // Added missing property (duplicate of roomFloor but used in component)
}

// Attendee Type
export interface Attendee {
  id?: string; // Optional ID for attendee
  name: string;
  email: string;
  avatar?: string;
}
