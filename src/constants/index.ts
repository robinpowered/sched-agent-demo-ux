// ===========================
// SHARED CONSTANTS
// ===========================
// This file contains all shared constants used across the application
// to prevent duplication and maintain consistency.

import { View } from '../types';

// Page Titles
export const PAGE_TITLES: Record<View, string> = {
  'dashboard': 'Dashboard',
  'tickets': 'Tickets',
  'map': 'Map',
  'meeting-spaces': 'Meeting Spaces',
  'my-schedule': 'My Schedule',
  'space-planning': 'Space Planning',
  'people': 'People',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'daily-roster': 'Daily Roster',
  'meeting-services': 'Meeting Services',
  'space-requests': 'Space Requests',
  'issue-reports': 'Issue Reports',
  'announcements': 'Announcements',
  'visitors': 'Visitors',
  'deliveries': 'Deliveries',
  'surveys': 'Surveys',
  'devices': 'Devices',
  'calendars': 'Calendars',
  'user-profile': 'User Profile',
  'support': 'Support',
  'feedback': 'Feedback',
  'notifications': 'Notifications',
  'settings-organization': 'Organization',
  'settings-offices': 'Offices',
  'settings-themes': 'Themes',
  'settings-integrations': 'Integrations',
  'settings-people': 'People',
  'settings-groups': 'Groups',
  'settings-roles': 'Roles',
  'settings-calendars': 'Calendars',
  'settings-event-audit-logs': 'Event Audit Logs',
  'settings-hybrid-work-policies': 'Hybrid Work Policies',
  'settings-access': 'Access',
  'settings-daily-roster': 'Daily Roster',
  'settings-announcements': 'Announcements',
  'settings-surveys': 'Surveys',
  'settings-devices': 'Devices',
  'settings-amenities': 'Amenities',
  'settings-stickers': 'Stickers',
  'settings-workplace-services': 'Workplace Services',
  'settings-notifications': 'Notifications',
  'settings-billing': 'Billing',
  'settings-priority-support': 'Priority Support'
};

// Time Windows (11-hour blocks for calendar view)
export const TIME_WINDOWS = {
  MORNING: 0,      // 12am-11am
  BUSINESS: 8,     // 8am-7pm (DEFAULT)
  EVENING: 13      // 1pm-12am
} as const;

export const DEFAULT_TIME_WINDOW = TIME_WINDOWS.BUSINESS;

// Room Amenities/Features
export const ROOM_AMENITIES = [
  'Projector',
  'Whiteboard',
  'Video Conferencing',
  'Phone',
  'TV Display',
  'Natural Light',
  'Standing Desk',
  'Writable Walls'
] as const;

// Room Types
export const ROOM_TYPES = [
  'Conference Room',
  'Huddle Room',
  'Board Room',
  'Training Room',
  'Executive Suite',
  'Focus Room',
  'Creative Space',
  'Collaboration Hub',
  'Innovation Lab',
  'Meeting Pod'
] as const;

// Filter Options
export const DURATION_OPTIONS = [
  { value: 'any', label: 'Any duration' },
  { value: '0.5', label: '30 minutes' },
  { value: '1', label: '1 hour' },
  { value: '2', label: '2 hours' },
  { value: '4', label: '4+ hours' }
] as const;

export const CAPACITY_OPTIONS = [
  { value: 'any', label: 'Any capacity' },
  { value: '1-4', label: '1-4 people' },
  { value: '5-8', label: '5-8 people' },
  { value: '9-12', label: '9-12 people' },
  { value: '13+', label: '13+ people' }
] as const;

// Default Timezone
export const DEFAULT_TIMEZONE = 'America/New_York';

// Time Formatting
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const CALENDAR_WINDOW_HOURS = 11; // 11-hour time windows

// Auto Check-in Settings
export const AUTO_CHECKIN_INTERVAL_MS = 60000; // 1 minute

// Toast Durations
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000
} as const;

// Meeting Sync Duration
export const MEETING_SYNC_DURATION_MS = 4000; // 4 seconds

// Sidebar Widths (in Tailwind units)
export const SIDEBAR_WIDTH = {
  STANDARD: 'w-96',       // 384px - for AI, meeting details, filters
  MAP_FLOOR: 'w-80'       // 320px - for map floor sidebar
} as const;

// Navigation Groups
export const NAV_GROUPS = {
  MAIN: [
    { view: 'dashboard', label: 'Dashboard', icon: 'faCity' },
    { view: 'analytics', label: 'Analytics', icon: 'faChartLine' },
    { view: 'map', label: 'Map', icon: 'faMapMarkerAlt' },
    { view: 'meeting-spaces', label: 'Meeting Spaces', icon: 'faTableCells' },
    { view: 'my-schedule', label: 'My Schedule', icon: 'faCalendar' },
    { view: 'people', label: 'People', icon: 'faUsers' }
  ],
  WORKPLACE: [
    { view: 'daily-roster', label: 'Daily roster' },
    { view: 'meeting-services', label: 'Meeting services' },
    { view: 'space-requests', label: 'Space requests' },
    { view: 'issue-reports', label: 'Issue reports' },
    { view: 'announcements', label: 'Announcements' },
    { view: 'visitors', label: 'Visitors' },
    { view: 'deliveries', label: 'Deliveries' },
    { view: 'surveys', label: 'Surveys' },
    { view: 'devices', label: 'Devices' },
    { view: 'calendars', label: 'Calendars' }
  ]
} as const;

// Views that hide location/date pickers
export const VIEWS_WITHOUT_LOCATION_PICKER: View[] = [
  'settings',
  'user-profile',
  'notifications',
  'support',
  'feedback',
  'analytics',
  'space-planning',
  'people'
];

export const VIEWS_WITHOUT_DATE_PICKER: View[] = [
  'settings',
  'user-profile',
  'notifications',
  'support',
  'feedback',
  'analytics',
  'space-planning',
  'people'
];

// Add settings views to the lists
VIEWS_WITHOUT_LOCATION_PICKER.push(
  'settings-organization',
  'settings-offices',
  'settings-themes',
  'settings-integrations',
  'settings-people',
  'settings-groups',
  'settings-roles',
  'settings-calendars',
  'settings-event-audit-logs',
  'settings-hybrid-work-policies',
  'settings-access',
  'settings-daily-roster',
  'settings-announcements',
  'settings-surveys',
  'settings-devices',
  'settings-amenities',
  'settings-stickers',
  'settings-workplace-services',
  'settings-notifications',
  'settings-billing',
  'settings-priority-support'
);

VIEWS_WITHOUT_DATE_PICKER.push(
  'settings-organization',
  'settings-offices',
  'settings-themes',
  'settings-integrations',
  'settings-people',
  'settings-groups',
  'settings-roles',
  'settings-calendars',
  'settings-event-audit-logs',
  'settings-hybrid-work-policies',
  'settings-access',
  'settings-daily-roster',
  'settings-announcements',
  'settings-surveys',
  'settings-devices',
  'settings-amenities',
  'settings-stickers',
  'settings-workplace-services',
  'settings-notifications',
  'settings-billing',
  'settings-priority-support'
);
