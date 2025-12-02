import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationsPopover } from "./NotificationsPopover";
import { AiAssistantSidebar } from "./AiAssistantSidebar";
import { MeetingDetailsSidebar } from "./MeetingDetailsSidebar";
import { MeetingCreationSidebar } from "./MeetingCreationSidebar";
import { FiltersSidebar } from "./FiltersSidebar";
import { RoomDetailsSidebar } from "./RoomDetailsSidebar";
import { MapFloorSidebar } from "./MapFloorSidebar";
import { ServiceTicketSidebar } from "./ServiceTicketSidebar";
import { MeetingServicesPage } from "./MeetingServicesPage";
import { GlobalTabs } from "./common/GlobalTabs";
import { ResourceCenter } from "./ResourceCenter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { CustomTooltipContent } from "./common/CustomTooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faCog,
  faUser,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faChartLine,
  faTableCells,
  faTicket,
  faMagicWandSparkles,
  faBell,
  faCheckCircle,
  faClock,
  faDoorOpen,
  faCity,
  faFilter,
  faList,
  faQuestionCircle,
  faComment,
  faLayerGroup,
  faPaperPlane,
  faListCheck,
  faCircleInfo,
  faExclamationCircle,
  faSliders,
  faChair,
  faTriangleExclamation,
  faLocationDot,
  faCalendarPlus,
  faEye,
  faCompass,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";

// Import shared types
import {
  Message,
  ChatSession,
  Meeting,
  Room,
  SidebarType,
  View,
} from "../types";

// Import shared utilities
import { formatRelativeTime, generateDateOptions } from "../utils";
import { useUiStore } from "../stores/useUiStore";

