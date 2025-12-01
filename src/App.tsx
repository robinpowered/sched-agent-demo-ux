import React, { useState, useCallback, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { MeetingSpacesPage } from "./components/MeetingSpacesPage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import { CateringOrderDetails } from "./components/CateringOrderPreview";

// Import shared types
import {
  View,
  SidebarType,
  Message,
  ChatSession,
  Meeting,
  Room,
  MeetingRoomFilters,
  ServiceTicket,
} from "./types";

// Import shared constants
import { DEFAULT_TIME_WINDOW } from "./constants";

// Import shared utilities
import {
  getPageTitle,
  getFilteredRooms as filterRooms,
  getPreviousTimeWindow,
  getNextTimeWindow,
  formatTimeFloat,
} from "./utils";
import { useUiStore } from "./stores/useUiStore";
import { useMeetingStore } from "./stores/useMeetingStore";
import { useChatStore } from "./stores/useChatStore";
import { useServiceStore } from "./stores/useServiceStore";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // UI Store
  const {
    currentView,
    setCurrentView,
    sidebarType: sidebarState,
    setSidebarType: setSidebarState, // Alias to match existing usage
  } = useUiStore();

  // Sync URL with currentView state
  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    if (path !== currentView) {
      setCurrentView(path as View);
    }
  }, [location, setCurrentView, currentView]);

  // Clear page-specific state when navigating to prevent empty sidebars
  useEffect(() => {
    // Clear meeting and room details when leaving meeting-spaces page
    if (!location.pathname.includes("meeting-spaces")) {
      setSelectedMeetingDetails(null);
      setSelectedRoomDetails(null);
    }
  }, [location.pathname]);

  // Chat Store
  const {
    messages: aiAssistantMessages,
    addMessage,
    setMessages: setAiAssistantMessages,
    chatHistory,
    setChatHistory,
    currentChatId,
    setCurrentChatId,
    createNewChat,
  } = useChatStore();

  // Ensure chatHistory is always an array
  const normalizedChatHistory = Array.isArray(chatHistory) ? chatHistory : [];

  // Service Store
  const {
    serviceTickets,
    setServiceTickets,
    selectedServiceTicket,
    setSelectedServiceTicket,
  } = useServiceStore();

  // Meeting Store
  const {
    rooms,
    allRooms,
    setRooms,
    filters: activeFilters,
    updateFilters: setActiveFilters, // App.tsx uses setActiveFilters({...}). Store uses updateFilters(partial). Compatible.
    timeWindowStart,
    setTimeWindowStart,
    meetingSpacesViewMode,
    setMeetingSpacesViewMode,
    selectedMonthViewRoom,
    setSelectedMonthViewRoom,
    pinnedRoomIds,
    togglePinnedRoom,
    selectedTimezones,
    setSelectedTimezones,
    compactView,
    setCompactView,
    spotlightMyEvents,
    setSpotlightMyEvents,
    demoTimeOverride,
    setDemoTimeOverride,
    offlineRoomResolution,
    setOfflineRoomResolution,
    checkOfflineMeetings,
    autoCheckIn,
  } = useMeetingStore();

  // Catering order state
  const [cateringOrderDetails, setCateringOrderDetails] =
    useState<CateringOrderDetails>({
      items: [],
      totalCost: 0,
    });
  const [isWaitingForMeetingSelection, setIsWaitingForMeetingSelection] =
    useState(false);
  const [cateringOrderSubmitted, setCateringOrderSubmitted] = useState(false);
  const [cateringTicketNumber, setCateringTicketNumber] = useState<
    string | null
  >(null);

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
      meetings: Meeting[]; // Added to match Room interface
    };
  } | null>(null);

  // Meeting creation state
  const [meetingCreationContext, setMeetingCreationContext] = useState<{
    startTime?: number;
    roomId?: string;
    title?: string;
    duration?: number;
    attendees?: number;
    fromAiSuggestion?: boolean;
  } | null>(null);

  // Room details state - for room details sidebar
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<{
    room: Room;
    date: Date;
  } | null>(null);

  // Room details navigation context
  const [roomDetailsNavigationContext, setRoomDetailsNavigationContext] =
    useState<{
      previousSidebar: SidebarType;
    } | null>(null);

  // Navigation warning state
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<View | null>(null);
  const [hasPendingMove, setHasPendingMove] = useState(false);

  // AI Meeting Preview State
  const [aiMeetingPreview, setAiMeetingPreview] = useState<{
    summary: string;
    date: string;
    time: string;
    duration: string;
    attendees: string[];
    title: string;
  } | null>(null);

  // Track which chat the preview belongs to
  const [previewChatId, setPreviewChatId] = useState<string | null>(null);

  // Room highlighting state for AI assistant
  const [highlightedRoomId, setHighlightedRoomId] = useState<string | null>(
    null
  );

  // Meeting syncing state
  const [syncingMeetings, setSyncingMeetings] = useState<string[]>([]);

  // Timestamp state for forcing re-renders when time changes (for filter updates)
  const [currentTimeStamp, setCurrentTimeStamp] = React.useState(Date.now());

  // --- Handlers ---
  // Note: performNavigation and handleNavigate definitions moved below (lines 983 and 956)
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: "welcome-1",
      type: "info",
      title: "Welcome to Robin!",
      description: "Your workplace management dashboard is ready to use",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true,
      action: null,
    },
    {
      id: "system-1",
      type: "success",
      title: "System Update Complete",
      description: "All room displays have been updated successfully",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true,
      action: null,
    },
  ]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Function to open meeting details (cooperative with other sidebars)
  const handleOpenMeetingDetails = (meetingDetails: any) => {
    setSelectedMeetingDetails(meetingDetails);
    setSidebarState("meeting-details");
  };

  // Function to close meeting details sidebar
  const handleCloseMeetingDetails = () => {
    setRoomDetailsNavigationContext(null);
    setSidebarState("none");
  };

  // Function to clear meeting details state (separate from closing)
  const handleClearMeetingDetails = () => {
    setSelectedMeetingDetails(null);
    setRoomDetailsNavigationContext(null);
  };

  // Function to delete a meeting from the rooms data
  const handleDeleteMeeting = (meetingId: string) => {
    // Find the meeting before deleting to show in toast
    let deletedMeeting: Meeting | null = null;
    for (const room of allRooms) {
      const meeting = room.meetings.find((m) => m.id === meetingId);
      if (meeting) {
        deletedMeeting = meeting;
        break;
      }
    }

    const newRooms = allRooms.map((room) => ({
      ...room,
      meetings: room.meetings.filter((meeting) => meeting.id !== meetingId),
    }));
    setRooms(newRooms);

    // Show success toast
    const meetingTitle = deletedMeeting?.title || "Meeting";
    toast.success(`"${meetingTitle}" has been deleted successfully.`, {
      duration: 3000,
    });
  };

  // Function to edit a meeting and potentially move it to different rooms
  const handleEditMeeting = (
    updatedMeeting: Meeting,
    selectedRooms: string[]
  ) => {
    // First, remove the meeting from all rooms
    const roomsWithoutMeeting = allRooms.map((room) => ({
      ...room,
      meetings: room.meetings.filter(
        (meeting) => meeting.id !== updatedMeeting.id
      ),
    }));

    // Check if any of the new rooms require approval
    const anyRoomRequiresApproval = roomsWithoutMeeting
      .filter((room) => selectedRooms.includes(room.id))
      .some((room) => room.requestOnly);

    // If moving to a non-request-only room, convert pending approval to regular meeting
    const finalMeeting = {
      ...updatedMeeting,
      pendingApproval: anyRoomRequiresApproval
        ? updatedMeeting.pendingApproval
        : undefined,
    };

    // Then, add the updated meeting to the selected rooms
    const newRooms = roomsWithoutMeeting.map((room) => {
      if (selectedRooms.includes(room.id)) {
        return {
          ...room,
          meetings: [...room.meetings, finalMeeting],
        };
      }
      return room;
    });
    setRooms(newRooms);

    // Clear meeting details since we've updated the meeting
    setSelectedMeetingDetails(null);
  };

  // Function to handle creating a new meeting
  const handleCreateMeeting = (roomId: string, startTime: number) => {
    setMeetingCreationContext({ roomId, startTime });
    setSidebarState("create-meeting");
  };

  // Function to handle "Add Details" from AI room suggestions
  const handleAddDetailsFromAi = (roomId: string, requirements: any) => {
    setMeetingCreationContext({
      roomId,
      startTime: requirements.startTime,
      title: requirements.title,
      duration: requirements.duration,
      attendees: requirements.attendees,
      fromAiSuggestion: true,
    });
    setSidebarState("create-meeting");
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
      ...(meetingCreationContext?.fromAiSuggestion && { aiCreated: true }),
    };

    // Add the meeting to the selected rooms
    const newRooms = allRooms.map((room) => {
      if (selectedRooms.includes(room.id)) {
        return {
          ...room,
          meetings: [...room.meetings, meetingWithId],
        };
      }
      return room;
    });
    setRooms(newRooms);

    // Clear AI preview and highlighted room if this was from AI suggestion
    if (meetingCreationContext?.fromAiSuggestion) {
      setAiMeetingPreview(null);
      setHighlightedRoomId(null);
      setPreviewChatId(null);
    }

    // Show success toast for all new meetings
    const roomName =
      allRooms.find((r) => selectedRooms.includes(r.id))?.name || "room";
    toast.success(
      `Meeting "${meetingWithId.title}" booked successfully in ${roomName}!`,
      {
        duration: 3000,
      }
    );

    // Clear the creation context
    setMeetingCreationContext(null);

    // Open meeting details sidebar for the newly created meeting
    // Use the first selected room for the meeting details
    const primaryRoom = allRooms.find((r) => selectedRooms.includes(r.id));
    if (primaryRoom) {
      setSelectedMeetingDetails({
        meeting: {
          id: meetingWithId.id,
          title: meetingWithId.title,
          organizer: meetingWithId.organizer,
          startTime: meetingWithId.startTime,
          duration: meetingWithId.duration,
          attendees: meetingWithId.attendees,
        },
        room: primaryRoom,
      });
      // Set sidebar state to meeting-details (replaces create-meeting, no stack push)
      setSidebarState("meeting-details");
    } else {
      // Fallback: close sidebar if room not found
      setSidebarState("none");
    }
  };

  // Function to cancel meeting creation
  const handleCancelMeetingCreation = () => {
    setMeetingCreationContext(null);
    setSidebarState("none");
  };

  // Function to open room details sidebar
  const handleOpenRoomDetails = (room: Room) => {
    // Only track navigation context if we're currently in meeting details
    if (sidebarState === "meeting-details" && selectedMeetingDetails) {
      setRoomDetailsNavigationContext({
        previousSidebar: "meeting-details",
        previousMeetingDetails: selectedMeetingDetails,
      });
    } else {
      // Clear any existing navigation context
      setRoomDetailsNavigationContext(null);
    }

    setSelectedRoomDetails(room);
    setSidebarState("room-details");
  };

  // Function to close room details sidebar
  const handleCloseRoomDetails = () => {
    setRoomDetailsNavigationContext(null);
    setSidebarState("none");
  };

  // Function to go back from room details to meeting details
  const handleBackFromRoomDetails = () => {
    if (
      roomDetailsNavigationContext?.previousSidebar === "meeting-details" &&
      roomDetailsNavigationContext.previousMeetingDetails
    ) {
      // Restore the previous meeting details
      setSelectedMeetingDetails(
        roomDetailsNavigationContext.previousMeetingDetails
      );
      setSidebarState("meeting-details");
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

  // Function to toggle room offline status
  const handleToggleRoomOffline = (roomId: string, isOffline: boolean) => {
    const newRooms = allRooms.map((room) => {
      if (room.id === roomId) {
        return {
          ...room,
          status: isOffline ? "offline" : "available",
        };
      }
      return room;
    });
    setRooms(newRooms);

    // Update selected room details if this room is currently selected
    if (selectedRoomDetails?.id === roomId) {
      setSelectedRoomDetails((prev) =>
        prev
          ? {
              ...prev,
              status: isOffline ? "offline" : "available",
            }
          : null
      );
    }

    // Show toast notification
    const room = allRooms.find((r) => r.id === roomId);
    const roomName = room?.name || "Room";
    if (isOffline) {
      toast.info(`${roomName} is now offline`, { duration: 3000 });
    } else {
      toast.success(`${roomName} is back online`, { duration: 3000 });
    }
  };

  // Room highlighting for AI assistant
  const handleHighlightRoom = (roomId: string | null) => {
    setHighlightedRoomId(roomId);
  };

  // Meeting preview update for AI assistant suggestions
  const handleAiMeetingPreviewUpdate = useCallback(
    (
      preview: {
        roomId: string;
        startTime: number;
        duration: number;
        title: string;
      } | null
    ) => {
      setAiMeetingPreview(preview);

      // Track which chat this preview belongs to
      if (preview && currentChatId) {
        setPreviewChatId(currentChatId);
      } else if (!preview) {
        setPreviewChatId(null);
      }
    },
    [currentChatId]
  );

  // Room selection from AI assistant - books meeting and creates confirmation messages
  const handleSelectRoom = (roomId: string, requirements: any) => {
    if (requirements?.startTime && roomId) {
      // Get room name and details
      const room = allRooms.find((r) => r.id === roomId);
      const roomName = room?.name || "Unknown Room";
      const floor = room?.floor || 1;

      // Format time for display
      const formatTime = (timeSlot: number) => {
        const hour = Math.floor(timeSlot);
        const minutes = (timeSlot % 1) * 60;
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinutes =
          minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;
        return `${displayHour}${displayMinutes} ${period}`;
      };

      const startTimeStr = formatTime(requirements.startTime);
      const duration = requirements.duration || 1;
      const attendees = requirements.attendees || 1;
      const features = requirements.features || [];
      const title = requirements.title || "New Meeting";

      // Generate unique IDs with timestamps
      const timestamp = Date.now();

      // Create user message requesting the booking
      const userMessage: Message = {
        id: `user-${timestamp}`,
        content: `Book ${roomName} at ${startTimeStr} for ${duration}h with ${attendees} attendee${
          attendees > 1 ? "s" : ""
        }${features.length > 0 ? ` (${features.join(", ")})` : ""}`,
        sender: "user",
      };

      // Create AI confirmation message (with incremented timestamp to ensure uniqueness)
      const aiMessageContent = `Perfect! I've booked ${roomName} (Floor ${floor}) for "${title}" at ${startTimeStr} for ${duration} hour${
        duration > 1 ? "s" : ""
      }. The room is confirmed and ready for your ${attendees} attendee${
        attendees > 1 ? "s" : ""
      }.`;

      const aiMessage: Message = {
        id: `ai-${timestamp + 1}`,
        content: aiMessageContent,
        sender: "assistant",
        isTyping: true,
      };

      // Calculate typing animation duration: 2000ms (bouncing dots) + (content.length * 20ms) + 100ms (cleanup)
      const typingDuration = 2000 + aiMessageContent.length * 20 + 100;

      // Update messages: hide room suggestions, add only AI confirmation (with typing animation)
      setAiAssistantMessages((prevMessages) => {
        // Hide room suggestions in existing messages
        const messagesWithoutSuggestions = prevMessages.map((msg) =>
          msg.showRoomSuggestions ? { ...msg, showRoomSuggestions: false } : msg
        );

        // Add only AI message first (user message will be added after typing completes)
        return [...messagesWithoutSuggestions, aiMessage];
      });

      // Add user message after AI typing animation completes
      setTimeout(() => {
        setAiAssistantMessages((prevMessages) => {
          // Find the AI message index and insert user message before it
          const aiMessageIndex = prevMessages.findIndex(
            (msg) => msg.id === aiMessage.id
          );
          if (aiMessageIndex === -1) {
            // AI message not found, just add user message at the end
            return [...prevMessages, userMessage];
          }

          // Mark AI message as no longer typing
          const updatedMessages = prevMessages.map((msg) => {
            if (msg.id === aiMessage.id) {
              return { ...msg, isTyping: false };
            }
            return msg;
          });

          // Insert user message right before the AI message
          return [
            ...updatedMessages.slice(0, aiMessageIndex),
            userMessage,
            ...updatedMessages.slice(aiMessageIndex),
          ];
        });
      }, typingDuration);

      // Generate meeting ID and create meeting object
      const meetingId = Date.now().toString();
      const newMeeting = {
        id: meetingId,
        title: title,
        organizer: "You",
        startTime: requirements.startTime,
        duration: duration,
        attendees: attendees,
        description: `Meeting scheduled via AI assistant in ${roomName}`,
        date: new Date().toISOString().split("T")[0],
        attendeeList: [],
        rooms: [roomId],
        aiCreated: true,
      };

      // Clear AI preview immediately
      setAiMeetingPreview(null);
      setPreviewChatId(null);
      if (handleHighlightRoom) {
        handleHighlightRoom(null);
      }

      // Add the meeting to the selected room
      const newRooms = allRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            meetings: [...room.meetings, newMeeting],
          };
        }
        return room;
      });
      setRooms(newRooms);

      // Start syncing state for this meeting
      setSyncingMeetings((prev) => new Set(prev).add(meetingId));

      // Clear syncing state after 4 seconds and show success toast
      setTimeout(() => {
        setSyncingMeetings((prev) => {
          const newSet = new Set(prev);
          newSet.delete(meetingId);
          return newSet;
        });

        // Show success toast after loading animation completes
        toast.success(
          `Meeting "${newMeeting.title}" booked successfully in ${roomName}!`,
          {
            duration: 3000,
          }
        );
      }, 4000);
    }
  };

  // Handle meeting selection for catering
  const handleMeetingSelectedForCatering = (meeting: Meeting, room: Room) => {
    // Only process if we're actually waiting for catering meeting selection
    const hasEzCaterAgent = aiAssistantMessages.some(
      (msg) => msg.agentType === "ezcater"
    );
    if (!hasEzCaterAgent) return;

    const startTimeStr = formatTimeFloat(meeting.startTime);

    // Remove the meeting list widget but keep the message
    const updatedMessages = aiAssistantMessages.map((msg) => {
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
      sender: "user",
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
      totalCost: 0,
    });

    // Add user message to conversation (with widget removed)
    setAiAssistantMessages([...updatedMessages, userMessage]);

    // Generate AI response
    setTimeout(() => {
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Perfect! I've noted that you want catering for "${meeting.title}" at ${startTimeStr} in ${room.name} for ${meeting.attendees} attendees. What would you like to order? I can help you browse menus from local restaurants and caterers.`,
        timestamp: new Date().toISOString(),
      };

      addMessage(assistantMessage);

      // Show cuisine options AFTER typing animation completes
      // Message: ~220 chars (varies with meeting details)
      // Animation time: 2000ms bouncing + 220 chars * 20ms + 100ms cleanup = 6500ms
      // Add 500ms buffer to ensure typing is completely finished before card appears
      setTimeout(() => {
        setAiAssistantMessages((prevMessages) =>
          prevMessages.map((m) =>
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

  // Handler to navigate to previous offline meeting
  const handlePreviousOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    const prevIndex = offlineRoomResolution.currentIndex - 1;
    // Wrap around to end if at the start
    const newIndex =
      prevIndex < 0
        ? offlineRoomResolution.affectedMeetings.length - 1
        : prevIndex;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      currentIndex: newIndex,
      selectedAlternativeRoomId: null, // Reset selection for new meeting
    });
  };

  // Handler to select alternative room for current offline meeting
  const handleSelectOfflineAlternativeRoom = (roomId: string) => {
    if (!offlineRoomResolution) return;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      selectedAlternativeRoomId: roomId,
    });
  };

  // Handler to move current offline meeting to selected alternative room
  const handleMoveOfflineMeeting = () => {
    if (
      !offlineRoomResolution ||
      !offlineRoomResolution.selectedAlternativeRoomId
    )
      return;

    const currentMeetingData =
      offlineRoomResolution.affectedMeetings[
        offlineRoomResolution.currentIndex
      ];
    const targetRoomId = offlineRoomResolution.selectedAlternativeRoomId;

    // Move the meeting
    handleEditMeeting(currentMeetingData.meeting, [targetRoomId]);

    // Remove this meeting from affected meetings list
    const updatedAffectedMeetings =
      offlineRoomResolution.affectedMeetings.filter(
        (_, index) => index !== offlineRoomResolution.currentIndex
      );

    if (updatedAffectedMeetings.length === 0) {
      // No more meetings to resolve
      setOfflineRoomResolution(null);
      toast.success("All offline room meetings have been relocated!", {
        duration: 3000,
      });
    } else {
      // Move to next meeting (or stay at same index if we were on the last one)
      const newIndex =
        offlineRoomResolution.currentIndex >= updatedAffectedMeetings.length
          ? updatedAffectedMeetings.length - 1
          : offlineRoomResolution.currentIndex;

      setOfflineRoomResolution({
        affectedMeetings: updatedAffectedMeetings,
        currentIndex: newIndex,
        selectedAlternativeRoomId: null,
      });

      const room = allRooms.find((r) => r.id === targetRoomId);
      toast.success(`Meeting moved to ${room?.name || "new room"}!`, {
        duration: 3000,
      });
    }
  };

  // Handler to navigate to next offline meeting
  const handleNextOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    const nextIndex = offlineRoomResolution.currentIndex + 1;
    // Wrap around to start if at the end
    const newIndex =
      nextIndex >= offlineRoomResolution.affectedMeetings.length
        ? 0
        : nextIndex;

    setOfflineRoomResolution({
      ...offlineRoomResolution,
      currentIndex: newIndex,
      selectedAlternativeRoomId: null,
    });
  };

  // Handler to skip current offline meeting
  const handleSkipOfflineMeeting = () => {
    if (!offlineRoomResolution) return;

    // Remove this meeting from affected meetings list
    const updatedAffectedMeetings =
      offlineRoomResolution.affectedMeetings.filter(
        (_, index) => index !== offlineRoomResolution.currentIndex
      );

    if (updatedAffectedMeetings.length === 0) {
      // No more meetings to resolve
      setOfflineRoomResolution(null);
    } else {
      // Move to next meeting (or stay at same index if we were on the last one)
      const newIndex =
        offlineRoomResolution.currentIndex >= updatedAffectedMeetings.length
          ? updatedAffectedMeetings.length - 1
          : offlineRoomResolution.currentIndex;

      setOfflineRoomResolution({
        affectedMeetings: updatedAffectedMeetings,
        currentIndex: newIndex,
        selectedAlternativeRoomId: null,
      });
    }
  };

  // Rooms data - Moved to useMeetingStore
  // const [rooms, setRooms] = useState<Room[]>([...]);

  // Spotlight my events state - Moved to useMeetingStore
  // const [spotlightMyEvents, setSpotlightMyEvents] = useState(false);

  // Compact view state - Moved to useMeetingStore
  // const [compactView, setCompactView] = useState(true);

  // Timezone state - Moved to useMeetingStore
  // const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['America/New_York']);

  // Pinned rooms state - Moved to useMeetingStore
  // const [pinnedRoomIds, setPinnedRoomIds] = useState<string[]>([]);

  // Filter state - Moved to useMeetingStore
  // const [activeFilters, setActiveFilters] = useState<MeetingRoomFilters>({...});

  // Floor selection state - Moved to useUiStore
  // const [selectedFloor, setSelectedFloor] = useState<string>('1');

  // Tab state - Moved to useUiStore
  // const [myScheduleTab, setMyScheduleTab] = useState<string>('workweek');
  // const [peopleTab, setPeopleTab] = useState<string>('organization');

  // Time window state - Moved to useMeetingStore
  // const [timeWindowStart, setTimeWindowStart] = useState<number>(DEFAULT_TIME_WINDOW);

  // Meeting spaces view mode state - Moved to useMeetingStore
  // const [meetingSpacesViewMode, setMeetingSpacesViewMode] = useState<'day' | 'week' | 'month'>('day');
  // const [selectedMonthViewRoom, setSelectedMonthViewRoom] = useState<string | null>(null);

  // Handlers for time navigation - cycles through three windows
  const handleTimeWindowPrevious = () => {
    setTimeWindowStart((prev) => getPreviousTimeWindow(prev));
  };

  const handleTimeWindowNext = () => {
    setTimeWindowStart((prev) => getNextTimeWindow(prev));
  };

  const handleTimeWindowNow = () => {
    setTimeWindowStart(DEFAULT_TIME_WINDOW);
  };

  // Use shared filter function (imported as filterRooms to avoid naming conflict)
  const getFilteredRoomsLocal = (
    rooms: Room[],
    filters: MeetingRoomFilters
  ): Room[] => {
    return filterRooms(rooms, filters, demoTimeOverride);
  };

  // Demo mode: Override current time for demonstration purposes
  // const [demoTimeOverride, setDemoTimeOverride] = React.useState<number | null>(null); // Moved to useMeetingStore

  // Offline room meeting resolution state - Moved to useMeetingStore
  // const [offlineRoomResolution, setOfflineRoomResolution] = useState<...> (null);

  // Auto check-in meetings when current time passes their start time
  React.useEffect(() => {
    const now = new Date();

    // Update timestamp to force re-render for filters
    setCurrentTimeStamp(Date.now());

    // Check in meetings based on current time (real or demo)
    // Use store action
    autoCheckIn();

    // Set up interval only when NOT in demo mode
    if (demoTimeOverride === null) {
      const checkInInterval = setInterval(() => {
        // Update timestamp to force re-render for filters
        setCurrentTimeStamp(Date.now());

        // Use store action
        autoCheckIn();
      }, 60000); // Check every minute

      return () => clearInterval(checkInInterval);
    }
  }, [demoTimeOverride, autoCheckIn]);

  // Detect meetings in offline rooms and set up resolution workflow
  React.useEffect(() => {
    // Use store action to check
    checkOfflineMeetings();
  }, [rooms, demoTimeOverride, checkOfflineMeetings]);

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Check if any notifications are still unread
    const stillHasUnread = notifications.some(
      (n) => n.id !== notification.id && !n.read
    );
    setHasUnreadNotifications(stillHasUnread);

    // Handle navigation based on notification action
    if (notification.action === "view-tickets") {
      setCurrentView("tickets");
    } else if (notification.action === "view-meeting-spaces") {
      setCurrentView("meeting-spaces");
    }
  };

  const handleNotificationPopoverClose = () => {
    // Mark all unread notifications as read when popover closes
    const hasUnread = notifications.some((n) => !n.read);
    if (hasUnread) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setHasUnreadNotifications(false);
    }
  };

  // Chat history management functions
  const generateChatTitle = (messages: Message[]): string => {
    const userMessages = messages.filter((m) => m.sender === "user");
    if (userMessages.length === 0) return "New Chat";

    const firstMessage = userMessages[0].content;
    // Take first 50 characters and add ellipsis if longer
    return firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;
  };

  const saveCurrentChatToHistory = () => {
    if (aiAssistantMessages.length === 0) return;

    const chatIdToSave = currentChatId || Date.now().toString();

    setChatHistory((prev) => {
      // Ensure prev is always an array
      const prevArray = Array.isArray(prev) ? prev : [];

      // Find existing chat to preserve createdAt
      const existingChat = prevArray.find((c) => c.id === chatIdToSave);

      const chatSession: ChatSession = {
        id: chatIdToSave,
        title: generateChatTitle(aiAssistantMessages),
        messages: [...aiAssistantMessages],
        createdAt: existingChat?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingIndex = prevArray.findIndex((c) => c.id === chatSession.id);
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prevArray];
        updated[existingIndex] = chatSession;
        return updated;
      } else {
        // Add new chat to the beginning
        return [chatSession, ...prevArray];
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
      .find((msg) => msg.showRoomSuggestions && msg.meetingRequirements);

    if (lastMessageWithSuggestions?.meetingRequirements) {
      // Restore the preview for this chat
      setPreviewChatId(chatSession.id);
      // The preview will be set by the RoomBookingSuggestions component when it renders
    }
  };

  const startNewChat = () => {
    // Save current chat to history before clearing
    if (aiAssistantMessages.length > 0 && currentChatId) {
      saveCurrentChatToHistory();
    }
    // Clear messages and generate a new chat ID for the new chat session
    setAiAssistantMessages([]);
    setCurrentChatId(Date.now().toString());

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
    }

    // Don't auto-save current active chat to history
    // Chats are only saved to history when:
    // 1. User starts a new chat (via startNewChat)
    // 2. User loads a chat from history (which replaces the current chat)
  };

  // Handler for navigation
  const handleNavigate = (view: View) => {
    // If we have a pending move and we're navigating away, show warning
    if (hasPendingMove && view !== currentView) {
      setPendingNavigation(view);
      setShowNavigationWarning(true);
      return;
    }

    setCurrentView(view);

    // Close sidebar on navigation unless it's a persistent one like AI assistant
    if (sidebarState !== "ai-assistant") {
      setSidebarState("none");
    }
  };

  // Handler for sidebar state changes
  const handleSidebarStateChange = (type: SidebarType) => {
    setSidebarState(type);

    // If opening AI assistant, ensure we have a chat session
    if (type === "ai-assistant" && !currentChatId) {
      createNewChat();
    }
  };

  const performNavigation = (view: View) => {
    setCurrentView(view);

    // Manage sidebar state on navigation
    if (sidebarState !== "ai-assistant") {
      setSidebarState("none");
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
  const handleCreateServiceTicket = useCallback(
    (ticketData: Omit<ServiceTicket, "id" | "created" | "lastUpdated">) => {
      const ticketId = `SRV-${Date.now().toString().slice(-6)}`;
      const now = new Date().toISOString();
      const newTicket: ServiceTicket = {
        id: ticketId,
        ...ticketData,
        created: now,
        lastUpdated: now,
      };

      setServiceTickets((prev) => [newTicket, ...prev]);

      // Store the ticket number for the AI to reference (especially for catering orders)
      setCateringTicketNumber(ticketId);

      return newTicket;
    },
    []
  );

  const handleOpenServiceTicket = useCallback(
    (ticketId: string) => {
      const ticket = serviceTickets.find((t) => t.id === ticketId);
      if (ticket) {
        setSelectedServiceTicket(ticket);
        setSidebarState("service-ticket");
      }
    },
    [serviceTickets]
  );

  const handleCloseServiceTicket = useCallback(() => {
    setSidebarState("none");
    setSelectedServiceTicket(null);
  }, []);

  const handleBackFromServiceTicket = useCallback(() => {
    // Navigate back to AI assistant if it was open
    if (sidebarState === "ai-assistant") {
      setSidebarState("ai-assistant");
      setSelectedServiceTicket(null);
    } else {
      handleCloseServiceTicket();
    }
  }, [sidebarState, handleCloseServiceTicket]);

  const handleNavigateToTicket = useCallback((ticketId: string) => {
    // Navigate to meeting-services page and open ticket sidebar
    setCurrentView("meeting-services");

    // Use functional update to access the latest serviceTickets state
    setServiceTickets((currentTickets) => {
      const ticket = currentTickets.find((t) => t.id === ticketId);
      if (ticket) {
        setSelectedServiceTicket(ticket);
        setSidebarState("service-ticket");
      }
      return currentTickets; // Don't modify the tickets, just use this to access latest state
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/meeting-spaces"
          element={
            <MeetingSpacesPage
              notifications={notifications}
              hasUnreadNotifications={hasUnreadNotifications}
              onNotificationClick={handleNotificationClick}
              onNotificationPopoverClose={handleNotificationPopoverClose}
              aiAssistantMessages={aiAssistantMessages}
              onAiAssistantMessagesUpdate={handleAiAssistantMessagesUpdate}
              chatHistory={normalizedChatHistory}
              onLoadChatFromHistory={loadChatFromHistory}
              onStartNewChat={startNewChat}
              selectedMeetingDetails={selectedMeetingDetails}
              onCloseMeetingDetails={handleCloseMeetingDetails}
              onOpenMeetingDetails={handleOpenMeetingDetails}
              onClearMeetingDetails={handleClearMeetingDetails}
              rooms={getFilteredRoomsLocal(rooms, activeFilters)}
              allRooms={allRooms}
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
              showRoomDetailsBackButton={
                roomDetailsNavigationContext?.previousSidebar ===
                "meeting-details"
              }
              aiMeetingPreview={aiMeetingPreview}
              highlightedRoomId={highlightedRoomId}
              onHighlightRoom={handleHighlightRoom}
              onAiMeetingPreviewUpdate={handleAiMeetingPreviewUpdate}
              onSelectRoom={handleSelectRoom}
              onAddDetails={handleAddDetailsFromAi}
              syncingMeetings={syncingMeetings}
              onMeetingSelectedForCatering={handleMeetingSelectedForCatering}
              cateringOrderDetails={cateringOrderDetails as any}
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
              onTogglePin={togglePinnedRoom}
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
              onSelectOfflineAlternativeRoom={
                handleSelectOfflineAlternativeRoom
              }
              onMoveOfflineMeeting={handleMoveOfflineMeeting}
              onSkipOfflineMeeting={handleSkipOfflineMeeting}
            />
          }
        />
        <Route
          path="*"
          element={
            <PageLayout pageTitle={getPageTitle(currentView)}>
              <div className="p-6">
                <div className="text-center py-12">
                  <h2
                    className="text-gray-600 mb-2"
                    style={{ fontSize: "30px", fontWeight: 400 }}
                  >
                    {getPageTitle(currentView)}
                  </h2>
                  <p className="text-gray-500">
                    This page is under development.
                  </p>
                </div>
              </div>
            </PageLayout>
          }
        />
      </Routes>
      <Toaster position="top-center" />

      {/* Navigation Warning Dialog */}
      <AlertDialog
        open={showNavigationWarning}
        onOpenChange={setShowNavigationWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Meeting Move</AlertDialogTitle>
            <AlertDialogDescription>
              You have a meeting move in progress that hasn't been confirmed
              yet. If you navigate away now, your changes will be lost.
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
