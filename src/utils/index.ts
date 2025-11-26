// ===========================
// SHARED UTILITY FUNCTIONS
// ===========================
// This file contains all shared utility functions used across the application
// to prevent duplication and ensure consistency.

import { Room, Meeting, MeetingRoomFilters, View } from '../types';
import { PAGE_TITLES, TIME_WINDOWS, VIEWS_WITHOUT_LOCATION_PICKER, VIEWS_WITHOUT_DATE_PICKER } from '../constants';

// ===========================
// PAGE UTILITIES
// ===========================

/**
 * Get the display title for a view
 */
export function getPageTitle(view: View): string {
  return PAGE_TITLES[view];
}

/**
 * Check if a view should hide the location picker
 */
export function shouldHideLocationPicker(view: View): boolean {
  return VIEWS_WITHOUT_LOCATION_PICKER.includes(view) || view.startsWith('settings-');
}

/**
 * Check if a view should hide the date picker
 */
export function shouldHideDatePicker(view: View): boolean {
  return VIEWS_WITHOUT_DATE_PICKER.includes(view) || view.startsWith('settings-');
}

// ===========================
// ROOM UTILITIES
// ===========================

/**
 * Determine room type from room name and capacity
 */
export function getRoomType(room: Room): string {
  const name = room.name.toLowerCase();
  
  if (name.includes('board')) return 'Board Room';
  if (name.includes('training')) return 'Training Room';
  if (name.includes('executive')) return 'Executive Suite';
  if (name.includes('huddle')) return 'Huddle Room';
  if (name.includes('focus')) return 'Focus Room';
  if (name.includes('creative')) return 'Creative Space';
  if (name.includes('collaboration')) return 'Collaboration Hub';
  if (name.includes('innovation')) return 'Innovation Lab';
  if (name.includes('small meeting')) return 'Meeting Pod';
  if (name.includes('conference')) return 'Conference Room';
  
  // Default based on capacity
  if (room.capacity <= 4) return 'Huddle Room';
  if (room.capacity <= 8) return 'Conference Room';
  return 'Conference Room';
}

/**
 * Filter rooms based on criteria
 */
