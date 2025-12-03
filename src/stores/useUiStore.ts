import { create } from 'zustand';
import { SidebarType, View } from '../types';

interface UiState {
    currentView: View;
    sidebarType: SidebarType;
    previousSidebarType: string | undefined;
    sidebarStack: Exclude<SidebarType, 'none'>[];
    isWorkplaceExpanded: boolean;
    isNavCollapsed: boolean;
    isSettingsExpanded: boolean;
    selectedFloor: string;
    myScheduleTab: string;
    peopleTab: string;
    homepage: View;

    // Actions
    setCurrentView: (view: View) => void;
    setSidebarType: (type: SidebarType) => void;
    setPreviousSidebarType: (type: string | undefined) => void;
    setSidebarStack: (stack: Exclude<SidebarType, 'none'>[]) => void;
    toggleWorkplaceExpanded: () => void;
    setIsWorkplaceExpanded: (expanded: boolean) => void;
    toggleNavCollapsed: () => void;
    setIsNavCollapsed: (collapsed: boolean) => void;
    toggleSettingsExpanded: () => void;
    setSelectedFloor: (floor: string) => void;
    setMyScheduleTab: (tab: string) => void;
    setPeopleTab: (tab: string) => void;
    setHomepage: (view: View) => void;

    // Sidebar Helpers
    openSidebar: (type: SidebarType) => void;
    closeSidebar: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
    currentView: 'dashboard',
    sidebarType: 'none',
    previousSidebarType: undefined,
    sidebarStack: [],
    isWorkplaceExpanded: true,
    isNavCollapsed: false,
    isSettingsExpanded: false,
    selectedFloor: '1',
    myScheduleTab: 'workweek',
    peopleTab: 'organization',
    homepage: 'dashboard',

    setCurrentView: (view) => set({ currentView: view }),
    setSidebarType: (type) => set({ sidebarType: type }),
    setPreviousSidebarType: (type) => set({ previousSidebarType: type }),
    setSidebarStack: (stack) => set({ sidebarStack: stack }),

    toggleWorkplaceExpanded: () => set((state) => ({ isWorkplaceExpanded: !state.isWorkplaceExpanded })),
    setIsWorkplaceExpanded: (expanded) => set({ isWorkplaceExpanded: expanded }),
    toggleNavCollapsed: () => set((state) => ({ isNavCollapsed: !state.isNavCollapsed })),
    setIsNavCollapsed: (collapsed) => set({ isNavCollapsed: collapsed }),
    toggleSettingsExpanded: () => set((state) => ({ isSettingsExpanded: !state.isSettingsExpanded })),

    setSelectedFloor: (floor) => set({ selectedFloor: floor }),
    setMyScheduleTab: (tab) => set({ myScheduleTab: tab }),
    setPeopleTab: (tab) => set({ peopleTab: tab }),
    setHomepage: (view) => set({ homepage: view }),

    openSidebar: (type) => {
        const { sidebarType, sidebarStack } = get();

        if (sidebarType === type) {
            // Toggle close if already open
            set({ sidebarType: 'none', sidebarStack: [] });
            return;
        }

        // Add to stack logic could go here, simplified for now
        set({ sidebarType: type });
    },

    closeSidebar: () => set({ sidebarType: 'none', sidebarStack: [] }),
}));
