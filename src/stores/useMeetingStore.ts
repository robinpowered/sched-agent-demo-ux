import { create } from 'zustand';
import { Meeting, Room, MeetingRoomFilters } from '../types';
import { getFilteredRooms, shouldAutoCheckIn } from '../utils';
import { MOCK_ROOMS } from '../constants/mockData';

interface MeetingState {
    rooms: Room[];
    allRooms: Room[]; // Keep copy of all rooms for filtering
    filters: MeetingRoomFilters;
    timeWindowStart: number;
    meetingSpacesViewMode: 'day' | 'week' | 'month';
    selectedMonthViewRoom: string | null;
    pinnedRoomIds: string[];
    selectedTimezones: string[];
    compactView: boolean;
    spotlightMyEvents: boolean;
    demoTimeOverride: number | null;

    // Offline room resolution state
    offlineRoomResolution: {
        affectedMeetings: Array<{
            meeting: Meeting;
            roomId: string;
            roomName: string;
        }>;
        currentIndex: number;
        selectedAlternativeRoomId: string | null;
    } | null;

    // Actions
    setRooms: (rooms: Room[]) => void;
    updateFilters: (filters: Partial<MeetingRoomFilters>) => void;
    setTimeWindowStart: (start: number) => void;
    setMeetingSpacesViewMode: (mode: 'day' | 'week' | 'month') => void;
    setSelectedMonthViewRoom: (roomId: string | null) => void;
    togglePinnedRoom: (roomId: string) => void;
    setPinnedRoomIds: (ids: string[]) => void;
    setSelectedTimezones: (timezones: string[]) => void;
    setCompactView: (compact: boolean) => void;
    setSpotlightMyEvents: (spotlight: boolean) => void;
    setDemoTimeOverride: (time: number | null) => void;

    // Offline resolution actions
    setOfflineRoomResolution: (resolution: MeetingState['offlineRoomResolution']) => void;
    checkOfflineMeetings: () => void;
    autoCheckIn: () => void;

    // Computed
    applyFilters: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
    rooms: MOCK_ROOMS,
    allRooms: MOCK_ROOMS,
    filters: {
        duration: 'any',
        amenities: [],
        capacity: 'any',
        types: [],
        show: 'all',
        onlyShowAvailable: false
    },
    timeWindowStart: 8,
    meetingSpacesViewMode: 'day',
    selectedMonthViewRoom: null,
    pinnedRoomIds: [],
    selectedTimezones: ['America/New_York'],
    compactView: true,
    spotlightMyEvents: false,
    demoTimeOverride: null,
    offlineRoomResolution: null,

    setRooms: (rooms) => {
        set({ rooms, allRooms: rooms });
        get().applyFilters();
        get().checkOfflineMeetings();
    },

    updateFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
        get().applyFilters();
    },

    setTimeWindowStart: (start) => set({ timeWindowStart: start }),
    setMeetingSpacesViewMode: (mode) => set({ meetingSpacesViewMode: mode }),
    setSelectedMonthViewRoom: (roomId) => set({ selectedMonthViewRoom: roomId }),

    togglePinnedRoom: (roomId) => set((state) => {
        const isPinned = state.pinnedRoomIds.includes(roomId);
        return {
            pinnedRoomIds: isPinned
                ? state.pinnedRoomIds.filter(id => id !== roomId)
                : [...state.pinnedRoomIds, roomId]
        };
    }),

    setPinnedRoomIds: (ids) => set({ pinnedRoomIds: ids }),

    setSelectedTimezones: (timezones) => set({ selectedTimezones: timezones }),
    setCompactView: (compact) => set({ compactView: compact }),
    setSpotlightMyEvents: (spotlight) => set({ spotlightMyEvents: spotlight }),

    setDemoTimeOverride: (time) => {
        set({ demoTimeOverride: time });
        get().applyFilters();
        get().checkOfflineMeetings();
        get().autoCheckIn();
    },

    setOfflineRoomResolution: (resolution) => set({ offlineRoomResolution: resolution }),

    checkOfflineMeetings: () => {
        const { allRooms, demoTimeOverride, offlineRoomResolution } = get();
        const now = new Date();
        const currentHour = demoTimeOverride !== null ? demoTimeOverride : (now.getHours() + now.getMinutes() / 60);

        // Find all offline rooms
        const offlineRooms = allRooms.filter(room => room.status === 'offline');

        if (offlineRooms.length === 0) {
            if (offlineRoomResolution) {
                set({ offlineRoomResolution: null });
            }
            return;
        }

        // Find all meetings in offline rooms that haven't ended yet
        const affectedMeetings: Array<{
            meeting: Meeting;
            roomId: string;
            roomName: string;
        }> = [];

        offlineRooms.forEach(room => {
            room.meetings.forEach(meeting => {
                const meetingEndTime = meeting.startTime + meeting.duration;
                if (currentHour < meetingEndTime) {
                    affectedMeetings.push({
                        meeting,
                        roomId: room.id,
                        roomName: room.name
                    });
                }
            });
        });

        affectedMeetings.sort((a, b) => a.meeting.startTime - b.meeting.startTime);

        if (affectedMeetings.length > 0 && !offlineRoomResolution) {
            set({
                offlineRoomResolution: {
                    affectedMeetings,
                    currentIndex: 0,
                    selectedAlternativeRoomId: null
                }
            });
        } else if (affectedMeetings.length === 0 && offlineRoomResolution) {
            set({ offlineRoomResolution: null });
        }
    },

    autoCheckIn: () => {
        const { allRooms, demoTimeOverride } = get();
        const now = new Date();
        const currentHour = demoTimeOverride !== null ? demoTimeOverride : (now.getHours() + now.getMinutes() / 60);

        let updated = false;
        const newRooms = allRooms.map(room => {
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

        if (updated) {
            set({ rooms: newRooms, allRooms: newRooms });
            get().applyFilters();
        }
    },

    applyFilters: () => {
        const { allRooms, filters, demoTimeOverride } = get();
        const filtered = getFilteredRooms(allRooms, filters, demoTimeOverride);
        set({ rooms: filtered });
    }
}));