interface PageLayoutProps {
  children: React.ReactNode;
  // currentView and onNavigate removed in favor of useUiStore
  notifications?: any[];
  hasUnreadNotifications?: boolean;
  onNotificationClick?: (notification: any) => void;
  onNotificationPopoverClose?: () => void;
  pageTitle: string;
  showFloorPicker?: boolean;
  selectedFloor?: string;
  onFloorChange?: (floor: string) => void;
  fullViewport?: boolean;
  aiAssistantMessages?: Message[];
  onAiAssistantMessagesUpdate?: (messages: Message[]) => void;
  chatHistory?: ChatSession[];
  currentChatId?: string | null;
  onLoadChatFromHistory?: (chatSession: ChatSession) => void;
  onStartNewChat?: () => void;
  sidebarContent?: React.ReactNode;
  // sidebarType and onSidebarStateChange removed in favor of useUiStore
  selectedMeetingDetails?: {
    meeting: Meeting;
    room: Room;
  } | null;
  onCloseMeetingDetails?: () => void;
  onOpenMeetingDetails?: (meetingDetails: any) => void;
  onClearMeetingDetails?: () => void;
  onDeleteMeeting?: (meetingId: string) => void;
  onEditMeeting?: (updatedMeeting: any, selectedRooms: string[]) => void;
  allRooms?: any[];
  // isWorkplaceExpanded, onWorkplaceExpandedChange, isNavCollapsed, onNavCollapsedChange removed in favor of useUiStore
  hasDefaultSidebar?: boolean; // NEW: indicates if this page has an uncloseable default sidebar
  defaultSidebarContent?: React.ReactNode; // NEW: the default sidebar content
  hideLocationPicker?: boolean; // NEW: hide the location/building picker
  hideDatePicker?: boolean; // NEW: hide the date picker
  meetingCreationContext?: {
    roomId: string;
    startTime: number;
    duration?: number;
    title?: string;
    attendees?: number;
    fromAiSuggestion?: boolean;
  } | null;
  onSaveNewMeeting?: (newMeeting: any, selectedRooms: string[]) => void;
  onCancelMeetingCreation?: () => void;
  onMeetingPreviewUpdate?: (
    updatedFields: Partial<{
      startTime: number;
      duration: number;
      title: string;
      roomIds: string[];
    }>
  ) => void;
  spotlightMyEvents?: boolean;
  onSpotlightMyEventsChange?: (enabled: boolean) => void;
  compactView?: boolean;
  onCompactViewChange?: (enabled: boolean) => void;
  selectedTimezones?: string[];
  onSelectedTimezonesChange?: (timezones: string[]) => void;
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
  selectedRoomDetails?: Room | null;
  onOpenRoomDetails?: (room: any) => void;
  onCloseRoomDetails?: () => void;
  onClearRoomDetails?: () => void;
  onCreateMeeting?: (roomId: string, startTime: number) => void;
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
  onAiMeetingPreviewUpdate?: (
    preview: {
      roomId: string;
      startTime: number;
      duration: number;
      title: string;
      roomIds?: string[];
    } | null
  ) => void;
  onSelectRoom?: (roomId: string, requirements: any) => void;
  onAddDetails?: (roomId: string, requirements: any) => void;
  onMeetingSelectedForCatering?: (meeting: Meeting, room: Room) => void;
  cateringOrderDetails?: {
    meeting?: {
      title: string;
      location: string;
      time: string;
      attendees: number;
    };
    items: Array<{
      id?: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    totalCost: number;
  };
  onCateringOrderUpdate?: (details: {
    meeting?: {
      title: string;
      location: string;
      time: string;
      attendees: number;
    };
    items: Array<{
      id?: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    totalCost: number;
  }) => void;
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
  pageTabs?: Array<{ value: string; label: string }>;
  activePageTab?: string;
  onPageTabChange?: (value: string) => void;
  timeWindowStart?: number;
  onTimeWindowPrevious?: () => void;
  onTimeWindowNext?: () => void;
  onTimeWindowNow?: () => void;
  meetingSpacesViewMode?: "day" | "week" | "month";
  onMeetingSpacesViewModeChange?: (mode: "day" | "week" | "month") => void;
  selectedMonthViewRoom?: string | null;
  onSelectedMonthViewRoomChange?: (roomId: string | null) => void;
  demoTimeOverride?: number | null;
  onDemoTimeOverrideChange?: (time: number | null) => void;
  onToggleRoomOffline?: (roomId: string, isOffline: boolean) => void;
}

export function PageLayout({
  children,
  // currentView, onNavigate - now using useUiStore directly
  notifications = [],
  hasUnreadNotifications = false,
  onNotificationClick,
  onNotificationPopoverClose,
  pageTitle,
  showFloorPicker = false,
  selectedFloor = "2",
  onFloorChange,
  fullViewport = false,
  pageTabs,
  activePageTab,
  onPageTabChange,
  aiAssistantMessages = [],
  onAiAssistantMessagesUpdate,
  chatHistory = [],
  currentChatId = null,
  onLoadChatFromHistory,
  onStartNewChat,
  sidebarContent,
  // sidebarType = 'none', // Removed
  // onSidebarStateChange, // Removed
  // isWorkplaceExpanded = true, // Removed
  // onWorkplaceExpandedChange, // Removed
  // isNavCollapsed = false, // Removed
  // onNavCollapsedChange, // Removed
  hasDefaultSidebar = false,
  defaultSidebarContent,
  hideLocationPicker = false,
  hideDatePicker = false,
  selectedMeetingDetails,
  onCloseMeetingDetails,
  onOpenMeetingDetails,
  onClearMeetingDetails,
  onDeleteMeeting,
  onEditMeeting,
  allRooms,
  meetingCreationContext,
  onSaveNewMeeting,
  onCancelMeetingCreation,
  onMeetingPreviewUpdate,
  spotlightMyEvents = false,
  onSpotlightMyEventsChange,
  compactView = false,
  onCompactViewChange,
  selectedTimezones = ["America/Los_Angeles"],
  onSelectedTimezonesChange,
  activeFilters,
  onFiltersChange,
  selectedRoomDetails,
  onOpenRoomDetails,
  onCloseRoomDetails,
  onClearRoomDetails,
  onCreateMeeting,
  onBackFromRoomDetails,
  showRoomDetailsBackButton = false,
  aiMeetingPreview,
  highlightedRoomId,
  onHighlightRoom,
  onAiMeetingPreviewUpdate,
  onSelectRoom,
  onAddDetails,
  onMeetingSelectedForCatering,
  cateringOrderDetails,
  onCateringOrderUpdate,
  cateringOrderSubmitted,
  onCateringOrderSubmittedChange,
  onCreateServiceTicket,
  onNavigateToTicket,
  cateringTicketNumber,
  onCateringTicketNumberChange,
  serviceTickets = [],
  onOpenServiceTicket,
  selectedServiceTicket,
  onCloseServiceTicket,
  onBackFromServiceTicket,
  timeWindowStart = 8,
  onTimeWindowPrevious,
  onTimeWindowNext,
  onTimeWindowNow,
  meetingSpacesViewMode = "month",
  onMeetingSpacesViewModeChange,
  selectedMonthViewRoom = null,
  onSelectedMonthViewRoomChange,
  demoTimeOverride,
  onDemoTimeOverrideChange,
  onToggleRoomOffline,
}: PageLayoutProps) {
  const [selectedLocation, setSelectedLocation] = useState("54 State St.");
  const navigate = useNavigate();
  const location = useLocation();

  // Use global UI store
  const {
    currentView,
    sidebarType,
    setSidebarType,
    sidebarStack,
    setSidebarStack,
    isWorkplaceExpanded,
    toggleWorkplaceExpanded,
    isNavCollapsed,
    toggleNavCollapsed,
  } = useUiStore();

  // Create local handlers from store actions
  const onNavigate = (view: string) => {
    // Close non-persistent sidebars BEFORE navigation (synchronously)
    // AI assistant stays open, everything else closes
    if (sidebarType !== "none" && sidebarType !== "ai-assistant") {
      setSidebarType("none");
    }
    navigate("/" + view);
  };
  const onSidebarStateChange = (type: any) => setSidebarType(type);
  const onWorkplaceExpandedChange = (expanded: boolean) => {
    // Toggle only works, but we need to check current state
    if (
      (expanded && !isWorkplaceExpanded) ||
      (!expanded && isWorkplaceExpanded)
    ) {
      toggleWorkplaceExpanded();
    }
  };
  const onNavCollapsedChange = (collapsed: boolean) => {
    if ((collapsed && !isNavCollapsed) || (!collapsed && isNavCollapsed)) {
      toggleNavCollapsed();
    }
  };
  const getDefaultSidebarType = () => "none" as const;

  // Local state for sidebar type to sync with store (if needed, or just use store directly)
  // We can use store directly now, but let's keep the local state pattern if it was doing something complex
  // Actually, the previous code had complex stack logic in useEffect.
  // We should move that logic to the store or keep it here but triggered by store changes.
  // For now, let's alias store values to the names used in the component.

  const currentSidebarType = sidebarType;
  const setCurrentSidebarType = setSidebarType;

  // const [previousSidebarType, setPreviousSidebarType] = useState<string | undefined>(); // Store has this
  const previousSidebarType = useUiStore((s) => s.previousSidebarType);
  const setPreviousSidebarType = useUiStore((s) => s.setPreviousSidebarType);

  // const [sidebarStack, setSidebarStack] = useState<Exclude<SidebarType, 'none'>[]>([]); // Store has this

  const [showWorkplaceFlyout, setShowWorkplaceFlyout] = useState(false);
  const [showSettingsFlyout, setShowSettingsFlyout] = useState(false);
  const [showSupportPopover, setShowSupportPopover] = useState(false);
  const [showFeedbackPopover, setShowFeedbackPopover] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [aiDropdownInput, setAiDropdownInput] = useState("");

  // Viewport height tracking for responsive flyouts
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  // Update viewport height on resize
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Refs and state for tracking nav item positions
  const workplaceItemRef = React.useRef<HTMLDivElement>(null);
  const settingsItemRef = React.useRef<HTMLDivElement>(null);
  const navScrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [navScrollPosition, setNavScrollPosition] = useState(0);

  // Force position recalculation when flyouts open
  const [flyoutPositionKey, setFlyoutPositionKey] = useState(0);

  // Track scroll position of navigation
  React.useEffect(() => {
    const scrollContainer = navScrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setNavScrollPosition(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Force position recalculation when flyouts open
  React.useLayoutEffect(() => {
    if (showWorkplaceFlyout || showSettingsFlyout) {
      setFlyoutPositionKey((prev) => prev + 1);
    }
  }, [showWorkplaceFlyout, showSettingsFlyout]);

  // Helper function to format current time
  const getCurrentTimeString = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

    // Format exact current time
    const displayMinutes = minutes.toString().padStart(2, "0");

    return `${displayHours}:${displayMinutes} ${period}`;
  };

  // Current time state - updates every minute
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());

  // Time picker state - initialize with exact current time
  const [selectedTime, setSelectedTime] = useState(getCurrentTimeString());

  // End time picker state
  const [showEndTime, setShowEndTime] = useState(false);
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");

  // Update current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Date picker state and logic
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    // For week view, default to current week
    if (meetingSpacesViewMode === "week" && currentView === "meeting-spaces") {
      const sunday = new Date(today);
      const day = sunday.getDay();
      sunday.setDate(sunday.getDate() - day); // Go to Sunday
      const saturday = new Date(sunday);
      saturday.setDate(saturday.getDate() + 6);

      return `${sunday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${saturday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    // For month view, default to current month
    if (meetingSpacesViewMode === "month" && currentView === "meeting-spaces") {
      return today.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    // For day view, default to today
    return today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  // Helper function to display date without year for button/picker display
  const getDateDisplayWithoutYear = (dateStr: string): string => {
    // For week ranges, keep as-is but remove year from end
    if (dateStr.includes(" - ")) {
      // Format: "Jan 12 - Jan 18, 2025" -> "Jan 12 - Jan 18"
      return dateStr.replace(/, \d{4}$/, "");
    }

    // For month view, keep as-is (already shows month + year)
    if (!dateStr.includes(",")) {
      return dateStr;
    }

    // For day view, remove year
    // Format: "Jan 15, 2025" -> "Jan 15"
    return dateStr.replace(/, \d{4}$/, "");
  };

  // Generate date options based on view mode
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    // Week view: Generate week ranges (Sunday-Saturday)
    if (meetingSpacesViewMode === "week" && currentView === "meeting-spaces") {
      for (let i = -4; i < 13; i++) {
        // 4 weeks back, 12 weeks forward
        const weekStart = new Date(today);
        const dayOfWeek = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - dayOfWeek + i * 7); // Go to Sunday of week i

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Saturday

        const label = `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;

        options.push({
          value: label,
          label: label,
        });
      }
      return options;
    }

    // Month view: Generate month options
    if (meetingSpacesViewMode === "month" && currentView === "meeting-spaces") {
      for (let i = -6; i < 13; i++) {
        // 6 months back, 12 months forward
        const monthDate = new Date(
          today.getFullYear(),
          today.getMonth() + i,
          1
        );
        const label = monthDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

        options.push({
          value: label,
          label: label,
        });
      }
      return options;
    }

    // Day view: Generate daily dates
    for (let i = 0; i < 31; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      options.push({
        value: formattedDate,
        label: formattedDate,
      });
    }

    return options;
  };

  const dateOptions = generateDateOptions();

  // Update selected date when view mode changes
  useEffect(() => {
    if (currentView === "meeting-spaces" && meetingSpacesViewMode) {
      const today = new Date();

      if (meetingSpacesViewMode === "week") {
        const sunday = new Date(today);
        const day = sunday.getDay();
        sunday.setDate(sunday.getDate() - day);
        const saturday = new Date(sunday);
        saturday.setDate(saturday.getDate() + 6);

        setSelectedDate(
          `${sunday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${saturday.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        );
      } else if (meetingSpacesViewMode === "month") {
        setSelectedDate(
          today.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        );
      } else {
        setSelectedDate(
          today.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }
    }
  }, [meetingSpacesViewMode, currentView]);

  // Generate time options in 30-minute increments, plus the current exact time
  const generateTimeOptions = () => {
    const options = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute === 0 ? "00" : "30";

        options.push({
          value: `${displayHour}:${displayMinute} ${period}`,
          label: `${displayHour}:${displayMinute} ${period}`,
        });
      }
    }

    // Always add current exact time if it's not already in the list
    if (currentTime && !options.find((opt) => opt.value === currentTime)) {
      options.push({
        value: currentTime,
        label: `${currentTime} (now)`,
      });

      // Sort options by time value
      options.sort((a, b) => {
        const timeToNum = (timeStr: string): number => {
          // Remove " (now)" if present for sorting
          const cleanTimeStr = timeStr.replace(" (now)", "");
          const [time, period] = cleanTimeStr.split(" ");
          const [hourStr, minuteStr] = time.split(":");
          let hour = parseInt(hourStr);
          const minute = parseInt(minuteStr);

          if (period === "PM" && hour !== 12) {
            hour += 12;
          } else if (period === "AM" && hour === 12) {
            hour = 0;
          }

          return hour * 60 + minute;
        };

        return timeToNum(a.value) - timeToNum(b.value);
      });
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  // Convert time string to numeric value for comparison
  const timeToNumber = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // Convert to 24-hour format
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return hour + minute / 60;
  };

  // Generate end time options (only times after selected start time)
  const generateEndTimeOptions = () => {
    const startTimeValue = timeToNumber(selectedTime);

    return timeOptions.filter((option) => {
      const optionValue = timeToNumber(option.value);
      return optionValue > startTimeValue;
    });
  };

  const endTimeOptions = generateEndTimeOptions();

  // Sync with external sidebar type changes and handle default sidebar initialization
  React.useEffect(() => {
    setCurrentSidebarType(sidebarType);

    // Handle opening meeting-details sidebar with stack management
    if (sidebarType === "meeting-details") {
      let newStack = [...sidebarStack];

      // Initialize stack with current sidebar if it exists and stack is empty
      if (newStack.length === 0 && currentSidebarType !== "none") {
        newStack = [currentSidebarType];
      }

      // Add meeting-details to stack if not already at top
      if (
        newStack.length === 0 ||
        newStack[newStack.length - 1] !== "meeting-details"
      ) {
        newStack.push("meeting-details");
      }

      setSidebarStack(newStack);
    }

    // Handle opening create-meeting sidebar with stack management
    if (sidebarType === "create-meeting") {
      let newStack = [...sidebarStack];

      // Initialize stack with current sidebar if it exists and stack is empty
      if (newStack.length === 0 && currentSidebarType !== "none") {
        newStack = [currentSidebarType];
      }

      // Add create-meeting to stack if not already at top
      if (
        newStack.length === 0 ||
        newStack[newStack.length - 1] !== "create-meeting"
      ) {
        newStack.push("create-meeting");
      }

      setSidebarStack(newStack);
    }

    // Handle pages with default sidebars
    if (hasDefaultSidebar && sidebarType !== "none") {
      const defaultSidebarType = getDefaultSidebarType();

      if (defaultSidebarType !== "none") {
        // If AI assistant is currently open, ensure default sidebar is in the stack
        if (currentSidebarType === "ai-assistant") {
          // Make sure the default sidebar is at the base of the stack
          if (
            sidebarStack.length === 0 ||
            sidebarStack[0] !== defaultSidebarType
          ) {
            setSidebarStack([defaultSidebarType, "ai-assistant"]);
          }
        } else {
          // If AI assistant is not open, initialize with just the default sidebar
          setSidebarStack([defaultSidebarType]);
        }
      }
    }
  }, [sidebarType, hasDefaultSidebar, currentSidebarType]);

  const getNavItemClass = (view: string) => {
    if (view === currentView) {
      return "text-white px-3 py-2 rounded";
    }
    return "text-gray-300 hover:text-white px-3 py-2 cursor-pointer rounded";
  };

  const getNavItemStyle = (view: string) => {
    if (view === currentView) {
      return { backgroundColor: "#17559C" };
    }
    return {};
  };

  const getNavItemClassCollapsed = (view: string) => {
    if (view === currentView) {
      return "text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 rounded flex items-center justify-center";
    }
    return "text-gray-300 hover:text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 cursor-pointer rounded hover:bg-gray-800 flex items-center justify-center";
  };

  const getWorkplaceSubItemClass = (view: string) => {
    if (view === currentView) {
      return "text-white pl-[38px] pr-3 py-2 rounded text-sm";
    }
    return "text-gray-300 hover:text-white pl-[38px] pr-3 py-2 cursor-pointer text-sm";
  };

  // Helper to check if any workplace item is selected
  const workplaceItems = [
    "dashboard",
    "daily-roster",
    "meeting-services",
    "space-requests",
    "issue-reports",
    "announcements",
    "visitors",
    "deliveries",
    "surveys",
    "devices",
    "calendars",
  ];
  const isWorkplaceItemSelected = workplaceItems.includes(currentView);

  const getWorkplaceClass = () => {
    if (isWorkplaceItemSelected) {
      return "text-white px-3 py-2 rounded relative";
    }
    return "text-gray-300 hover:text-white px-3 py-2 cursor-pointer rounded relative";
  };

  const getWorkplaceClassCollapsed = () => {
    if (isWorkplaceItemSelected) {
      return "text-white w-10 h-10 rounded relative flex items-center justify-center";
    }
    return "text-gray-300 hover:text-white w-10 h-10 cursor-pointer rounded relative hover:bg-gray-800 flex items-center justify-center";
  };

  // Helper to check if any settings item is selected
  const settingsItems = [
    "settings-organization",
    "settings-offices",
    "settings-themes",
    "settings-integrations",
    "settings-people",
    "settings-groups",
    "settings-roles",
    "settings-calendars",
    "settings-event-audit-logs",
    "settings-hybrid-work-policies",
    "settings-access",
    "settings-daily-roster",
    "settings-announcements",
    "settings-surveys",
    "settings-devices",
    "settings-amenities",
    "settings-stickers",
    "settings-workplace-services",
    "settings-notifications",
    "settings-billing",
    "settings-priority-support",
  ];
  const isSettingsItemSelected = settingsItems.includes(currentView);

  const getSettingsSubItemClass = (view: string) => {
    if (view === currentView) {
      return "text-white pl-[38px] pr-3 py-2 rounded text-sm";
    }
    return "text-gray-300 hover:text-white pl-[38px] pr-3 py-2 cursor-pointer text-sm";
  };

  const getActiveStyle = () => {
    return { backgroundColor: "#17559C" };
  };

  // Universal sidebar management functions
  const handleOpenSidebar = (
    newSidebarType:
      | "ai-assistant"
      | "meeting-details"
      | "create-meeting"
      | "filters"
  ) => {
    // If the requested sidebar is already open, close it (toggle behavior)
    if (currentSidebarType === newSidebarType) {
      if (hasDefaultSidebar) {
        // Can't fully close on pages with default sidebars - just go back to default
        const defaultType = getDefaultSidebarType();
        if (defaultType !== "none") {
          setSidebarStack([defaultType]);
          setCurrentSidebarType(defaultType);
          onSidebarStateChange?.(defaultType);
        } else {
          setSidebarStack([]);
          setCurrentSidebarType("none");
          onSidebarStateChange?.("none");
        }
      } else {
        // Fully close sidebar
        setCurrentSidebarType("none");
        setSidebarStack([]);
        // onSidebarStateChange?.('none'); // Removed prop call
      }
      return;
    }

    if (hasDefaultSidebar) {
      // On pages with default sidebars, ensure default is in stack
      const defaultType = getDefaultSidebarType();
      let newStack = [...sidebarStack];

      // Ensure default sidebar is at the base if stack is empty
      if (newStack.length === 0 && defaultType !== "none") {
        newStack = [defaultType];
      }

      // Add new sidebar type if not already at top
      if (newStack[newStack.length - 1] !== newSidebarType) {
        newStack.push(newSidebarType);
      }

      setSidebarStack(newStack);
      setCurrentSidebarType(newSidebarType);
    } else {
      // On pages without default sidebars, use stack-based approach
      let newStack = [...sidebarStack];

      // Initialize stack with current sidebar if it exists and stack is empty
      if (newStack.length === 0 && currentSidebarType !== "none") {
        newStack = [currentSidebarType];
      }

      // Add new sidebar type if not already at top
      if (
        newStack.length === 0 ||
        newStack[newStack.length - 1] !== newSidebarType
      ) {
        newStack.push(newSidebarType);
      }

      setSidebarStack(newStack);
      setCurrentSidebarType(newSidebarType);
    }
    onSidebarStateChange?.(newSidebarType);
  };

  const handleOpenAiAssistant = () => {
    handleOpenSidebar("ai-assistant");
  };

  // Get page-specific suggested prompts for AI assistant dropdown
  const getPageSpecificPrompts = (page: string) => {
    switch (page) {
      case "dashboard":
        return [
          { icon: faListCheck, text: "understand my current to-dos." },
          { icon: faCircleInfo, text: "learn how seat assignments work." },
          { icon: faBell, text: "see what notifications need my attention." },
        ];
      case "tickets":
        return [
          { icon: faListCheck, text: "manage ticket workflows." },
          { icon: faExclamationCircle, text: "see all high priority tickets." },
          {
            icon: faCircleInfo,
            text: "learn about the automated ticket system.",
          },
        ];
      case "assignment":
        return [
          {
            icon: faMagicWandSparkles,
            text: "learn how AI seat assignment works.",
          },
          {
            icon: faCircleInfo,
            text: "understand what factors determine seat suggestions.",
          },
          { icon: faSliders, text: "customize assignment criteria." },
        ];
      case "map":
        return [
          { icon: faChair, text: "see available desks on this floor." },
          { icon: faTriangleExclamation, text: "report a room issue." },
          { icon: faLocationDot, text: "find meeting rooms near my team." },
        ];
      case "meeting-spaces":
        return [
          { icon: faCalendarPlus, text: "book a room for my team." },
          { icon: faEye, text: "see available spaces for today." },
          { icon: faUtensils, text: "add catering to a meeting.", isNew: true },
        ];
      default:
        return [
          { icon: faCompass, text: "navigate the dashboard." },
          { icon: faListCheck, text: "see my pending tasks." },
          { icon: faCircleInfo, text: "learn about Robin's key features." },
        ];
    }
  };

  // Generate AI response based on the selected prompt
  const generateAiResponse = (prompt: string, page: string): string => {
    const promptLower = prompt.toLowerCase();

    // Catering-related prompts
    if (
      promptLower.includes("catering") ||
      promptLower.includes("add catering")
    ) {
      return "I can help you add catering to your meeting. Please tell me which meeting you'd like to add it to, or click on the meeting in the grid on the left you want to add to.";
    }

    // Meeting-related prompts
    if (promptLower.includes("book") || promptLower.includes("room")) {
      return "I can help you find and book the perfect meeting room! I'll analyze your requirements including the number of attendees, preferred time, duration, and any special amenities you need. Just tell me the details and I'll suggest the best available options for you.";
    }

    if (promptLower.includes("available") || promptLower.includes("spaces")) {
      return "I'll help you find available meeting spaces! I can show you real-time availability across all floors, filter by capacity and amenities, and even suggest the best rooms based on your specific needs. What are you looking for?";
    }

    if (promptLower.includes("conflicts") || promptLower.includes("handle")) {
      return "I can help you manage room conflicts! I'll analyze overlapping bookings, suggest alternative times or rooms, and help you coordinate with other attendees to find the best solution. What conflict would you like me to help resolve?";
    }

    // Map/floor-related prompts
    if (promptLower.includes("desk") || promptLower.includes("floor")) {
      return "I can show you the floor layout and help you find available desks! I'll highlight open workspaces, show you where your team sits, and help you navigate the office. Which floor would you like to explore?";
    }

    if (promptLower.includes("issue") || promptLower.includes("report")) {
      return "I'll guide you through reporting facility issues! I can help you document the problem, assign it to the right team, and track its resolution. What issue would you like to report?";
    }

    if (promptLower.includes("near") || promptLower.includes("find")) {
      return "I can help you locate meeting rooms and spaces near your team! I'll show you proximity to specific people or departments and suggest the most convenient locations. Who or what area are you looking near?";
    }

    // Dashboard/general prompts
    if (promptLower.includes("to-dos") || promptLower.includes("tasks")) {
      return "I'll help you review your current tasks and priorities! I can explain pending actions, upcoming deadlines, and help you organize your workspace responsibilities. What would you like to focus on?";
    }

    if (promptLower.includes("seat") || promptLower.includes("assignment")) {
      return "I can explain how seat assignments work in Robin! I'll walk you through the assignment process, show you how to request specific seats, and explain the criteria used for automated assignments. What would you like to know?";
    }

    if (
      promptLower.includes("notification") ||
      promptLower.includes("attention")
    ) {
      return "Let me help you review your notifications! I can prioritize alerts, explain what each notification means, and help you take appropriate actions. Would you like me to summarize the important ones?";
    }

    // Tickets-related prompts
    if (promptLower.includes("ticket") || promptLower.includes("workflow")) {
      return "I can guide you through ticket management! I'll explain the workflow stages, show you how to prioritize and assign tickets, and help you track their progress. What aspect of ticket management would you like to explore?";
    }

    if (
      promptLower.includes("priority") ||
      promptLower.includes("high priority")
    ) {
      return "I'll help you identify and manage high priority tickets! I can filter by urgency, show you escalation paths, and help you coordinate quick resolutions. Would you like me to show you the current high priority items?";
    }

    if (promptLower.includes("automated") || promptLower.includes("system")) {
      return "I can explain how the automated ticket system works! I'll show you how tickets are automatically categorized, routed to the right teams, and tracked through resolution. What would you like to understand better?";
    }

    // Navigation/general help
    if (promptLower.includes("navigate") || promptLower.includes("dashboard")) {
      return "I'd be happy to help you navigate Robin! I can explain any section of the dashboard, show you how to access different features, and help you find what you're looking for quickly. Where would you like to start?";
    }

    if (promptLower.includes("features") || promptLower.includes("robin")) {
      return "I can introduce you to Robin's key features! From meeting room management and desk booking to workplace analytics and team coordination, I'll help you understand how to make the most of the platform. Which feature interests you most?";
    }

    // Default response
    return "I'm here to help! I can assist you with booking meeting rooms, finding available spaces, managing schedules, navigating the office, and much more. Just tell me what you need and I'll guide you through it.";
  };

  // Handle AI assistant dropdown prompt selection
  const handleAiPromptSelect = (prompt: string) => {
    // If there's an existing chat, start a brand new chat
    if (
      aiAssistantMessages &&
      aiAssistantMessages.length > 0 &&
      onStartNewChat
    ) {
      onStartNewChat();
    }

    // Open the AI assistant with the selected prompt pre-populated
    handleOpenSidebar("ai-assistant");

    // Check if this is the "book a room for my team" prompt
    // which should trigger the same flow as clicking it from the intro page
    const isBookRoomPrompt = prompt
      .toLowerCase()
      .includes("book a room for my team");

    // Check if this is a catering request
    const isCateringPrompt =
      prompt.toLowerCase().includes("catering") ||
      prompt.toLowerCase().includes("add catering");

    // Send the message immediately
    // We'll trigger this via a callback mechanism that the AiAssistantSidebar can listen to
    if (onAiAssistantMessagesUpdate) {
      // Use setTimeout to ensure sidebar is open and ready
      setTimeout(() => {
        const timestamp = Date.now();

        const userMessage = {
          id: `user-${timestamp}`,
          content: prompt,
          sender: "user" as const,
        };

        // For "Help me book a room for my team", use the specific response that auto-populates input
        // For catering requests, use the ezCater agent response
        // Otherwise, generate contextual AI response
        const aiResponseContent = isBookRoomPrompt
          ? "The more you tell me about your meeting the better a space I can find:\n\n• What type of meeting is it?\n• How many people will attend?\n• How long will it be?\n• Do you need any specific amenities such as a projector or whiteboard?\n• What time and date are you looking for?\n"
          : isCateringPrompt
          ? "Ok, I can help with that! First I need a little more information:\n* What is the address for the meeting?\n* What time will the meeting be?\n* How many people do you need to feed?\n* Do you have any dietary restrictions?\n* Do you have a specific cuisine in mind?"
          : generateAiResponse(prompt, currentView);

        const aiMessage: Message = {
          id: `ai-${timestamp + 1}`,
          content: aiResponseContent,
          sender: "assistant" as const,
          agentType: isCateringPrompt ? "ezcater" : undefined,
          isTyping: isBookRoomPrompt || isCateringPrompt ? true : undefined,
        };

        // Add user message immediately, then responses with delays
        const messagesWithUser = [...(aiAssistantMessages || []), userMessage];
        onAiAssistantMessagesUpdate(messagesWithUser);

        // For catering requests, add messages with delays to feel like a real conversation
        if (isCateringPrompt) {
          // Calculate typing animation durations
          // Formula: 2000ms (bouncing dots) + (content.length * 20ms) per character
          const ezCaterContent = aiResponseContent; // "Perfect! Let me help you add catering to a meeting."
          const ezCaterTypingTime = 2000 + ezCaterContent.length * 20;

          const robinContent =
            "If you click a meeting in the grid to the left I'll add some of this info for you. Or pick from the list below:";
          const robinTypingTime = 2000 + robinContent.length * 20;

          // Add ezCater response after 1000ms
          setTimeout(() => {
            const ezCaterMessage: Message = {
              id: `ai-${timestamp + 1}`,
              content: aiResponseContent,
              sender: "assistant" as const,
              agentType: "ezcater",
              isTyping: true,
            };
            const messagesWithEz = [...messagesWithUser, ezCaterMessage];
            onAiAssistantMessagesUpdate(messagesWithEz);

            // Add Robin agent response AFTER ezCater message finishes typing
            setTimeout(() => {
              const robinMessage: Message = {
                id: `ai-${timestamp + 2}`,
                content: robinContent,
                sender: "assistant" as const,
                agentType: undefined,
                showMeetingListWidget: false, // Don't show widget yet
                isTyping: true,
              };
              const messagesWithRobin = [...messagesWithEz, robinMessage];
              onAiAssistantMessagesUpdate(messagesWithRobin);

              // Show meeting list widget AFTER Robin message finishes typing
              setTimeout(() => {
                const finalMessages = messagesWithRobin.map((m) =>
                  m.id === `ai-${timestamp + 2}`
                    ? { ...m, showMeetingListWidget: true }
                    : m
                );
                onAiAssistantMessagesUpdate(finalMessages);
              }, robinTypingTime);
            }, ezCaterTypingTime);
          }, 1000);
        } else {
          // For non-catering requests, add AI response after brief delay
          setTimeout(() => {
            const newMessages = [...messagesWithUser, aiMessage];
            onAiAssistantMessagesUpdate(newMessages);
          }, 800);
        }

        // For "Help me book a room for my team", auto-populate the input with example booking
        // This happens after the AI typing animation completes
        if (isBookRoomPrompt) {
          // Calculate typing animation duration: 2000ms (bouncing dots) + (content.length * 20ms) + 100ms (cleanup)
          const typingDuration = 2000 + aiResponseContent.length * 20 + 100;

          // Auto-populate input after AI typing completes
          setTimeout(() => {
            // The AiAssistantSidebar will detect this pattern and auto-populate
            // We trigger it by updating messages with a flag or the sidebar detects the pattern
            // The existing logic in AiAssistantSidebar should handle this
          }, typingDuration);
        }
      }, 100);
    }
  };

  // Handle AI dropdown input submission
  const handleAiDropdownInputSubmit = () => {
    if (aiDropdownInput.trim()) {
      handleAiPromptSelect(aiDropdownInput.trim());
      setAiDropdownInput("");
    }
  };

  const handleOpenMeetingDetails = (meetingDetails: any) => {
    // Call the parent's handler which will set state and open sidebar
    onOpenMeetingDetails?.(meetingDetails);
  };

  const handleSidebarBack = () => {
    if (sidebarStack.length > 1) {
      // Pop current sidebar from stack and return to previous
      const newStack = [...sidebarStack];
      newStack.pop();
      setSidebarStack(newStack);
      const previousType = newStack[newStack.length - 1];
      setCurrentSidebarType(previousType);
      onSidebarStateChange?.(previousType);
    } else if (hasDefaultSidebar) {
      // If we're on a page with default sidebar, go back to default
      const defaultType = getDefaultSidebarType();
      if (defaultType !== "none") {
        setSidebarStack([defaultType]);
        setCurrentSidebarType(defaultType);
        onSidebarStateChange?.(defaultType);
      } else {
        setSidebarStack([]);
        setCurrentSidebarType("none");
        onSidebarStateChange?.("none");
      }
    } else {
      // No previous sidebar, close completely
      setCurrentSidebarType("none");
      setSidebarStack([]);
      onSidebarStateChange?.("none");
    }
  };

  const handleSidebarClose = () => {
    if (hasDefaultSidebar) {
      // Can't fully close on pages with default sidebars - just go back to default
      const defaultType = getDefaultSidebarType();
      if (defaultType !== "none") {
        setSidebarStack([defaultType]);
        setCurrentSidebarType(defaultType);
        onSidebarStateChange?.(defaultType);
      } else {
        setSidebarStack([]);
        setCurrentSidebarType("none");
        onSidebarStateChange?.("none");
      }
    } else {
      // Fully close sidebar
      setCurrentSidebarType("none");
      setSidebarStack([]);
      onSidebarStateChange?.("none");
    }

    // If we're closing meeting details, clear the meeting details state
    if (currentSidebarType === "meeting-details") {
      onClearMeetingDetails?.();
    }

    // If we're closing meeting creation, call the cancel function
    if (currentSidebarType === "create-meeting") {
      onCancelMeetingCreation?.();
    }
  };

  // Legacy function aliases for backward compatibility
  const handleBackFromAiAssistant = handleSidebarBack;
  const handleFullCloseAiAssistant = handleSidebarClose;

  const hasSidebarContent =
    (sidebarContent &&
      currentSidebarType !== "none" &&
      currentSidebarType !== "ai-assistant" &&
      currentSidebarType !== "meeting-details" &&
      currentSidebarType !== "create-meeting" &&
      currentSidebarType !== "filters") ||
    (hasDefaultSidebar &&
      currentSidebarType !== "ai-assistant" &&
      currentSidebarType !== "meeting-details" &&
      currentSidebarType !== "create-meeting" &&
      currentSidebarType !== "filters");
  const showAiButton = currentSidebarType !== "ai-assistant";

  // Show back button if there's something to go back to in the stack
  const showBackButton =
    (currentSidebarType === "ai-assistant" ||
      currentSidebarType === "meeting-details" ||
      currentSidebarType === "create-meeting" ||
      currentSidebarType === "filters") &&
    (sidebarStack.length > 1 || // Multiple items in stack
      (hasDefaultSidebar &&
        sidebarStack.length === 1 &&
        currentSidebarType !== (getDefaultSidebarType() as SidebarType))); // On default sidebar page but not showing default

  // Always show close button for AI assistant, meeting details, create meeting, and filters sidebars
  const showCloseButton =
    currentSidebarType === "ai-assistant" ||
    currentSidebarType === "meeting-details" ||
    currentSidebarType === "create-meeting" ||
    currentSidebarType === "filters";

  // Navigation item with tooltip for collapsed state
  const NavItem = React.forwardRef<
    HTMLDivElement,
    {
      view: string;
      icon: React.ReactNode;
      label: string;
      onClick: () => void;
      customContent?: React.ReactNode;
      wrapperComponent?: (children: React.ReactNode) => React.ReactNode;
      onMouseEnter?: () => void;
    }
  >(
    (
      {
        view,
        icon,
        label,
        onClick,
        customContent,
        wrapperComponent,
        onMouseEnter,
      },
      ref
    ) => {
      // Create the base content div
      const baseContent = (
        <div
          ref={ref}
          className={
            isNavCollapsed
              ? getNavItemClassCollapsed(view)
              : getNavItemClass(view)
          }
          style={view === currentView ? getActiveStyle() : {}}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
        >
          {isNavCollapsed ? (
            customContent || icon
          ) : (
            <div className="flex items-center space-x-3">
              {customContent || (
                <>
                  {icon}
                  <span style={{ fontSize: "12px" }}>{label}</span>
                </>
              )}
            </div>
          )}
        </div>
      );

      // If we have a wrapper component, apply it first
      const wrappedContent = wrapperComponent
        ? wrapperComponent(baseContent)
        : baseContent;

      // Only add tooltip in collapsed state and if we don't have a wrapper component
      // (wrapper components like Popover handle their own hover states)
      if (isNavCollapsed && !wrapperComponent) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{wrappedContent}</TooltipTrigger>
              <CustomTooltipContent side="right">{label}</CustomTooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return wrappedContent;
    }
  );

  // Workplace flyout menu for collapsed state
  const WorkplaceFlyout = () => {
    if (!isNavCollapsed || !showWorkplaceFlyout) return null;

    // Calculate position based on actual workplace item position
    // Force recalculation on scroll and when flyout opens
    const _forceUpdate = navScrollPosition + flyoutPositionKey;
    let workplaceIconTop = 256; // Default fallback

    if (workplaceItemRef.current) {
      const rect = workplaceItemRef.current.getBoundingClientRect();
      workplaceIconTop = rect.top;
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;
    const bottomPadding = 20; // Padding from bottom of viewport
    const availableHeight = viewportHeight - workplaceIconTop - bottomPadding;
    // Use available height directly, ensuring at least 150px minimum for edge cases
    const finalMaxHeight = Math.max(150, availableHeight);

    return (
      <div
        className="fixed left-18 max-[600px]:left-9 text-white rounded-lg shadow-lg border border-gray-700 z-50 flex flex-col"
        style={{
          top: `${workplaceIconTop}px`,
          backgroundColor: "#131A23",
          maxHeight: `${finalMaxHeight}px`,
        }}
        onMouseLeave={() => setShowWorkplaceFlyout(false)}
      >
        <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-700 flex-shrink-0">
          Workplace
        </div>
        <div className="overflow-y-auto scrollbar-overlay py-2 flex-1 min-h-0">
          {[
            { view: "dashboard", label: "Dashboard" },
            { view: "daily-roster", label: "Daily roster" },
            { view: "meeting-services", label: "Meeting services" },
            { view: "space-requests", label: "Space requests" },
            { view: "issue-reports", label: "Issue reports" },
            { view: "announcements", label: "Announcements" },
            { view: "visitors", label: "Visitors" },
            { view: "deliveries", label: "Deliveries" },
            { view: "surveys", label: "Surveys" },
            { view: "devices", label: "Devices" },
            { view: "calendars", label: "Calendars" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowWorkplaceFlyout(false);
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Settings flyout menu for collapsed state
  const SettingsFlyout = () => {
    if (!isNavCollapsed || !showSettingsFlyout) return null;

    // Calculate position based on actual settings item position
    // Force recalculation on scroll and when flyout opens
    const _forceUpdate = navScrollPosition + flyoutPositionKey;
    let settingsIconTop = 344; // Default fallback

    if (settingsItemRef.current) {
      const rect = settingsItemRef.current.getBoundingClientRect();
      settingsIconTop = rect.top;
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;
    const bottomPadding = 20; // Padding from bottom of viewport
    const availableHeight = viewportHeight - settingsIconTop - bottomPadding;
    // Use available height directly, ensuring at least 150px minimum for edge cases
    const finalMaxHeight = Math.max(150, availableHeight);

    return (
      <div
        className="fixed left-18 max-[600px]:left-9 text-white rounded-lg shadow-lg border border-gray-700 z-50 flex flex-col"
        style={{
          top: `${settingsIconTop}px`,
          backgroundColor: "#131A23",
          maxHeight: `${finalMaxHeight}px`,
        }}
        onMouseLeave={() => setShowSettingsFlyout(false)}
      >
        <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-700 flex-shrink-0">
          Settings
        </div>
        <div className="overflow-y-auto scrollbar-overlay py-2 flex-1 min-h-0">
          {/* Group 1: Organization, Offices, Themes, Integrations */}
          {[
            { view: "settings-organization", label: "Organization" },
            { view: "settings-offices", label: "Offices" },
            { view: "settings-themes", label: "Themes" },
            { view: "settings-integrations", label: "Integrations" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 2: People, Groups, Roles */}
          {[
            { view: "settings-people", label: "People" },
            { view: "settings-groups", label: "Groups" },
            { view: "settings-roles", label: "Roles" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 3: Calendars, Event audit logs */}
          {[
            { view: "settings-calendars", label: "Calendars" },
            { view: "settings-event-audit-logs", label: "Event audit logs" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 4: Hybrid work policies, Access, Daily roster, Announcements, Surveys */}
          {[
            {
              view: "settings-hybrid-work-policies",
              label: "Hybrid work policies",
            },
            { view: "settings-access", label: "Access" },
            { view: "settings-daily-roster", label: "Daily roster" },
            { view: "settings-announcements", label: "Announcements" },
            { view: "settings-surveys", label: "Surveys" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 5: Devices, Amenities, Stickers */}
          {[
            { view: "settings-devices", label: "Devices" },
            { view: "settings-amenities", label: "Amenities" },
            { view: "settings-stickers", label: "Stickers" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 6: Workplace services, Notifications, Billing */}
          {[
            {
              view: "settings-workplace-services",
              label: "Workplace services",
            },
            { view: "settings-notifications", label: "Notifications" },
            { view: "settings-billing", label: "Billing" },
          ].map(({ view, label }) => (
            <div
              key={view}
              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
                view === currentView ? "text-white" : "text-gray-300"
              }`}
              style={{
                fontSize: "12px",
                ...(view === currentView ? { backgroundColor: "#17559C" } : {}),
              }}
              onClick={() => {
                onNavigate(view);
                setShowSettingsFlyout(false);
              }}
            >
              {label}
            </div>
          ))}

          <div className="h-px bg-gray-700 my-1"></div>

          {/* Group 7: Priority support */}
          <div
            className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm whitespace-nowrap ${
              "settings-priority-support" === currentView
                ? "text-white"
                : "text-gray-300"
            }`}
            style={{
              fontSize: "12px",
              ...("settings-priority-support" === currentView
                ? { backgroundColor: "#17559C" }
                : {}),
            }}
            onClick={() => {
              onNavigate("settings-priority-support");
              setShowSettingsFlyout(false);
            }}
          >
            Priority support
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden max-w-full">
      {/* Sidebar - Full Height - Responsive: 36px on mobile, 72px/200px on desktop */}
      <div
        className={`max-[600px]:w-9 ${
          isNavCollapsed ? "w-18" : "w-[200px]"
        } text-white h-screen flex flex-col transition-all duration-300 flex-shrink-0`}
        style={{ backgroundColor: "#131A23" }}
      >
        {/* Fixed Header */}
        <div className="p-4 max-[600px]:p-2 flex-shrink-0 relative">
          {/* Wayne Ent. Branding at Top */}
          <div
            className={`flex items-center space-x-2 ${
              isNavCollapsed ? "justify-center" : ""
            } max-[600px]:justify-center`}
          >
            <div className="w-8 h-8 max-[600px]:w-6 max-[600px]:h-6 bg-white rounded flex items-center justify-center">
              <span className="text-[#1e3a8a] text-sm max-[600px]:text-xs font-semibold">
                W
              </span>
            </div>
            {!isNavCollapsed && (
              <span className="text-xl font-semibold text-white max-[600px]:hidden">
                Wayne Ent.
              </span>
            )}
          </div>

          {/* Collapse/Expand Button - Tab Style (hidden on mobile < 600px) */}
          {onNavCollapsedChange && (
            <button
              onClick={() => onNavCollapsedChange(!isNavCollapsed)}
              className="fixed w-3 h-6 flex items-center justify-center pr-0.5 transition-all duration-300 z-50 hover:opacity-80 cursor-pointer max-[600px]:hidden"
              style={{
                top: "20px",
                left: isNavCollapsed ? "72px" : "200px",
                backgroundColor: "#131A23",
                borderTopRightRadius: "4px",
                borderBottomRightRadius: "4px",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
            >
              {isNavCollapsed ? (
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-white"
                  style={{ fontSize: "7px" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-white"
                  style={{ fontSize: "7px" }}
                />
              )}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div
          ref={navScrollContainerRef}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          <nav className="p-4 max-[600px]:p-1 space-y-1 max-[600px]:space-y-0">
            {/* Primary Navigation Items - Before Workplace */}
            <NavItem
              view="map"
              icon={
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-3.5 h-3.5"
                />
              }
              label="Map"
              onClick={() => onNavigate("map")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            <NavItem
              view="my-schedule"
              icon={
                <FontAwesomeIcon icon={faCalendar} className="w-3.5 h-3.5" />
              }
              label="My Schedule"
              onClick={() => onNavigate("my-schedule")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            <NavItem
              view="meeting-spaces"
              icon={
                <FontAwesomeIcon icon={faDoorOpen} className="w-3.5 h-3.5" />
              }
              label="Meeting Spaces"
              onClick={() => onNavigate("meeting-spaces")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            <NavItem
              view="tickets"
              icon={<FontAwesomeIcon icon={faTicket} className="w-3.5 h-3.5" />}
              label="Tickets"
              onClick={() => onNavigate("tickets")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            {/* Workplace Section - Collapsible or Flyout */}
            {isNavCollapsed ? (
              <div
                ref={workplaceItemRef}
                className={
                  isWorkplaceItemSelected
                    ? "text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 rounded flex items-center justify-center"
                    : "text-gray-300 hover:text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 cursor-pointer rounded hover:bg-gray-800 flex items-center justify-center"
                }
                style={isWorkplaceItemSelected ? getActiveStyle() : {}}
                onClick={() =>
                  !isWorkplaceItemSelected && onNavigate("dashboard")
                }
                onMouseEnter={() => {
                  setShowWorkplaceFlyout(true);
                  setShowSettingsFlyout(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faCity}
                  className="w-3.5 h-3.5 max-[600px]:w-2.5 max-[600px]:h-2.5"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div
                  className={`flex items-center justify-between ${
                    isWorkplaceItemSelected && !isWorkplaceExpanded
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  } px-3 py-2 cursor-pointer rounded`}
                  onClick={() => {
                    onWorkplaceExpandedChange?.(!isWorkplaceExpanded);
                    // Close Settings submenu when opening Workplace
                    if (!isWorkplaceExpanded) {
                      setIsSettingsExpanded(false);
                    }
                  }}
                  style={
                    isWorkplaceItemSelected && !isWorkplaceExpanded
                      ? { backgroundColor: "#17559C" }
                      : {}
                  }
                >
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faCity} className="w-3.5 h-3.5" />
                    <span style={{ fontSize: "12px" }}>Workplace</span>
                  </div>
                  {isWorkplaceExpanded ? (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="w-3.5 h-3.5"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3.5 h-3.5"
                    />
                  )}
                </div>

                {/* Workplace Submenu - Full Width */}
                {isWorkplaceExpanded && (
                  <div
                    className="-mx-4 space-y-1 px-4"
                    style={{ backgroundColor: "#000C17" }}
                  >
                    <div
                      className={getWorkplaceSubItemClass("dashboard")}
                      onClick={() => onNavigate("dashboard")}
                      style={{
                        fontSize: "12px",
                        ...("dashboard" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Dashboard
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("daily-roster")}
                      onClick={() => onNavigate("daily-roster")}
                      style={{
                        fontSize: "12px",
                        ...("daily-roster" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Daily roster
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("meeting-services")}
                      onClick={() => onNavigate("meeting-services")}
                      style={{
                        fontSize: "12px",
                        ...("meeting-services" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Meeting services
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("space-requests")}
                      onClick={() => onNavigate("space-requests")}
                      style={{
                        fontSize: "12px",
                        ...("space-requests" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Space requests
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("issue-reports")}
                      onClick={() => onNavigate("issue-reports")}
                      style={{
                        fontSize: "12px",
                        ...("issue-reports" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Issue reports
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("announcements")}
                      onClick={() => onNavigate("announcements")}
                      style={{
                        fontSize: "12px",
                        ...("announcements" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Announcements
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("visitors")}
                      onClick={() => onNavigate("visitors")}
                      style={{
                        fontSize: "12px",
                        ...("visitors" === currentView ? getActiveStyle() : {}),
                      }}
                    >
                      Visitors
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("deliveries")}
                      onClick={() => onNavigate("deliveries")}
                      style={{
                        fontSize: "12px",
                        ...("deliveries" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Deliveries
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("surveys")}
                      onClick={() => onNavigate("surveys")}
                      style={{
                        fontSize: "12px",
                        ...("surveys" === currentView ? getActiveStyle() : {}),
                      }}
                    >
                      Surveys
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("devices")}
                      onClick={() => onNavigate("devices")}
                      style={{
                        fontSize: "12px",
                        ...("devices" === currentView ? getActiveStyle() : {}),
                      }}
                    >
                      Devices
                    </div>
                    <div
                      className={getWorkplaceSubItemClass("calendars")}
                      onClick={() => onNavigate("calendars")}
                      style={{
                        fontSize: "12px",
                        ...("calendars" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Calendars
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary Navigation Items - After Workplace */}
            <NavItem
              view="space-planning"
              icon={
                <FontAwesomeIcon icon={faTableCells} className="w-3.5 h-3.5" />
              }
              label="Space Planning"
              onClick={() => onNavigate("space-planning")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            <NavItem
              view="people"
              icon={<FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" />}
              label="People"
              onClick={() => onNavigate("people")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            <NavItem
              view="analytics"
              icon={
                <FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5" />
              }
              label="Analytics"
              onClick={() => onNavigate("analytics")}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
            />

            {/* Settings - Expandable Submenu */}
            {isNavCollapsed ? (
              <div
                ref={settingsItemRef}
                className={
                  isSettingsItemSelected
                    ? "text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 rounded flex items-center justify-center"
                    : "text-gray-300 hover:text-white w-10 h-10 max-[600px]:w-full max-[600px]:h-8 cursor-pointer rounded hover:bg-gray-800 flex items-center justify-center"
                }
                style={isSettingsItemSelected ? getActiveStyle() : {}}
                onClick={() =>
                  !isSettingsItemSelected && onNavigate("settings-organization")
                }
                onMouseEnter={() => {
                  setShowSettingsFlyout(true);
                  setShowWorkplaceFlyout(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faCog}
                  className="w-3.5 h-3.5 max-[600px]:w-2.5 max-[600px]:h-2.5"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div
                  className={`flex items-center justify-between ${
                    isSettingsItemSelected && !isSettingsExpanded
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  } px-3 py-2 cursor-pointer rounded`}
                  onClick={() => {
                    setIsSettingsExpanded(!isSettingsExpanded);
                    // Close Workplace submenu when opening Settings
                    if (!isSettingsExpanded) {
                      onWorkplaceExpandedChange?.(false);
                    }
                  }}
                  style={
                    isSettingsItemSelected && !isSettingsExpanded
                      ? { backgroundColor: "#17559C" }
                      : {}
                  }
                >
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faCog} className="w-3.5 h-3.5" />
                    <span style={{ fontSize: "12px" }}>Settings</span>
                  </div>
                  {isSettingsExpanded ? (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="w-3.5 h-3.5"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3.5 h-3.5"
                    />
                  )}
                </div>

                {/* Settings Submenu - Full Width */}
                {isSettingsExpanded && (
                  <div
                    className="-mx-4 space-y-1 px-4"
                    style={{ backgroundColor: "#000C17" }}
                  >
                    {/* Group 1: Organization, Offices, Themes, Integrations */}
                    <div
                      className={getSettingsSubItemClass(
                        "settings-organization"
                      )}
                      onClick={() => onNavigate("settings-organization")}
                      style={{
                        fontSize: "12px",
                        ...("settings-organization" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Organization
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-offices")}
                      onClick={() => onNavigate("settings-offices")}
                      style={{
                        fontSize: "12px",
                        ...("settings-offices" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Offices
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-themes")}
                      onClick={() => onNavigate("settings-themes")}
                      style={{
                        fontSize: "12px",
                        ...("settings-themes" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Themes
                    </div>
                    <div
                      className={getSettingsSubItemClass(
                        "settings-integrations"
                      )}
                      onClick={() => onNavigate("settings-integrations")}
                      style={{
                        fontSize: "12px",
                        ...("settings-integrations" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Integrations
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 2: People, Groups, Roles */}
                    <div
                      className={getSettingsSubItemClass("settings-people")}
                      onClick={() => onNavigate("settings-people")}
                      style={{
                        fontSize: "12px",
                        ...("settings-people" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      People
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-groups")}
                      onClick={() => onNavigate("settings-groups")}
                      style={{
                        fontSize: "12px",
                        ...("settings-groups" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Groups
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-roles")}
                      onClick={() => onNavigate("settings-roles")}
                      style={{
                        fontSize: "12px",
                        ...("settings-roles" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Roles
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 3: Calendars, Event audit logs */}
                    <div
                      className={getSettingsSubItemClass("settings-calendars")}
                      onClick={() => onNavigate("settings-calendars")}
                      style={{
                        fontSize: "12px",
                        ...("settings-calendars" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Calendars
                    </div>
                    <div
                      className={getSettingsSubItemClass(
                        "settings-event-audit-logs"
                      )}
                      onClick={() => onNavigate("settings-event-audit-logs")}
                      style={{
                        fontSize: "12px",
                        ...("settings-event-audit-logs" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Event audit logs
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 4: Hybrid work policies, Access, Daily roster, Announcements, Surveys */}
                    <div
                      className={getSettingsSubItemClass(
                        "settings-hybrid-work-policies"
                      )}
                      onClick={() =>
                        onNavigate("settings-hybrid-work-policies")
                      }
                      style={{
                        fontSize: "12px",
                        ...("settings-hybrid-work-policies" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Hybrid work policies
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-access")}
                      onClick={() => onNavigate("settings-access")}
                      style={{
                        fontSize: "12px",
                        ...("settings-access" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Access
                    </div>
                    <div
                      className={getSettingsSubItemClass(
                        "settings-daily-roster"
                      )}
                      onClick={() => onNavigate("settings-daily-roster")}
                      style={{
                        fontSize: "12px",
                        ...("settings-daily-roster" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Daily roster
                    </div>
                    <div
                      className={getSettingsSubItemClass(
                        "settings-announcements"
                      )}
                      onClick={() => onNavigate("settings-announcements")}
                      style={{
                        fontSize: "12px",
                        ...("settings-announcements" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Announcements
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-surveys")}
                      onClick={() => onNavigate("settings-surveys")}
                      style={{
                        fontSize: "12px",
                        ...("settings-surveys" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Surveys
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 5: Devices, Amenities, Stickers */}
                    <div
                      className={getSettingsSubItemClass("settings-devices")}
                      onClick={() => onNavigate("settings-devices")}
                      style={{
                        fontSize: "12px",
                        ...("settings-devices" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Devices
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-amenities")}
                      onClick={() => onNavigate("settings-amenities")}
                      style={{
                        fontSize: "12px",
                        ...("settings-amenities" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Amenities
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-stickers")}
                      onClick={() => onNavigate("settings-stickers")}
                      style={{
                        fontSize: "12px",
                        ...("settings-stickers" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Stickers
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 6: Workplace services, Notifications, Billing */}
                    <div
                      className={getSettingsSubItemClass(
                        "settings-workplace-services"
                      )}
                      onClick={() => onNavigate("settings-workplace-services")}
                      style={{
                        fontSize: "12px",
                        ...("settings-workplace-services" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Workplace services
                    </div>
                    <div
                      className={getSettingsSubItemClass(
                        "settings-notifications"
                      )}
                      onClick={() => onNavigate("settings-notifications")}
                      style={{
                        fontSize: "12px",
                        ...("settings-notifications" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Notifications
                    </div>
                    <div
                      className={getSettingsSubItemClass("settings-billing")}
                      onClick={() => onNavigate("settings-billing")}
                      style={{
                        fontSize: "12px",
                        ...("settings-billing" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Billing
                    </div>

                    {/* Separator */}
                    <div className="py-1">
                      <div className="border-t border-gray-700"></div>
                    </div>

                    {/* Group 7: Priority support */}
                    <div
                      className={getSettingsSubItemClass(
                        "settings-priority-support"
                      )}
                      onClick={() => onNavigate("settings-priority-support")}
                      style={{
                        fontSize: "12px",
                        ...("settings-priority-support" === currentView
                          ? getActiveStyle()
                          : {}),
                      }}
                    >
                      Priority support
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div className="p-4 max-[600px]:p-1 border-t border-gray-700 space-y-1 max-[600px]:space-y-0 flex-shrink-0">
          {/* Support */}
          <NavItem
            view="support"
            icon={
              <FontAwesomeIcon
                icon={faQuestionCircle}
                className="w-3.5 h-3.5"
              />
            }
            label="Support"
            onClick={() => {}}
            onMouseEnter={() => {
              setShowWorkplaceFlyout(false);
              setShowSettingsFlyout(false);
            }}
            wrapperComponent={(children) => {
              if (isNavCollapsed) {
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Popover
                            open={showSupportPopover}
                            onOpenChange={setShowSupportPopover}
                          >
                            <PopoverTrigger asChild>{children}</PopoverTrigger>
                            <PopoverContent
                              className="w-80 p-0"
                              align="start"
                              side="right"
                              sideOffset={16}
                            >
                              <div className="p-4 border-b border-gray-200">
                                <h3
                                  style={{ fontSize: "16px", fontWeight: 500 }}
                                >
                                  Get Support
                                </h3>
                                <p
                                  className="text-gray-500 mt-1"
                                  style={{ fontSize: "14px", fontWeight: 400 }}
                                >
                                  Choose a support option to get help
                                </p>
                              </div>

                              <div className="p-3 space-y-2">
                                <button
                                  onClick={() => setShowSupportPopover(false)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <FontAwesomeIcon
                                        icon={faCog}
                                        className="w-4 h-4 text-blue-600"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: 500,
                                        }}
                                        className="text-gray-900"
                                      >
                                        Technical Support
                                      </p>
                                      <p
                                        className="text-gray-500 mt-0.5"
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: 400,
                                        }}
                                      >
                                        Issues with room bookings, devices, or
                                        system errors
                                      </p>
                                    </div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => setShowSupportPopover(false)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="w-4 h-4 text-green-600"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: 500,
                                        }}
                                        className="text-gray-900"
                                      >
                                        Account & Billing
                                      </p>
                                      <p
                                        className="text-gray-500 mt-0.5"
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: 400,
                                        }}
                                      >
                                        Questions about your account or billing
                                      </p>
                                    </div>
                                  </div>
                                </button>

                                <button
                                  onClick={() => setShowSupportPopover(false)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                      <FontAwesomeIcon
                                        icon={faQuestionCircle}
                                        className="w-4 h-4 text-purple-600"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          fontWeight: 500,
                                        }}
                                        className="text-gray-900"
                                      >
                                        General Inquiry
                                      </p>
                                      <p
                                        className="text-gray-500 mt-0.5"
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: 400,
                                        }}
                                      >
                                        Other questions or workplace requests
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              </div>

                              <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <p
                                  className="text-gray-500"
                                  style={{ fontSize: "12px", fontWeight: 400 }}
                                >
                                  Need immediate help? Call us at{" "}
                                  <span
                                    className="text-blue-600"
                                    style={{ fontWeight: 500 }}
                                  >
                                    1-800-WAYNE-ENT
                                  </span>
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TooltipTrigger>
                      <CustomTooltipContent side="right">
                        Support
                      </CustomTooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return (
                <Popover
                  open={showSupportPopover}
                  onOpenChange={setShowSupportPopover}
                >
                  <PopoverTrigger asChild>{children}</PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-0"
                    align="start"
                    side="right"
                    sideOffset={16}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 style={{ fontSize: "16px", fontWeight: 500 }}>
                        Get Support
                      </h3>
                      <p
                        className="text-gray-500 mt-1"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        Choose a support option to get help
                      </p>
                    </div>

                    <div className="p-3 space-y-2">
                      <button
                        onClick={() => setShowSupportPopover(false)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <FontAwesomeIcon
                              icon={faCog}
                              className="w-4 h-4 text-blue-600"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              style={{ fontSize: "14px", fontWeight: 500 }}
                              className="text-gray-900"
                            >
                              Technical Support
                            </p>
                            <p
                              className="text-gray-500 mt-0.5"
                              style={{ fontSize: "12px", fontWeight: 400 }}
                            >
                              Issues with room bookings, devices, or system
                              errors
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowSupportPopover(false)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="w-4 h-4 text-green-600"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              style={{ fontSize: "14px", fontWeight: 500 }}
                              className="text-gray-900"
                            >
                              Account & Billing
                            </p>
                            <p
                              className="text-gray-500 mt-0.5"
                              style={{ fontSize: "12px", fontWeight: 400 }}
                            >
                              Questions about your account or billing
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setShowSupportPopover(false)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              className="w-4 h-4 text-purple-600"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              style={{ fontSize: "14px", fontWeight: 500 }}
                              className="text-gray-900"
                            >
                              General Inquiry
                            </p>
                            <p
                              className="text-gray-500 mt-0.5"
                              style={{ fontSize: "12px", fontWeight: 400 }}
                            >
                              Other questions or workplace requests
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <p
                        className="text-gray-500"
                        style={{ fontSize: "12px", fontWeight: 400 }}
                      >
                        Need immediate help? Call us at{" "}
                        <span
                          className="text-blue-600"
                          style={{ fontWeight: 500 }}
                        >
                          1-800-WAYNE-ENT
                        </span>
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }}
          />

          {/* Feedback */}
          <NavItem
            view="feedback"
            icon={
              <FontAwesomeIcon
                icon={faComment}
                className="w-3.5 h-3.5 max-[600px]:w-2.5 max-[600px]:h-2.5"
              />
            }
            label="Feedback"
            onClick={() => {}}
            onMouseEnter={() => {
              setShowWorkplaceFlyout(false);
              setShowSettingsFlyout(false);
            }}
            wrapperComponent={(children) => {
              if (isNavCollapsed) {
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Popover
                            open={showFeedbackPopover}
                            onOpenChange={setShowFeedbackPopover}
                          >
                            <PopoverTrigger asChild>{children}</PopoverTrigger>
                            <PopoverContent
                              className="w-96 p-0"
                              align="start"
                              side="right"
                              sideOffset={16}
                            >
                              <div className="p-4 border-b border-gray-200">
                                <h3
                                  style={{ fontSize: "16px", fontWeight: 500 }}
                                >
                                  Send Feedback
                                </h3>
                                <p
                                  className="text-gray-500 mt-1"
                                  style={{ fontSize: "14px", fontWeight: 400 }}
                                >
                                  Help us improve your experience
                                </p>
                              </div>

                              <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                  <label
                                    htmlFor="feedback-type"
                                    className="text-gray-700"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Feedback Type
                                  </label>
                                  <Select
                                    value={feedbackType}
                                    onValueChange={setFeedbackType}
                                  >
                                    <SelectTrigger
                                      id="feedback-type"
                                      className="w-full"
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="bug">
                                        Bug Report
                                      </SelectItem>
                                      <SelectItem value="feature">
                                        Feature Request
                                      </SelectItem>
                                      <SelectItem value="general">
                                        General Feedback
                                      </SelectItem>
                                      <SelectItem value="improvement">
                                        Improvement Suggestion
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <label
                                    htmlFor="feedback-subject"
                                    className="text-gray-700"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Subject
                                  </label>
                                  <Input
                                    id="feedback-subject"
                                    placeholder="Brief description of your feedback"
                                    value={feedbackSubject}
                                    onChange={(e) =>
                                      setFeedbackSubject(e.target.value)
                                    }
                                    className="w-full"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 400,
                                    }}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    htmlFor="feedback-message"
                                    className="text-gray-700"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Message
                                  </label>
                                  <Textarea
                                    id="feedback-message"
                                    placeholder="Please provide details about your feedback..."
                                    value={feedbackMessage}
                                    onChange={(e) =>
                                      setFeedbackMessage(e.target.value)
                                    }
                                    className="w-full min-h-[100px] resize-none"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 400,
                                    }}
                                  />
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setShowFeedbackPopover(false);
                                      setFeedbackType("general");
                                      setFeedbackSubject("");
                                      setFeedbackMessage("");
                                    }}
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setShowFeedbackPopover(false);
                                      setFeedbackType("general");
                                      setFeedbackSubject("");
                                      setFeedbackMessage("");
                                    }}
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Submit Feedback
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TooltipTrigger>
                      <CustomTooltipContent side="right">
                        Feedback
                      </CustomTooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return (
                <Popover
                  open={showFeedbackPopover}
                  onOpenChange={setShowFeedbackPopover}
                >
                  <PopoverTrigger asChild>{children}</PopoverTrigger>
                  <PopoverContent
                    className="w-96 p-0"
                    align="start"
                    side="right"
                    sideOffset={16}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 style={{ fontSize: "16px", fontWeight: 500 }}>
                        Send Feedback
                      </h3>
                      <p
                        className="text-gray-500 mt-1"
                        style={{ fontSize: "14px", fontWeight: 400 }}
                      >
                        Help us improve your experience
                      </p>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="feedback-type"
                          className="text-gray-700"
                          style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                          Feedback Type
                        </label>
                        <Select
                          value={feedbackType}
                          onValueChange={setFeedbackType}
                        >
                          <SelectTrigger id="feedback-type" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="feature">
                              Feature Request
                            </SelectItem>
                            <SelectItem value="general">
                              General Feedback
                            </SelectItem>
                            <SelectItem value="improvement">
                              Improvement Suggestion
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="feedback-subject"
                          className="text-gray-700"
                          style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                          Subject
                        </label>
                        <Input
                          id="feedback-subject"
                          placeholder="Brief description of your feedback"
                          value={feedbackSubject}
                          onChange={(e) => setFeedbackSubject(e.target.value)}
                          className="w-full"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="feedback-message"
                          className="text-gray-700"
                          style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                          Message
                        </label>
                        <Textarea
                          id="feedback-message"
                          placeholder="Please provide details about your feedback..."
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          className="w-full min-h-[100px] resize-none"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowFeedbackPopover(false);
                            setFeedbackType("general");
                            setFeedbackSubject("");
                            setFeedbackMessage("");
                          }}
                          style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setShowFeedbackPopover(false);
                            setFeedbackType("general");
                            setFeedbackSubject("");
                            setFeedbackMessage("");
                          }}
                          style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                          Submit Feedback
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }}
          />

          {/* Notifications */}
          {onNotificationClick && onNotificationPopoverClose && (
            <NavItem
              view="notifications"
              icon={
                <div className="w-3.5 h-3.5 flex items-center justify-center relative">
                  <FontAwesomeIcon icon={faBell} className="w-3.5 h-3.5" />
                  {hasUnreadNotifications && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              }
              label="Notifications"
              onClick={() => {}}
              onMouseEnter={() => {
                setShowWorkplaceFlyout(false);
                setShowSettingsFlyout(false);
              }}
              customContent={
                isNavCollapsed ? (
                  <div className="relative">
                    <FontAwesomeIcon icon={faBell} className="w-3.5 h-3.5" />
                    {hasUnreadNotifications && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-3.5 h-3.5 flex items-center justify-center relative">
                      <FontAwesomeIcon icon={faBell} className="w-3.5 h-3.5" />
                      {hasUnreadNotifications && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <span style={{ fontSize: "12px" }}>Notifications</span>
                  </div>
                )
              }
              wrapperComponent={(children) => {
                // For collapsed state, wrap the popover trigger with tooltip
                if (isNavCollapsed) {
                  return (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Popover
                              onOpenChange={(open) =>
                                !open && onNotificationPopoverClose()
                              }
                            >
                              <PopoverTrigger asChild>
                                {children}
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-80 p-0"
                                align="start"
                                side="right"
                                sideOffset={16}
                              >
                                <div className="p-4 border-b border-gray-200">
                                  <h3 className="font-semibold text-gray-900">
                                    Notifications
                                  </h3>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                  {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                      <FontAwesomeIcon
                                        icon={faBell}
                                        className="w-8 h-8 mx-auto mb-2 text-gray-300"
                                      />
                                      <p className="text-sm">
                                        No notifications
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="space-y-0">
                                      {notifications.map((notification) => (
                                        <div
                                          key={notification.id}
                                          onClick={() =>
                                            onNotificationClick(notification)
                                          }
                                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            !notification.read
                                              ? "bg-blue-50"
                                              : ""
                                          }`}
                                        >
                                          <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                              {notification.type === "todo" ? (
                                                <FontAwesomeIcon
                                                  icon={faUser}
                                                  className="w-4 h-4 text-blue-600"
                                                />
                                              ) : notification.type ===
                                                "success" ? (
                                                <FontAwesomeIcon
                                                  icon={faCheckCircle}
                                                  className="w-4 h-4 text-green-600"
                                                />
                                              ) : (
                                                <FontAwesomeIcon
                                                  icon={faBell}
                                                  className="w-4 h-4 text-gray-600"
                                                />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                  {notification.title}
                                                </p>
                                                {!notification.read && (
                                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                )}
                                              </div>
                                              <p className="text-xs text-gray-500 mt-1">
                                                {notification.description}
                                              </p>
                                              <div className="flex items-center space-x-1 mt-2">
                                                <FontAwesomeIcon
                                                  icon={faClock}
                                                  className="w-3 h-3 text-gray-400"
                                                />
                                                <span className="text-xs text-gray-400">
                                                  {(() => {
                                                    const date = new Date(
                                                      notification.timestamp
                                                    );
                                                    const now = new Date();
                                                    const diffInMinutes =
                                                      Math.floor(
                                                        (now.getTime() -
                                                          date.getTime()) /
                                                          (1000 * 60)
                                                      );

                                                    if (diffInMinutes < 1)
                                                      return "Just now";
                                                    if (diffInMinutes < 60)
                                                      return `${diffInMinutes}m ago`;

                                                    const diffInHours =
                                                      Math.floor(
                                                        diffInMinutes / 60
                                                      );
                                                    if (diffInHours < 24)
                                                      return `${diffInHours}h ago`;

                                                    const diffInDays =
                                                      Math.floor(
                                                        diffInHours / 24
                                                      );
                                                    return `${diffInDays}d ago`;
                                                  })()}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {notifications.length > 0 && (
                                  <div className="p-3 border-t border-gray-200">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full text-sm text-gray-600 hover:text-gray-900"
                                      onClick={() =>
                                        onNavigate("notifications")
                                      }
                                    >
                                      View all notifications
                                    </Button>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TooltipTrigger>
                        <CustomTooltipContent side="right">
                          Notifications
                        </CustomTooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }

                // For expanded state, just show the popover
                return (
                  <Popover
                    onOpenChange={(open) =>
                      !open && onNotificationPopoverClose()
                    }
                  >
                    <PopoverTrigger asChild>{children}</PopoverTrigger>
                    <PopoverContent
                      className="w-80 p-0"
                      align="start"
                      side="right"
                      sideOffset={16}
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <FontAwesomeIcon
                              icon={faBell}
                              className="w-8 h-8 mx-auto mb-2 text-gray-300"
                            />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          <div className="space-y-0">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                onClick={() =>
                                  onNotificationClick(notification)
                                }
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.read ? "bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {notification.type === "todo" ? (
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="w-4 h-4 text-blue-600"
                                      />
                                    ) : notification.type === "success" ? (
                                      <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        className="w-4 h-4 text-green-600"
                                      />
                                    ) : (
                                      <FontAwesomeIcon
                                        icon={faBell}
                                        className="w-4 h-4 text-gray-600"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {notification.title}
                                      </p>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.description}
                                    </p>
                                    <div className="flex items-center space-x-1 mt-2">
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="w-3 h-3 text-gray-400"
                                      />
                                      <span className="text-xs text-gray-400">
                                        {(() => {
                                          const date = new Date(
                                            notification.timestamp
                                          );
                                          const now = new Date();
                                          const diffInMinutes = Math.floor(
                                            (now.getTime() - date.getTime()) /
                                              (1000 * 60)
                                          );

                                          if (diffInMinutes < 1)
                                            return "Just now";
                                          if (diffInMinutes < 60)
                                            return `${diffInMinutes}m ago`;

                                          const diffInHours = Math.floor(
                                            diffInMinutes / 60
                                          );
                                          if (diffInHours < 24)
                                            return `${diffInHours}h ago`;

                                          const diffInDays = Math.floor(
                                            diffInHours / 24
                                          );
                                          return `${diffInDays}d ago`;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => onNavigate("notifications")}
                          >
                            View all notifications
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          )}

          {/* User Profile */}
          <NavItem
            view="user-profile"
            icon={
              <img
                src="https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTg3NDAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Jane Doe"
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
            }
            label="Jane Doe"
            onClick={() => onNavigate("user-profile")}
            onMouseEnter={() => {
              setShowWorkplaceFlyout(false);
              setShowSettingsFlyout(false);
            }}
          />
        </div>
      </div>

      {/* Workplace Flyout */}
      <WorkplaceFlyout />

      {/* Settings Flyout */}
      <SettingsFlyout />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Header - Spans from sidebar edge to page edge */}
        <header
          className={`bg-white border-b border-gray-200 ${
            meetingSpacesViewMode === "month" && selectedMonthViewRoom
              ? ""
              : "shadow-sm"
          } flex-shrink-0 max-[600px]:mr-0 relative z-10 ${
            currentSidebarType === "ai-assistant" ||
            currentSidebarType === "meeting-details" ||
            currentSidebarType === "create-meeting" ||
            currentSidebarType === "room-details"
              ? "mr-96"
              : hasSidebarContent
              ? "mr-96"
              : currentView === "map"
              ? ""
              : ""
          }`}
        >
          {/* Header content wrapper */}
          <div className="px-6 max-[600px]:px-3 py-4 max-[600px]:py-2 pt-[10px] pr-[24px] pb-[10px] pl-[24px] max-[600px]:pt-2 max-[600px]:pr-3 max-[600px]:pb-2 max-[600px]:pl-3">
            {/* First Row: Title + AI Button */}
            <div className="flex items-center justify-between mb-3">
              <h1
                className="text-gray-900 max-[599px]:text-[22px]"
                style={{ fontSize: "30px", fontWeight: 400 }}
              >
                {pageTitle}
              </h1>

              {/* Right side controls */}
              <div className="flex items-center space-x-4">
                {/* AI Assistant Split Button */}
                {showAiButton && (
                  <div className="flex items-center bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-[4px] transition-all">
                    {/* Main button - "I want to..." */}
                    <Button
                      onClick={handleOpenAiAssistant}
                      className="h-[36px] px-3 max-[599px]:px-0 max-[599px]:w-[36px] max-[599px]:justify-center bg-transparent hover:bg-transparent text-white rounded-l-[4px] rounded-r-none border-r border-white/20 max-[599px]:border-r-0 max-[599px]:rounded-r-[4px]"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      <FontAwesomeIcon
                        icon={faMagicWandSparkles}
                        className="h-4 w-4 max-[599px]:mr-0 mr-2"
                      />
                      <span className="max-[599px]:hidden">I want to...</span>
                    </Button>

                    {/* Dropdown button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-[36px] w-[36px] p-0 bg-transparent hover:bg-transparent text-white rounded-l-none rounded-r-[4px] max-[599px]:hidden">
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="h-3 w-3"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-72 max-[599px]:w-[calc(100vw-24px)] p-[2px] bg-gradient-to-r from-primary to-blue-600 border-0"
                      >
                        {/* White interior container with padding */}
                        <div className="bg-white p-[4px] rounded-[4px]">
                          {/* Preset Prompts */}
                          {getPageSpecificPrompts(currentView).map(
                            (prompt, index) => (
                              <DropdownMenuItem
                                key={index}
                                onClick={() =>
                                  handleAiPromptSelect(prompt.text)
                                }
                                className="cursor-pointer py-3 hover:bg-gray-50 rounded-[4px] mb-[4px] last:mb-0 border border-gray-300"
                                style={{ fontSize: "14px", fontWeight: 400 }}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <span className="flex-1">{prompt.text}</span>
                                  {prompt.isNew && (
                                    <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 h-4 leading-[16px] flex-shrink-0">
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                              </DropdownMenuItem>
                            )
                          )}

                          {/* Text Input - Last Item */}
                          <div
                            className="p-3 mt-[4px]"
                            onKeyDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-2">
                              <Input
                                value={aiDropdownInput}
                                onChange={(e) =>
                                  setAiDropdownInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAiDropdownInputSubmit();
                                  }
                                  e.stopPropagation();
                                }}
                                placeholder="Or, ask me anything..."
                                className="flex-1 border-gray-300 focus:border-primary focus:ring-primary"
                                style={{ fontSize: "14px", fontWeight: 400 }}
                              />
                              <Button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAiDropdownInputSubmit();
                                }}
                                className="h-9 w-9 p-0 bg-primary hover:bg-primary/90 text-white flex-shrink-0"
                              >
                                <FontAwesomeIcon
                                  icon={faMagicWandSparkles}
                                  className="h-4 w-4"
                                />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>

            {/* Second Row: Picker Controls */}
            {(currentView === "map" ||
              !hideLocationPicker ||
              !hideDatePicker ||
              currentView === "meeting-spaces") && (
              <div className="flex items-center space-x-3">
                {/* Map Page - Special Control Layout */}
                {currentView === "map" ? (
                  <div className="flex items-center space-x-2">
                    {/* Building Picker */}
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger
                        hideChevron
                        className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 w-auto max-w-[150px] max-[599px]:max-w-none max-[599px]:w-9 whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                          />
                          <span className="max-[599px]:hidden">
                            <SelectValue
                              placeholder="Select location"
                              className="text-[rgba(0,0,0,0.95)]"
                            />
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-[599px]:w-[calc(100vw-24px)]">
                        <SelectItem value="54 State St.">
                          54 State St.
                        </SelectItem>
                        <SelectItem value="100 Main St.">
                          100 Main St.
                        </SelectItem>
                        <SelectItem value="200 Broadway">
                          200 Broadway
                        </SelectItem>
                        <SelectItem value="500 Park Ave.">
                          500 Park Ave.
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Floor Picker */}
                    <Select value={selectedFloor} onValueChange={onFloorChange}>
                      <SelectTrigger
                        hideChevron
                        className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 w-auto max-w-[150px] max-[599px]:max-w-none max-[599px]:w-9 whitespace-nowrap pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                          <FontAwesomeIcon
                            icon={faLayerGroup}
                            className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                          />
                          <span
                            className="text-[rgba(0,0,0,0.95)] max-[599px]:hidden"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            Floor {selectedFloor}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-[599px]:w-[calc(100vw-24px)]">
                        <SelectItem value="1">Floor 1</SelectItem>
                        <SelectItem value="2">Floor 2</SelectItem>
                        <SelectItem value="3">Floor 3</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Date Picker */}
                    <Select
                      value={selectedDate}
                      onValueChange={setSelectedDate}
                    >
                      <SelectTrigger
                        hideChevron
                        className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 w-auto max-[599px]:w-9 whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                          />
                          <span
                            className="max-[599px]:hidden text-[rgba(0,0,0,0.95)]"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            {getDateDisplayWithoutYear(selectedDate)}
                          </span>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="h-[200px] overflow-y-auto max-[599px]:w-[calc(100vw-24px)]">
                        {dateOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Time Picker with Timezone */}
                    <div className="flex items-center space-x-2">
                      <Select
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                      >
                        <SelectTrigger
                          hideChevron
                          className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 w-auto max-w-[150px] max-[599px]:max-w-none max-[599px]:w-9 whitespace-nowrap pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 cursor-pointer"
                        >
                          <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                            />
                            <span
                              className="text-[rgba(0,0,0,0.95)] max-[599px]:hidden"
                              style={{ fontSize: "14px", fontWeight: 400 }}
                            >
                              {selectedTime}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="h-[200px] overflow-y-auto max-[599px]:w-[calc(100vw-24px)]">
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Show timezone here if end time is not shown */}
                      {!showEndTime && (
                        <span
                          className="text-sm text-gray-600"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          EST
                        </span>
                      )}

                      {/* End Time Section */}
                      {!showEndTime ? (
                        <button
                          onClick={() => setShowEndTime(true)}
                          className="h-9 px-3 bg-transparent hover:bg-gray-50 text-[rgba(0,0,0,0.95)] transition-colors cursor-pointer"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          + End time
                        </button>
                      ) : (
                        <>
                          {/* Dash separator */}
                          <span
                            className="text-[rgba(0,0,0,0.55)]"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            -
                          </span>

                          <Select
                            value={selectedEndTime}
                            onValueChange={setSelectedEndTime}
                          >
                            <SelectTrigger
                              hideChevron
                              className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 w-auto max-w-[150px] whitespace-nowrap pl-3 pr-3 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                                />
                                {selectedEndTime ? (
                                  <span
                                    className="text-[rgba(0,0,0,0.95)]"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {selectedEndTime}
                                  </span>
                                ) : (
                                  <span
                                    className="text-[rgba(0,0,0,0.55)]"
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    End time
                                  </span>
                                )}
                              </div>
                            </SelectTrigger>
                            <SelectContent className="h-[200px] overflow-y-auto">
                              {endTimeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Show timezone after end time when it's visible */}
                          <span
                            className="text-sm text-gray-600"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            EST
                          </span>

                          <button
                            onClick={() => {
                              setShowEndTime(false);
                              setSelectedEndTime("");
                            }}
                            className="h-9 px-3 bg-transparent hover:bg-gray-50 text-[rgba(0,0,0,0.55)] hover:text-[rgba(0,0,0,0.95)] transition-colors cursor-pointer"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            Clear
                          </button>
                        </>
                      )}
                    </div>

                    {/* Edit Floor Button - Only shown on Map page */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-9 px-3 flex items-center space-x-2 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] hover:bg-gray-50 cursor-pointer"
                        >
                          <span style={{ fontSize: "14px", fontWeight: 400 }}>
                            Edit floor
                          </span>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-72">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Assignments - Quick edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Assignments - Scenario planning
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          style={{ fontSize: "14px", fontWeight: 400 }}
                        >
                          Layout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <>
                    {/* Default Layout for Other Pages */}
                    {/* Location Selector */}
                    {!hideLocationPicker && (
                      <div className="flex items-center">
                        <Select
                          value={selectedLocation}
                          onValueChange={setSelectedLocation}
                        >
                          <SelectTrigger
                            hideChevron
                            className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 w-auto max-w-[150px] max-[599px]:max-w-none max-[599px]:w-9 whitespace-nowrap cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                              />
                              <span className="max-[599px]:hidden">
                                <SelectValue
                                  placeholder="Select location"
                                  className="text-[rgba(0,0,0,0.95)]"
                                />
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent className="max-[599px]:w-[calc(100vw-24px)]">
                            <SelectItem value="54 State St.">
                              54 State St.
                            </SelectItem>
                            <SelectItem value="100 Main St.">
                              100 Main St.
                            </SelectItem>
                            <SelectItem value="200 Broadway">
                              200 Broadway
                            </SelectItem>
                            <SelectItem value="500 Park Ave.">
                              500 Park Ave.
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Floor Picker - Only shown on Map page */}
                    {showFloorPicker && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Floor:</span>
                        <Select
                          value={selectedFloor}
                          onValueChange={onFloorChange}
                        >
                          <SelectTrigger
                            hideChevron
                            className="w-20 h-9 border-none shadow-none text-gray-900 hover:text-gray-900 font-medium cursor-pointer"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Date Picker */}
                    {!hideDatePicker && (
                      <div className="flex items-center">
                        <Select
                          value={selectedDate}
                          onValueChange={setSelectedDate}
                        >
                          <SelectTrigger
                            hideChevron
                            className="h-9 border border-[#868686] bg-white text-[rgba(0,0,0,0.95)] hover:text-[rgba(0,0,0,0.95)] flex items-center justify-between space-x-2 pl-3 pr-3 max-[599px]:pl-2 max-[599px]:pr-2 w-auto max-[599px]:w-9 whitespace-nowrap cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 max-[599px]:space-x-0">
                              <FontAwesomeIcon
                                icon={faCalendar}
                                className="w-4 h-4 text-[rgba(0,0,0,0.55)]"
                              />
                              <span
                                className="max-[599px]:hidden text-[rgba(0,0,0,0.95)]"
                                style={{ fontSize: "14px", fontWeight: 400 }}
                              >
                                {getDateDisplayWithoutYear(selectedDate)}
                              </span>
                            </div>
                          </SelectTrigger>
                          <SelectContent className="h-[200px] overflow-y-auto max-[599px]:w-[calc(100vw-24px)]">
                            {dateOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </>
                )}

                {/* Filters Button - only show on meeting-spaces page */}
                {currentView === "meeting-spaces" &&
                  (() => {
                    const hasActiveFilters =
                      activeFilters &&
                      (activeFilters.duration !== "any" ||
                        activeFilters.amenities.length > 0 ||
                        activeFilters.capacity !== "any" ||
                        activeFilters.types.length > 0);

                    const filterCount = hasActiveFilters
                      ? [
                          activeFilters.duration !== "any" ? 1 : 0,
                          activeFilters.amenities.length > 0 ? 1 : 0,
                          activeFilters.capacity !== "any" ? 1 : 0,
                          activeFilters.types.length > 0 ? 1 : 0,
                        ].reduce((a, b) => a + b, 0)
                      : 0;

                    const handleClearFilters = () => {
                      if (onFiltersChange) {
                        onFiltersChange({
                          duration: "any",
                          amenities: [],
                          capacity: "any",
                          types: [],
                          show: "all",
                          onlyShowAvailable: false,
                        });
                      }
                    };

                    return (
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative">
                                <Button
                                  variant="outline"
                                  onClick={() => handleOpenSidebar("filters")}
                                  className="h-9 w-9 p-0 flex items-center justify-center cursor-pointer"
                                >
                                  <FontAwesomeIcon
                                    icon={faFilter}
                                    className="w-4 h-4 text-gray-500"
                                  />
                                </Button>
                                {hasActiveFilters && (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                                    {filterCount}
                                  </span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Filters
                              {hasActiveFilters ? ` (${filterCount})` : ""}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {hasActiveFilters && (
                          <button
                            onClick={handleClearFilters}
                            className="h-9 px-3 text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
                            style={{ fontSize: "14px", fontWeight: 400 }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    );
                  })()}

                {/* Date Navigation Controls - only show on meeting-spaces page */}
                {currentView === "meeting-spaces" && (
                  <>
                    <div className="h-6 w-px bg-[#D6D6D6]" />

                    {/* Day/Week/Month Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-md p-0.5 h-9">
                      {/* Day Button */}
                      <button
                        onClick={() => onMeetingSpacesViewModeChange?.("day")}
                        className={`px-3 h-8 rounded transition-colors flex items-center cursor-pointer ${
                          meetingSpacesViewMode === "day"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        Day
                      </button>

                      {/* Week Button */}
                      <button
                        onClick={() => onMeetingSpacesViewModeChange?.("week")}
                        className={`px-3 h-8 rounded transition-colors flex items-center cursor-pointer ${
                          meetingSpacesViewMode === "week"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        Week
                      </button>

                      {/* Month Button - Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`px-3 h-8 rounded transition-colors flex items-center gap-1 cursor-pointer ${
                              meetingSpacesViewMode === "month"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                            style={{ fontSize: "13px", fontWeight: 500 }}
                          >
                            Month
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className="w-3 h-3"
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <div
                            className="px-2 py-1.5"
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "rgba(0,0,0,0.5)",
                            }}
                          >
                            Select a room to view
                          </div>
                          {allRooms && allRooms.length > 0 ? (
                            allRooms.map((room) => (
                              <DropdownMenuItem
                                key={room.id}
                                onClick={() => {
                                  onMeetingSpacesViewModeChange?.("month");
                                  onSelectedMonthViewRoomChange?.(room.id);
                                }}
                                className="cursor-pointer"
                                style={{ fontSize: "14px", fontWeight: 400 }}
                              >
                                <div className="flex flex-col">
                                  <div>{room.name}</div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "rgba(0,0,0,0.5)",
                                    }}
                                  >
                                    Floor {room.floor} • {room.capacity} people
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            ))
                          ) : (
                            <div
                              className="px-2 py-1.5 text-gray-500"
                              style={{ fontSize: "14px" }}
                            >
                              No rooms available
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Page Tabs - Renders below the header content if provided */}
          {pageTabs &&
            pageTabs.length > 0 &&
            onPageTabChange &&
            activePageTab && (
              <div className="px-6 px-[24px]">
                <GlobalTabs
                  tabs={pageTabs}
                  activeTab={activePageTab}
                  onTabChange={onPageTabChange}
                  showBorder={false}
                />
              </div>
            )}
        </header>

        {/* Page Content - Scrollable or Full Viewport */}
        {currentView === "map" ? (
          // Map page - special layout with sidebar as part of content
          <div
            className={`flex-1 flex min-w-0 ${
              fullViewport ? "overflow-hidden" : "overflow-y-auto"
            } max-[600px]:mr-0 ${
              currentSidebarType === "ai-assistant" ||
              currentSidebarType === "meeting-details" ||
              currentSidebarType === "create-meeting" ||
              currentSidebarType === "filters" ||
              currentSidebarType === "room-details" ||
              currentSidebarType === "service-ticket"
                ? "mr-96"
                : ""
            }`}
          >
            {/* Map Content Area */}
            <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
            {/* Map Floor Sidebar - Part of content layout */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
              <MapFloorSidebar selectedFloor={selectedFloor || "1"} />
            </div>
          </div>
        ) : currentView === "meeting-services" ? (
          // Meeting Services page - render dedicated component
          <div
            className={`flex-1 min-w-0 ${
              fullViewport ? "overflow-hidden" : "overflow-y-auto"
            } max-[600px]:mr-0 ${
              currentSidebarType === "service-ticket" ? "mr-96" : ""
            }`}
          >
            <MeetingServicesPage
              serviceTickets={serviceTickets || []}
              onTicketClick={onOpenServiceTicket || (() => {})}
            />
          </div>
        ) : (
          // Other pages - standard layout
          <div
            className={`flex-1 min-w-0 ${
              fullViewport ? "overflow-hidden" : "overflow-y-auto"
            } max-[600px]:mr-0 ${
              currentSidebarType === "ai-assistant" ||
              currentSidebarType === "meeting-details" ||
              currentSidebarType === "create-meeting" ||
              currentSidebarType === "filters" ||
              currentSidebarType === "room-details" ||
              currentSidebarType === "service-ticket"
                ? "mr-96"
                : hasSidebarContent
                ? "mr-96"
                : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>

      {/* Sidebar - Fixed Panel on Right */}
      {(hasSidebarContent ||
        currentSidebarType === "ai-assistant" ||
        currentSidebarType === "meeting-details" ||
        currentSidebarType === "create-meeting" ||
        currentSidebarType === "filters" ||
        currentSidebarType === "room-details" ||
        currentSidebarType === "service-ticket") && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
          {/* Render AI Assistant if active */}
          {currentSidebarType === "ai-assistant" && (
            <AiAssistantSidebar
              isOpen={true}
              onClose={handleBackFromAiAssistant}
              onFullClose={handleFullCloseAiAssistant}
              currentPage={currentView}
              existingMessages={aiAssistantMessages}
              onMessagesUpdate={onAiAssistantMessagesUpdate}
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              onLoadChatFromHistory={onLoadChatFromHistory}
              onStartNewChat={onStartNewChat}
              showBackButton={showBackButton}
              showCloseButton={showCloseButton}
              isEmbedded={true}
              rooms={allRooms}
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
              externalCateringTicketNumber={cateringTicketNumber}
              onCateringTicketNumberChange={onCateringTicketNumberChange}
            />
          )}

          {/* Render Meeting Details Sidebar if active */}
          {currentSidebarType === "meeting-details" && (
            <MeetingDetailsSidebar
              selectedMeeting={selectedMeetingDetails || null}
              onClose={handleSidebarClose}
              onBack={handleSidebarBack}
              showBackButton={showBackButton}
              showCloseButton={showCloseButton}
              onDeleteMeeting={onDeleteMeeting}
              onEditMeeting={onEditMeeting}
              allRooms={allRooms}
              onOpenRoomDetails={onOpenRoomDetails}
              demoTimeOverride={demoTimeOverride}
            />
          )}

          {/* Render Meeting Creation Sidebar if active */}
          {currentSidebarType === "create-meeting" &&
            meetingCreationContext &&
            allRooms && (
              <MeetingCreationSidebar
                meetingCreationContext={meetingCreationContext}
                allRooms={allRooms}
                onSave={onSaveNewMeeting || (() => {})}
                onCancel={onCancelMeetingCreation || (() => {})}
                onClose={handleSidebarClose}
                onBack={handleSidebarBack}
                showBackButton={showBackButton}
                showCloseButton={showCloseButton}
                onMeetingPreviewUpdate={onMeetingPreviewUpdate}
              />
            )}

          {/* Render Filters Sidebar if active */}
          {currentSidebarType === "filters" && (
            <FiltersSidebar
              onClose={handleSidebarClose}
              onBack={handleSidebarBack}
              showBackButton={showBackButton}
              showCloseButton={showCloseButton}
              activeFilters={activeFilters}
              onFiltersChange={onFiltersChange}
              spotlightMyEvents={spotlightMyEvents}
              onSpotlightMyEventsChange={onSpotlightMyEventsChange}
              compactView={compactView}
              onCompactViewChange={onCompactViewChange}
              selectedTimezones={selectedTimezones}
              onSelectedTimezonesChange={onSelectedTimezonesChange}
            />
          )}

          {/* Render Room Details Sidebar if active */}
          {currentSidebarType === "room-details" && selectedRoomDetails && (
            <RoomDetailsSidebar
              room={selectedRoomDetails}
              onClose={onCloseRoomDetails || handleSidebarClose}
              onCreateMeeting={onCreateMeeting || (() => {})}
              onOpenMeetingDetails={onOpenMeetingDetails || (() => {})}
              onBack={onBackFromRoomDetails}
              showBackButton={showRoomDetailsBackButton}
              isNavCollapsed={isNavCollapsed}
              onToggleRoomOffline={onToggleRoomOffline}
            />
          )}

          {/* Render Service Ticket Sidebar if active */}
          {currentSidebarType === "service-ticket" && selectedServiceTicket && (
            <ServiceTicketSidebar
              ticket={selectedServiceTicket}
              onClose={onCloseServiceTicket || handleSidebarClose}
              onBack={onBackFromServiceTicket}
              showBackButton={true}
            />
          )}

          {/* Render default sidebar content if not AI assistant, meeting details, create meeting, filters, room details, or service ticket */}
          {currentSidebarType !== "ai-assistant" &&
            currentSidebarType !== "meeting-details" &&
            currentSidebarType !== "create-meeting" &&
            currentSidebarType !== "filters" &&
            currentSidebarType !== "room-details" &&
            currentSidebarType !== "service-ticket" &&
            hasDefaultSidebar &&
            defaultSidebarContent}
          {currentSidebarType !== "ai-assistant" &&
            currentSidebarType !== "meeting-details" &&
            currentSidebarType !== "create-meeting" &&
            currentSidebarType !== "filters" &&
            currentSidebarType !== "room-details" &&
            currentSidebarType !== "service-ticket" &&
            !hasDefaultSidebar &&
            sidebarContent}
        </div>
      )}

      {/* Guide Center - appears on all pages */}
      <ResourceCenter />
    </div>
  );
}