export function getFilteredRooms(
  rooms: Room[], 
  filters: MeetingRoomFilters, 
  demoTimeOverride?: number | null
): Room[] {
  return rooms.filter(room => {
    // Only show available spaces filter - check if room is currently occupied
    if (filters.onlyShowAvailable) {
      let currentHourFloat: number;
      if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
        currentHourFloat = demoTimeOverride;
      } else {
        const now = new Date();
        currentHourFloat = now.getHours() + now.getMinutes() / 60;
      }
      
      const isOccupied = room.meetings.some(meeting => {
        const meetingStart = meeting.startTime;
        const meetingEnd = meeting.startTime + meeting.duration;
        return currentHourFloat >= meetingStart && currentHourFloat < meetingEnd;
      });
      
      if (isOccupied) {
        return false;
      }
    }

    // Capacity filter
    if (filters.capacity !== 'any') {
      const [min, max] = filters.capacity.includes('+') 
        ? [parseInt(filters.capacity.replace('+', '')), Infinity]
        : filters.capacity.includes('-')
        ? filters.capacity.split('-').map(num => parseInt(num))
        : [parseInt(filters.capacity), parseInt(filters.capacity)];
      
      if (room.capacity < min || room.capacity > max) {
        return false;
      }
    }

    // Amenities filter - room must have ALL selected amenities
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        room.features.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    // Types filter - determine room type based on name and features
    if (filters.types.length > 0) {
      const roomType = getRoomType(room);
      if (!filters.types.includes(roomType)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Check if a room is currently occupied
 */
export function isRoomOccupied(room: Room, currentTime?: number): boolean {
  const currentHourFloat = currentTime ?? new Date().getHours() + new Date().getMinutes() / 60;
  
  return room.meetings.some(meeting => {
    const meetingStart = meeting.startTime;
    const meetingEnd = meeting.startTime + meeting.duration;
    return currentHourFloat >= meetingStart && currentHourFloat < meetingEnd;
  });
}

// ===========================
// TIME UTILITIES
// ===========================

/**
 * Get the current time as a float (hours + minutes/60)
 */
export function getCurrentTimeFloat(demoTimeOverride?: number | null): number {
  if (demoTimeOverride !== null && demoTimeOverride !== undefined) {
    return demoTimeOverride;
  }
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60;
}

/**
 * Cycle to the previous time window
 */
export function getPreviousTimeWindow(currentWindow: number): number {
  // Cycle backwards: 13 → 8 → 0 → 13
  if (currentWindow === TIME_WINDOWS.EVENING) {
    return TIME_WINDOWS.BUSINESS; // 1pm-midnight → 8am-7pm (NOW)
  } else if (currentWindow === TIME_WINDOWS.BUSINESS) {
    return TIME_WINDOWS.MORNING; // 8am-7pm → midnight-11am
  } else {
    return TIME_WINDOWS.EVENING; // midnight-11am → 1pm-midnight
  }
}

/**
 * Cycle to the next time window
 */
export function getNextTimeWindow(currentWindow: number): number {
  // Cycle forwards: 0 → 8 → 13 → 0
  if (currentWindow === TIME_WINDOWS.MORNING) {
    return TIME_WINDOWS.BUSINESS; // midnight-11am → 8am-7pm (NOW)
  } else if (currentWindow === TIME_WINDOWS.BUSINESS) {
    return TIME_WINDOWS.EVENING; // 8am-7pm → 1pm-midnight
  } else {
    return TIME_WINDOWS.MORNING; // 1pm-midnight → midnight-11am
  }
}

/**
 * Format time float to 12-hour display (e.g., 9.5 -> "9:30 AM")
 */
export function formatTimeFloat(timeFloat: number): string {
  const hours = Math.floor(timeFloat);
  const minutes = Math.round((timeFloat - hours) * 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format duration in hours to readable string (e.g., 1.5 -> "1h 30m")
 */
export function formatDuration(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  if (wholeHours === 0) {
    return `${minutes}m`;
  }
  return `${wholeHours}h ${minutes}m`;
}

// ===========================
// MEETING UTILITIES
// ===========================

/**
 * Check if a meeting should be auto-checked in
 */
export function shouldAutoCheckIn(meeting: Meeting, currentTime?: number): boolean {
  if (meeting.checkedIn) return false;
  
  const currentHourFloat = getCurrentTimeFloat(currentTime);
  return currentHourFloat >= meeting.startTime;
}

/**
 * Sort rooms with pinned rooms first
 */
export function sortRoomsWithPinned(rooms: Room[], pinnedIds: string[]): Room[] {
  const pinned = rooms.filter(room => pinnedIds.includes(room.id));
  const unpinned = rooms.filter(room => !pinnedIds.includes(room.id));
  return [...pinned, ...unpinned];
}

// ===========================
// CHAT UTILITIES
// ===========================

/**
 * Generate a chat title from the first user message
 */
export function generateChatTitle(firstMessage: string): string {
  // Take first 50 characters and add ellipsis if truncated
  const truncated = firstMessage.slice(0, 50);
  return firstMessage.length > 50 ? `${truncated}...` : truncated;
}

/**
 * Format relative time for notifications
 */
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMs = now.getTime() - notificationTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

// ===========================
// DATE UTILITIES
// ===========================

/**
 * Get date display without year (e.g., "Mon, Jan 20")
 */
export function getDateDisplayWithoutYear(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Generate date options for the next 14 days
 */
export function generateDateOptions(): Array<{ value: string; label: string }> {
  const options = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const value = date.toISOString().split('T')[0];
    let label: string;
    
    if (i === 0) {
      label = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
    } else {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      label = `${dayName}, ${monthDay}`;
    }
    
    options.push({ value, label });
  }
  
  return options;
}
