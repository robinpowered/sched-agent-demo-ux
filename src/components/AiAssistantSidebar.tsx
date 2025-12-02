import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faMagicWandSparkles,
  faArrowLeft,
  faRotateRight,
  faBars,
  faChevronDown,
  faChevronRight,
  faSpinner,
  faListCheck,
  faCircleInfo,
  faBell,
  faExclamationCircle,
  faSliders,
  faChair,
  faTriangleExclamation,
  faLocationDot,
  faCalendarPlus,
  faEye,
  faCompass,
  faPencil,
  faCheck,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { RoomBookingSuggestions } from "./RoomBookingSuggestions";
import {
  CateringOrderPreview,
  CateringOrderDetails,
  CateringOrderItem,
} from "./CateringOrderPreview";
import { CateringOptionsCard, Restaurant } from "./CateringOptionsCard";
import { CateringMenuCard, MenuItem } from "./CateringMenuCard";
import { CuisineOptionsCard } from "./CuisineOptionsCard";
import { MeetingListWidget } from "./MeetingListWidget";
import Avatar from "../imports/Avatar";
import EzCaterAvatar from "../imports/EzCaterAvatar";
import svgPaths from "../imports/svg-2zju4fq6lg";
import { toast } from "sonner";

// Import shared types
import {
  Message,
  ChatSession,
  Meeting,
  Room,
  MeetingRequirements,
} from "../types";

// Import shared utilities
import { formatRelativeTime, generateChatTitle } from "../utils";

interface AiAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFullClose: () => void;
  currentPage: string;
  existingMessages?: Message[];
  onMessagesUpdate?: (messages: Message[]) => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  isEmbedded?: boolean;
  chatHistory?: ChatSession[];
  onLoadChatFromHistory?: (chatSession: ChatSession) => void;
  onStartNewChat?: () => void;
  rooms?: Room[];
  aiMeetingPreview?: {
    roomId: string;
    startTime: number;
    duration: number;
    title: string;
  } | null;
  onHighlightRoom?: (roomId: string | null) => void;
  onAiMeetingPreviewUpdate?: (
    preview: {
      roomId: string;
      startTime: number;
      duration: number;
      title: string;
    } | null
  ) => void;
  onSelectRoom?: (roomId: string, requirements: any) => void;
  onAddDetails?: (roomId: string, requirements: any) => void;
  onMeetingSelectedForCatering?: (meeting: Meeting, room: Room) => void;
  cateringOrderDetails?: CateringOrderDetails;
  onCateringOrderUpdate?: (details: CateringOrderDetails) => void;
  cateringOrderSubmitted?: boolean;
  onCateringOrderSubmittedChange?: (submitted: boolean) => void;
  onCreateServiceTicket?: (ticketData: any) => any;
  onNavigateToTicket?: (ticketId: string) => void;
  externalCateringTicketNumber?: string | null;
  onCateringTicketNumberChange?: (ticketNumber: string) => void;
}

// Room list display component for thinking step
function ThinkingRoomList({
  goodFitRooms,
  poorFitRooms,
}: {
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
}) {
  return (
    <div className="relative rounded-[8px] w-full mt-2">
      <div
        aria-hidden="true"
        className="absolute border border-[#d6d6d6] border-solid inset-0 pointer-events-none rounded-[8px]"
      />
      <div className="w-full">
        <div className="box-border flex flex-col gap-[12px] p-[8px] relative w-full">
          {/* Excellent fit section */}
          {goodFitRooms.length > 0 && (
            <div className="flex flex-col gap-[4px] w-full">
              {/* Header */}
              <div className="h-[20px] relative w-full">
                <div className="absolute left-0 size-[14px] top-[3px]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 14 14"
                  >
                    <g>
                      <path d={svgPaths.p22381bf0} fill="#72B433" />
                    </g>
                  </svg>
                </div>
                <div className="absolute flex flex-col font-['Brown_LL',_sans-serif] justify-center left-[18px] text-[#1c1c1c] text-[12px] top-[10px] translate-y-[-50%]">
                  <p className="leading-[20px] overflow-ellipsis overflow-hidden whitespace-pre font-medium">
                    Good fit
                  </p>
                </div>
              </div>

              {/* Room items */}
              {goodFitRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col font-['Brown_LL',_sans-serif] text-[10px] w-full"
                >
                  <div className="flex flex-col justify-center overflow-ellipsis overflow-hidden relative text-[#1c1c1c] text-nowrap w-full">
                    <p className="leading-[20px] overflow-ellipsis overflow-hidden font-medium">
                      {room.name}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center relative text-[#515151] w-full">
                    <p className="leading-[15px] font-normal">
                      With a capacity of {room.capacity}, it's a good fit for
                      the {room.attendees} invitee
                      {room.attendees > 1 ? "s" : ""}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Poor fit section */}
          {poorFitRooms.length > 0 && (
            <div className="flex flex-col gap-[4px] w-full">
              {/* Header */}
              <div className="h-[20px] relative w-full">
                <div className="absolute left-0 size-[14px] top-[3px]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 14 14"
                  >
                    <g>
                      <path d={svgPaths.p18b90800} fill="#E81C1C" />
                    </g>
                  </svg>
                </div>
                <div className="absolute flex flex-col font-['Brown_LL',_sans-serif] justify-center left-[18px] text-[#1c1c1c] text-[12px] top-[10px] translate-y-[-50%]">
                  <p className="leading-[20px] overflow-ellipsis overflow-hidden whitespace-pre font-medium">
                    Poor fit
                  </p>
                </div>
              </div>

              {/* Room items */}
              {poorFitRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col font-['Brown_LL',_sans-serif] text-[10px] w-full"
                >
                  <div className="flex flex-col justify-center overflow-ellipsis overflow-hidden relative text-[#1c1c1c] text-nowrap w-full">
                    <p className="leading-[20px] overflow-ellipsis overflow-hidden font-medium">
                      {room.name}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center relative text-[#515151] w-full">
                    <p className="leading-[15px] font-normal">{room.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AiAssistantSidebar({
  isOpen,
  onClose,
  onFullClose,
  currentPage,
  existingMessages = [],
  onMessagesUpdate,
  showBackButton = false,
  showCloseButton = true,
  isEmbedded = false,
  chatHistory = [],
  onLoadChatFromHistory,
  onStartNewChat,
  rooms = [],
  aiMeetingPreview,
  onHighlightRoom,
  onAiMeetingPreviewUpdate,
  onSelectRoom,
  onAddDetails,
  onMeetingSelectedForCatering,
  cateringOrderDetails: externalCateringOrderDetails,
  onCateringOrderUpdate,
  cateringOrderSubmitted: externalCateringOrderSubmitted,
  onCateringOrderSubmittedChange,
  onCreateServiceTicket,
  onNavigateToTicket,
  externalCateringTicketNumber,
  onCateringTicketNumberChange,
}: AiAssistantSidebarProps) {
  // Ensure existingMessages is always an array
  const normalizedExistingMessages = Array.isArray(existingMessages)
    ? existingMessages
    : [];

  // Ensure chatHistory is always an array
  const normalizedChatHistory = Array.isArray(chatHistory) ? chatHistory : [];

  const [messages, setMessages] = useState<Message[]>(
    normalizedExistingMessages
  );
  const [inputValue, setInputValue] = useState("");
  // Use a ref to track if chat has started - this persists across renders and prevents flashing
  const hasStartedChatRef = React.useRef(normalizedExistingMessages.length > 0);
  const [hasStartedChat, setHasStartedChat] = useState(
    normalizedExistingMessages.length > 0
  );
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [shouldAutoPopulateInput, setShouldAutoPopulateInput] = useState("");
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(
    new Set()
  );
  const [thinkingProgress, setThinkingProgress] = useState<
    Record<
      string,
      { visibleLines: number; totalLines: number; isComplete: boolean }
    >
  >({});
  const initializedThinkingMessages = React.useRef<Set<string>>(new Set());
  const initializedTypingMessages = React.useRef<Set<string>>(new Set());
  const completedTypingMessages = React.useRef<Set<string>>(new Set());
  const typingTimeouts = React.useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const autoPopulateScheduled = React.useRef<Set<string>>(new Set());
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const activeTimeouts = React.useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  const [pausedThinking, setPausedThinking] = useState<Set<string>>(new Set());

  // Turn-based scrolling state
  const [isCurrentTurnFullHeight, setIsCurrentTurnFullHeight] = useState(true);
  const scrollContainerBottomThreshold = React.useRef<number>(50); // px from bottom to consider "at bottom"

  // Catering order state - use external if provided, otherwise use local state
  const [localCateringOrderDetails, setLocalCateringOrderDetails] =
    useState<CateringOrderDetails>({
      items: [],
      totalCost: 0,
    });
  const cateringOrderDetails =
    externalCateringOrderDetails || localCateringOrderDetails;
  const updateCateringOrder =
    onCateringOrderUpdate || setLocalCateringOrderDetails;
  const [isCateringPreviewOpen, setIsCateringPreviewOpen] = useState(true);
  const [localCateringOrderSubmitted, setLocalCateringOrderSubmitted] =
    useState(false);
  const cateringOrderSubmitted =
    externalCateringOrderSubmitted !== undefined
      ? externalCateringOrderSubmitted
      : localCateringOrderSubmitted;
  const setCateringOrderSubmitted =
    onCateringOrderSubmittedChange || setLocalCateringOrderSubmitted;

  // Generate ticket number once and store it
  const [localCateringTicketNumber] = useState(() => {
    const randomDigits = Math.floor(100000 + Math.random() + 900000);
    return `CAT-${randomDigits}`;
  });

  // Use external ticket number if provided, otherwise use local
  const cateringTicketNumber =
    externalCateringTicketNumber || localCateringTicketNumber;

  // Update messages when existingMessages prop changes
  React.useEffect(() => {
    // Ensure existingMessages is always an array
    const messagesArray = Array.isArray(existingMessages)
      ? existingMessages
      : [];

    // Always update messages from prop (this is the source of truth)
    setMessages(messagesArray);
    
    // Update hasStartedChat: once started, it stays started (prevents welcome screen flashing)
    if (messagesArray.length > 0) {
      // If there are messages, ensure chat is marked as started
      hasStartedChatRef.current = true;
      if (!hasStartedChat) {
        setHasStartedChat(true);
      }
    }
    // Note: We don't reset hasStartedChatRef when messages are empty
    // It only resets in handleResetChat when explicitly clearing the chat
    // This prevents the welcome screen from flashing during message updates

    // Initialize thinking progress for any thinking messages that already exist
    // This ensures completed thinking states are preserved when reopening the sidebar
    const thinkingMessages = messagesArray.filter(
      (m) => m.isThinking && m.thinkingText
    );
    const newThinkingProgress: Record<
      string,
      { visibleLines: number; totalLines: number; isComplete: boolean }
    > = {};

    thinkingMessages.forEach((message) => {
      const lines = message
        .thinkingText!.split("\n")
        .filter((line) => line.trim());
      const totalLines = lines.length;

      // Only mark as complete if this message already has progress tracked and was previously complete
      // This prevents newly created thinking messages from being marked as complete immediately
      const existingProgress = thinkingProgress[message.id];
      if (existingProgress?.isComplete) {
        newThinkingProgress[message.id] = {
          visibleLines: totalLines,
          totalLines,
          isComplete: true,
        };

        // Mark as initialized so the animation effect doesn't try to run
        initializedThinkingMessages.current.add(message.id);
      }
    });

    if (Object.keys(newThinkingProgress).length > 0) {
      setThinkingProgress(newThinkingProgress);
    }

    // Mark completed typing messages as initialized AND complete so they don't re-animate
    // Messages that don't have isTyping: true are considered complete
    messagesArray.forEach((message) => {
      if (message.sender === "assistant" && !message.isTyping) {
        initializedTypingMessages.current.add(message.id);
        completedTypingMessages.current.add(message.id);
      }
    });
  }, [existingMessages]);

  // Auto-focus input when sidebar opens or when chat starts
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, hasStartedChat]);

  // Detect scroll position to toggle full-height on current turn
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      // If user is near the bottom, enable full height on current turn
      if (distanceFromBottom <= scrollContainerBottomThreshold.current) {
        setIsCurrentTurnFullHeight(true);
      } else {
        // User scrolled up, disable full height to allow normal scrolling
        setIsCurrentTurnFullHeight(false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom when full height is enabled on current turn
  React.useEffect(() => {
    if (isCurrentTurnFullHeight && scrollContainerRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 0);
    }
  }, [isCurrentTurnFullHeight, messages]);

  // Auto-populate input for "Help me book a room" flow when triggered from dropdown
  React.useEffect(() => {
    // Check if the last user message was "Help me book a room for my team"
    // and the last AI message is the prompt asking for details
    if (messages.length >= 2) {
      const lastTwoMessages = messages.slice(-2);
      const userMessage = lastTwoMessages[0];
      const aiMessage = lastTwoMessages[1];

      if (
        userMessage?.sender === "user" &&
        (userMessage.content
          .toLowerCase()
          .includes("book a room for my team") ||
          userMessage.content.toLowerCase().includes("book a room") ||
          userMessage.content.toLowerCase().includes("need to book")) &&
        aiMessage?.sender === "assistant" &&
        aiMessage.content.includes("The more you tell me about your meeting")
      ) {
        // Only auto-populate once per AI message
        if (autoPopulateScheduled.current.has(aiMessage.id)) {
          return;
        }

        // Only auto-populate if AI message is not currently typing
        // Check if typing is complete (no isTyping flag or typedContent is undefined)
        const isTypingComplete =
          !aiMessage.isTyping && aiMessage.typedContent === undefined;

        if (isTypingComplete) {
          // Mark as scheduled to prevent duplicate
          autoPopulateScheduled.current.add(aiMessage.id);

          // Auto-populate the input with example booking
          setInputValue(
            "I need to book a team check-in for 4 people at 2pm today with video-conferencing"
          );
          // Focus the input so user knows it's ready
          if (inputRef.current) {
            inputRef.current.focus();
          }
        } else if (aiMessage.isTyping) {
          // Mark as scheduled to prevent duplicate
          autoPopulateScheduled.current.add(aiMessage.id);

          // Calculate typing animation duration: 2000ms (bouncing dots) + (content.length * 20ms) + 100ms (cleanup)
          const typingDuration = 2000 + aiMessage.content.length * 20 + 100;

          // Auto-populate the input with example booking after typing animation completes
          setTimeout(() => {
            setInputValue(
              "I need to book a team check-in for 4 people at 2pm today with video-conferencing"
            );
            // Focus the input so user knows it's ready
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, typingDuration);
        }
      }
    }
  }, [messages]);

  // Handle progressive text revelation for thinking messages
  React.useEffect(() => {
    const thinkingMessages = messages.filter(
      (m) => m.isThinking && m.thinkingText && !m.isPaused
    );

    thinkingMessages.forEach((message) => {
      // Skip if already initialized
      if (initializedThinkingMessages.current.has(message.id)) {
        return;
      }

      // Mark as initialized IMMEDIATELY and SYNCHRONOUSLY before any setState
      initializedThinkingMessages.current.add(message.id);

      const lines = message
        .thinkingText!.split("\n")
        .filter((line) => line.trim());
      const totalLines = lines.length;

      // Initialize progress
      setThinkingProgress((prev) => ({
        ...prev,
        [message.id]: {
          visibleLines: 0,
          totalLines,
          isComplete: false,
        },
      }));

      // Start progressive revelation
      let currentLine = 0;
      const timeoutIds: NodeJS.Timeout[] = [];

      const revealNextLine = () => {
        if (currentLine < totalLines) {
          currentLine++;
          setThinkingProgress((prev) => ({
            ...prev,
            [message.id]: {
              ...prev[message.id],
              visibleLines: currentLine,
              isComplete: currentLine >= totalLines,
            },
          }));

          if (currentLine < totalLines) {
            const timeoutId = setTimeout(revealNextLine, 1000); // 1 second delay between lines
            timeoutIds.push(timeoutId);
            activeTimeouts.current.set(message.id, [...timeoutIds]);
          } else {
            // Animation complete, remove from active timeouts
            activeTimeouts.current.delete(message.id);
          }
        }
      };

      // Start the revelation process after a brief delay
      const initialTimeout = setTimeout(revealNextLine, 500);
      timeoutIds.push(initialTimeout);
      activeTimeouts.current.set(message.id, [...timeoutIds]);
    });
  }, [messages.length]); // Only re-run when messages are added/removed, not when they're updated

  // Handle typing animation and typewriter effect for agent messages
  React.useEffect(() => {
    messages.forEach((message) => {
      // Only process assistant messages that are typing AND haven't been initialized yet
      if (message.sender !== "assistant" || !message.isTyping) {
        return;
      }

      // Skip if already initialized
      if (initializedTypingMessages.current.has(message.id)) {
        return;
      }

      // Mark as initialized
      initializedTypingMessages.current.add(message.id);

      // Initialize timeout array for this message
      const messageTimeouts: NodeJS.Timeout[] = [];
      typingTimeouts.current.set(message.id, messageTimeouts);

      // Step 1: Show bouncing dots for 2 seconds
      const dotsTimeout = setTimeout(() => {
        // Step 2: After dots, start typewriter effect - use message ID instead of index
        setMessages((prev) =>
          prev.map((m) =>
            m.id === message.id
              ? { ...m, isTyping: false, typedContent: "" }
              : m
          )
        );

        // Typewriter effect - reveal one character at a time
        const fullContent = message.content;
        let charIndex = 0;

        const typeNextChar = () => {
          if (charIndex <= fullContent.length) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === message.id
                  ? { ...m, typedContent: fullContent.substring(0, charIndex) }
                  : m
              )
            );
            charIndex++;

            if (charIndex <= fullContent.length) {
              // Type next character after delay
              const typeTimeout = setTimeout(typeNextChar, 20);
              messageTimeouts.push(typeTimeout);
            } else {
              // Typing complete, remove typedContent property and cleanup
              const completeTimeout = setTimeout(() => {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === message.id ? { ...m, typedContent: undefined } : m
                  )
                );
                // Mark this message as permanently complete
                completedTypingMessages.current.add(message.id);
                // Clear this message's timeouts after animation completes
                typingTimeouts.current.delete(message.id);
              }, 100);
              messageTimeouts.push(completeTimeout);
            }
          }
        };

        typeNextChar();
      }, 2000); // 2 seconds for bouncing dots

      messageTimeouts.push(dotsTimeout);
    });

    // No cleanup - let animations run to completion
    // Cleanup happens explicitly in handleResetChat and handleSaveEditedMessage
  }, [messages]);

  const handleResetChat = () => {
    if (onStartNewChat) {
      onStartNewChat();
    } else {
      setMessages([]);
      hasStartedChatRef.current = false;
      setHasStartedChat(false);
      setInputValue("");
      onMessagesUpdate?.([]);
    }
    // Clear typing animation tracking and timeouts
    initializedTypingMessages.current.clear();
    completedTypingMessages.current.clear();
    typingTimeouts.current.forEach((timeouts) => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    });
    typingTimeouts.current.clear();
  };

  const handleShowChatHistory = () => {
    setShowChatHistory(true);
  };

  const handleBackToChat = () => {
    setShowChatHistory(false);
  };

  const handleLoadChat = (chatSession: ChatSession) => {
    if (onLoadChatFromHistory) {
      onLoadChatFromHistory(chatSession);
    }
    setShowChatHistory(false);
  };

  // Determine if we should show the history button
  // Show if: at least one chat in history AND user has started a second chat (either current has messages OR there are multiple in history)
  const shouldShowHistoryButton =
    normalizedChatHistory.length > 0 &&
    (hasStartedChat || normalizedChatHistory.length > 1);

  // Handler for confirming menu order
  const handleConfirmMenuOrder = (
    items: MenuItem[],
    restaurantName: string
  ) => {
    // Remove the message with menu card
    const updatedMessages = messages.filter((m) => !m.showCateringMenu);

    // Calculate total
    const totalCost = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Add user's confirmation as a message
    const itemsList = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");
    const confirmMessage: Message = {
      id: Date.now().toString(),
      content: `Add to order: ${itemsList}`,
      sender: "user",
    };

    const newMessages = [...updatedMessages, confirmMessage];
    setMessages(newMessages);
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    }

    // Update catering order details with items (restaurant already set in handleRestaurantSelect)
    updateCateringOrder({
      ...cateringOrderDetails,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalCost: totalCost,
    });

    // AI confirms the order
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Great! I've added those items to your catering order. Your total is $${totalCost.toFixed(
          2
        )} from ${restaurantName}. Is there anything else you'd like to add?`,
        sender: "assistant",
        isTyping: true,
        agentType: "ezcater",
      };
      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(finalMessages);
      }
    }, 800);
  };

  // Handler for cuisine selection from CuisineOptionsCard
  const handleCuisineSelect = (cuisineText: string) => {
    // Remove the cuisine options card but keep the agent's message
    const updatedMessages = messages.map((message) => {
      if (message.showCuisineOptions) {
        return {
          ...message,
          showCuisineOptions: false,
        };
      }
      return message;
    });

    // Add user's selection as a message
    const selectionMessage: Message = {
      id: Date.now().toString(),
      content: cuisineText,
      sender: "user",
    };

    const newMessages = [...updatedMessages, selectionMessage];
    setMessages(newMessages);
    setInputValue("");
    hasStartedChatRef.current = true;
    setHasStartedChat(true);

    // Trigger the catering items request flow
    // This will be handled by handleSendMessage logic
    const input = cuisineText.toLowerCase();
    const hasCoffee = /coffee/i.test(input);
    const hasPastries = /(pastries|pastry)/i.test(input);

    const isCateringItemsRequest =
      cateringOrderDetails.meeting && // Only if meeting already selected
      (hasCoffee || hasPastries);

    if (isCateringItemsRequest) {
      // Extract catering items from the request
      const items: string[] = [];
      if (hasCoffee) items.push("coffee");
      if (hasPastries) items.push("pastries");
      if (/sandwiches|sandwich/i.test(input)) items.push("sandwiches");
      if (/lunch/i.test(input)) items.push("lunch");
      if (/breakfast/i.test(input)) items.push("breakfast");
      if (/snacks/i.test(input)) items.push("snacks");
      if (/drinks|beverages/i.test(input)) items.push("drinks");

      // Handle ezCater agent response with restaurant options
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Great! I've found some nearby restaurants that can deliver ${items.join(
            " and "
          )} for your meeting.`,
          sender: "assistant",
          isTyping: true,
          agentType: "ezcater",
          showCateringOptions: false, // Don't show card yet
          cateringItems: items,
        };
        const finalMessages = [...newMessages, aiResponse];
        setMessages(finalMessages);
        if (onMessagesUpdate) {
          onMessagesUpdate(finalMessages);
        }

        // Show catering options AFTER typing animation completes
        // Message: ~97 chars (with "coffee and pastries")
        // Animation time: 2000ms bouncing + 97 chars * 20ms + 100ms cleanup = 4040ms
        // Add 500ms buffer to ensure typing is completely finished before card appears
        setTimeout(() => {
          setMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === aiResponse.id ? { ...m, showCateringOptions: true } : m
            );
            // Schedule parent update separately to avoid update-during-render warning
            setTimeout(() => {
              if (onMessagesUpdate) {
                onMessagesUpdate(updated);
              }
            }, 0);
            return updated;
          });
        }, 4540);
      }, 1000);

      // Update parent component with user message immediately
      if (onMessagesUpdate) {
        onMessagesUpdate(newMessages);
      }
    } else {
      // For other cuisine selections, handle as normal message
      if (onMessagesUpdate) {
        onMessagesUpdate(newMessages);
      }

      // Simple response for non-coffee/pastry selections
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Great choice! Let me help you find restaurants that serve that.`,
          sender: "assistant",
          isTyping: true,
          agentType: "ezcater",
        };
        const finalMessages = [...newMessages, aiResponse];
        setMessages(finalMessages);
        if (onMessagesUpdate) {
          onMessagesUpdate(finalMessages);
        }
      }, 800);
    }
  };

  // Handler for restaurant selection
  const handleRestaurantSelect = (restaurant: Restaurant) => {
    // Remove the catering options card but keep the agent's message
    const updatedMessages = messages.map((message) => {
      if (message.showCateringOptions) {
        return {
          ...message,
          showCateringOptions: false,
        };
      }
      return message;
    });

    // Add user's selection as a message
    const selectionMessage: Message = {
      id: Date.now().toString(),
      content: `I'd like to order from ${restaurant.name}`,
      sender: "user",
    };

    const newMessages = [...updatedMessages, selectionMessage];
    setMessages(newMessages);
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    }

    // Update catering order with restaurant details immediately
    updateCateringOrder({
      ...cateringOrderDetails,
      restaurant: restaurant.name,
      restaurantAddress: restaurant.address,
      restaurantDistance: restaurant.distance,
    });

    // AI responds with menu card
    setTimeout(() => {
      // Generate menu items based on meeting attendees
      const attendeeCount = cateringOrderDetails.meeting?.attendees || 10;

      // Generate appropriate quantities (roughly 1 coffee per person, 1.5 pastries per person)
      const coffeeQty = Math.max(1, Math.ceil(attendeeCount));
      const pastriesQty = Math.max(1, Math.ceil(attendeeCount * 1.5));

      const menuItems: MenuItem[] = [
        {
          id: "coffee",
          name: "Fresh Brewed Coffee",
          description: "Regular and decaf, includes cups, cream, and sugar",
          price: 2.5,
          quantity: coffeeQty,
        },
        {
          id: "pastries",
          name: "Assorted Pastries",
          description: "Croissants, muffins, and danish varieties",
          price: 3.5,
          quantity: pastriesQty,
        },
        {
          id: "orange-juice",
          name: "Orange Juice",
          description: "Freshly squeezed orange juice",
          price: 3.0,
          quantity: Math.ceil(attendeeCount * 0.5),
        },
        {
          id: "fruit-platter",
          name: "Fresh Fruit Platter",
          description: "Seasonal fruit selection",
          price: 25.0,
          quantity: 1,
        },
      ];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Perfect! Here's the menu from ${restaurant.name}. I've pre-filled quantities based on your ${attendeeCount} attendees.`,
        sender: "assistant",
        isTyping: true,
        agentType: "ezcater",
        showCateringMenu: false, // Don't show card yet
        restaurantName: restaurant.name,
        menuItems: menuItems,
      };
      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(finalMessages);
      }

      // Show catering menu AFTER typing animation completes
      // Message: ~110 chars (varies with restaurant name and attendee count)
      // Animation time: 2000ms bouncing + 110 chars * 20ms + 100ms cleanup = 4300ms
      // Add 500ms buffer to ensure typing is completely finished before card appears
      setTimeout(() => {
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === aiResponse.id ? { ...m, showCateringMenu: true } : m
          );
          // Schedule parent update separately to avoid update-during-render warning
          setTimeout(() => {
            if (onMessagesUpdate) {
              onMessagesUpdate(updated);
            }
          }, 0);
          return updated;
        });
      }, 4800);
    }, 800);
  };

  // Handler for meeting selection from widget
  const handleMeetingSelectFromWidget = (meeting: Meeting, room: Room) => {
    if (onMeetingSelectedForCatering) {
      onMeetingSelectedForCatering(meeting, room);
    }
  };

  // Handler for canceling catering order
  const handleCancelCateringOrder = () => {
    // Clear the catering order
    updateCateringOrder({
      items: [],
      totalCost: 0,
    });

    // Remove ezCater agent from all messages to hide the preview drawer
    const messagesWithoutEzCater = messages.map((msg) => {
      if (msg.agentType === "ezcater") {
        const { agentType, ...rest } = msg;
        return rest;
      }
      return msg;
    });

    // Add a message indicating cancellation
    const cancelMessage: Message = {
      id: Date.now().toString(),
      content: "Cancel my catering order",
      sender: "user",
    };

    const newMessages = [...messagesWithoutEzCater, cancelMessage];
    setMessages(newMessages);
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    }

    // AI confirms cancellation (without ezCater agent type, so drawer stays hidden)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "No problem! I've canceled your catering order. Let me know if you'd like to start a new one.",
        sender: "assistant",
      };
      const finalMessages = [...newMessages, aiResponse];
      setMessages(finalMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(finalMessages);
      }
    }, 500);
  };

  // Handler for updating item quantity in catering order
  const handleUpdateCateringQuantity = (
    itemName: string,
    newQuantity: number
  ) => {
    const updatedItems = cateringOrderDetails.items
      .map((item) =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0); // Remove items with 0 quantity

    const newTotalCost = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    updateCateringOrder({
      ...cateringOrderDetails,
      items: updatedItems,
      totalCost: newTotalCost,
    });
  };

  // Handler for removing an item from catering order
  const handleRemoveCateringItem = (itemName: string) => {
    const updatedItems = cateringOrderDetails.items.filter(
      (item) => item.name !== itemName
    );
    const newTotalCost = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    updateCateringOrder({
      ...cateringOrderDetails,
      items: updatedItems,
      totalCost: newTotalCost,
    });
  };

  // Handler for adding an item to catering order
  const handleAddCateringItem = (item: CateringOrderItem) => {
    // Check if item already exists
    const existingItem = cateringOrderDetails.items.find(
      (i) => i.name === item.name
    );

    let updatedItems;
    if (existingItem) {
      // Increase quantity if exists
      updatedItems = cateringOrderDetails.items.map((i) =>
        i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      // Add new item with quantity 1
      updatedItems = [...cateringOrderDetails.items, { ...item, quantity: 1 }];
    }

    const newTotalCost = updatedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    updateCateringOrder({
      ...cateringOrderDetails,
      items: updatedItems,
      totalCost: newTotalCost,
    });
  };

  // Handler for submitting catering order
  const handleSubmitCateringOrder = () => {
    const orderSummary = `Submit catering order from ${
      cateringOrderDetails.restaurant
    } for $${cateringOrderDetails.totalCost.toFixed(2)}`;

    const submitMessage: Message = {
      id: Date.now().toString(),
      content: orderSummary,
      sender: "user",
    };

    const newMessages = [...messages, submitMessage];
    setMessages(newMessages);
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    }

    // Close the preview drawer and mark order as submitted
    setIsCateringPreviewOpen(false);
    setCateringOrderSubmitted(true);

    // Create service ticket and capture the created ticket ID
    let actualTicketId: string = "";

    if (onCreateServiceTicket && cateringOrderDetails.meeting) {
      // Parse the meeting time to create proper event start time
      // The meeting.time is in format like "9:00 AM" or "2:30 PM"
      const parseMeetingTime = (timeStr: string): string => {
        const today = new Date();
        const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeParts) {
          let hours = parseInt(timeParts[1]);
          const minutes = parseInt(timeParts[2]);
          const period = timeParts[3].toUpperCase();

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          today.setHours(hours, minutes, 0, 0);
        }
        return today.toISOString();
      };

      const ticketData = {
        status: "pending" as const,
        eventStartTime: parseMeetingTime(cateringOrderDetails.meeting.time),
        serviceName: cateringOrderDetails.restaurant || "Catering Service",
        space: cateringOrderDetails.meeting.location,
        eventTitle: cateringOrderDetails.meeting.title,
        approver: "Jennifer Martin",
        requester: "You",
        assignee: "ezCater Services",
        category: "catering" as const,
        description: `Catering order from ${cateringOrderDetails.restaurant} for ${cateringOrderDetails.meeting.attendees} attendees`,
        items: cateringOrderDetails.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalCost: cateringOrderDetails.totalCost,
        meetingDetails: cateringOrderDetails.meeting,
        restaurant: cateringOrderDetails.restaurant,
        restaurantAddress: cateringOrderDetails.restaurantAddress,
        restaurantDistance: cateringOrderDetails.restaurantDistance,
      };

      const createdTicket = onCreateServiceTicket(ticketData);

      // Capture the actual created ticket ID
      if (createdTicket && createdTicket.id) {
        actualTicketId = createdTicket.id;
        if (onCateringTicketNumberChange) {
          onCateringTicketNumberChange(createdTicket.id);
        }
      }
    }

    // AI confirms submission with ticket information
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Perfect! Your catering order from ${cateringOrderDetails.restaurant} has been submitted. You'll be notified when it arrives.`,
        sender: "assistant",
        agentType: "ezcater",
      };

      // Robin AI ALWAYS adds final message about the ticket with the actual ticket ID
      const ticketMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `A meeting services ticket has been created. You can manage your order by going to [${actualTicketId}](#ticket).`,
        sender: "assistant",
        agentType: undefined,
      };

      const finalMessages = [...newMessages, aiResponse, ticketMessage];
      setMessages(finalMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(finalMessages);
      }

      // Show success toast
      toast.success("Catering order submitted successfully!", {
        duration: 3000,
      });
    }, 800);
  };

  const handleSendMessage = (messageContent?: string) => {
    const content = messageContent || inputValue;
    if (!content.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: content,
      sender: "user",
    };

    // Create updatedMessages with user message (but don't add to state yet for book room requests)
    const updatedMessages = [...messages, newUserMessage];

    setInputValue("");
    hasStartedChatRef.current = true;
    setHasStartedChat(true);

    // Enable full height for the new turn
    setIsCurrentTurnFullHeight(true);

    // Check if we should auto-populate input after AI response
    const shouldAutoPopulate = content
      .toLowerCase()
      .includes("book a room for my team");

    // Check if this is a book room request (will get "The more you tell me" response)
    const isBookRoomRequest =
      content.toLowerCase().includes("book a room") ||
      content.toLowerCase().includes("need to book") ||
      content.toLowerCase().includes("book a room for my team");

    // Check if this is a catering order submission request
    const input = content.toLowerCase();
    const isSubmitOrderRequest =
      (input.includes("submit") &&
        (input.includes("order") || input.includes("catering"))) ||
      (input.includes("place") &&
        (input.includes("order") || input.includes("catering"))) ||
      (input.includes("confirm") &&
        (input.includes("order") || input.includes("catering"))) ||
      input.includes("submit order") ||
      input.includes("place order") ||
      input.includes("confirm order");

    // Check if there's a complete catering order ready to submit
    const hasCompleteCateringOrder =
      cateringOrderDetails.meeting &&
      cateringOrderDetails.restaurant &&
      cateringOrderDetails.items.length > 0;

    if (isSubmitOrderRequest && hasCompleteCateringOrder) {
      // User is trying to submit the order via text
      // Close the preview drawer and mark order as submitted
      setIsCateringPreviewOpen(false);
      setCateringOrderSubmitted(true);

      // Create service ticket and capture the created ticket ID
      let actualTicketId: string = "";

      if (onCreateServiceTicket && cateringOrderDetails.meeting) {
        // Parse the meeting time to create proper event start time
        // The meeting.time is in format like "9:00 AM" or "2:30 PM"
        const parseMeetingTime = (timeStr: string): string => {
          const today = new Date();
          const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeParts) {
            let hours = parseInt(timeParts[1]);
            const minutes = parseInt(timeParts[2]);
            const period = timeParts[3].toUpperCase();

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            today.setHours(hours, minutes, 0, 0);
          }
          return today.toISOString();
        };

        const ticketData = {
          status: "pending" as const,
          eventStartTime: parseMeetingTime(cateringOrderDetails.meeting.time),
          serviceName: cateringOrderDetails.restaurant || "Catering Service",
          space: cateringOrderDetails.meeting.location,
          eventTitle: cateringOrderDetails.meeting.title,
          approver: "Jennifer Martin",
          requester: "You",
          assignee: "ezCater Services",
          category: "catering" as const,
          description: `Catering order from ${cateringOrderDetails.restaurant} for ${cateringOrderDetails.meeting.attendees} attendees`,
          items: cateringOrderDetails.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalCost: cateringOrderDetails.totalCost,
          meetingDetails: cateringOrderDetails.meeting,
          restaurant: cateringOrderDetails.restaurant,
          restaurantAddress: cateringOrderDetails.restaurantAddress,
          restaurantDistance: cateringOrderDetails.restaurantDistance,
        };
        const createdTicket = onCreateServiceTicket(ticketData);

        // Capture the actual created ticket ID
        if (createdTicket && createdTicket.id) {
          actualTicketId = createdTicket.id;
          if (onCateringTicketNumberChange) {
            onCateringTicketNumberChange(createdTicket.id);
          }
        }
      }

      // AI confirms submission with ticket information
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Perfect! Your catering order from ${cateringOrderDetails.restaurant} has been submitted. You'll be notified when it arrives.`,
          sender: "assistant",
          agentType: "ezcater",
        };

        // Robin AI ALWAYS adds final message about the ticket with the actual ticket ID
        const ticketMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: `A meeting services ticket has been created. You can manage your order by going to [${actualTicketId}](#ticket).`,
          sender: "assistant",
          agentType: undefined,
        };

        const finalMessages = [...updatedMessages, aiResponse, ticketMessage];
        setMessages(finalMessages);
        if (onMessagesUpdate) {
          onMessagesUpdate(finalMessages);
        }

        // Show success toast
        toast.success("Catering order submitted successfully!", {
          duration: 3000,
        });
      }, 800);

      // Update parent component with user message immediately
      if (onMessagesUpdate) {
        onMessagesUpdate(updatedMessages);
      }
      return;
    }

    // Check if this is a catering request
    const isCateringRequest =
      input.includes("add catering") ||
      input.includes("catering to a meeting") ||
      input.includes("order catering") ||
      input.includes("get catering");

    // Check if this is a catering items request (e.g., "I need coffee and pastries")
    // More flexible - just check if keywords appear in the message
    const hasCoffee = /coffee/i.test(input);
    const hasPastries = /(pastries|pastry)/i.test(input);
    const hasOtherFood =
      /(sandwiches|lunch|breakfast|snacks|drinks|beverages|food)/i.test(input);

    const isCateringItemsRequest =
      cateringOrderDetails.meeting && // Only if meeting already selected
      (hasCoffee || hasPastries || hasOtherFood);

    if (isCateringItemsRequest) {
      // Extract catering items from the request
      const items: string[] = [];
      if (hasCoffee) items.push("coffee");
      if (hasPastries) items.push("pastries");
      if (/sandwiches|sandwich/i.test(input)) items.push("sandwiches");
      if (/lunch/i.test(input)) items.push("lunch");
      if (/breakfast/i.test(input)) items.push("breakfast");
      if (/snacks/i.test(input)) items.push("snacks");
      if (/drinks|beverages/i.test(input)) items.push("drinks");

      // Handle ezCater agent response with restaurant options
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `Great! I've found some nearby restaurants that can deliver ${items.join(
            " and "
          )} for your meeting.`,
          sender: "assistant",
          agentType: "ezcater",
          showCateringOptions: false, // Don't show card yet
          cateringItems: items,
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        if (onMessagesUpdate) {
          onMessagesUpdate(finalMessages);
        }

        // Show catering options AFTER typing animation completes
        // Typing time: 2000ms bouncing + ~80 chars * 20ms = ~3600ms total
        // Add 500ms buffer to ensure typing is completely finished before card appears
        setTimeout(() => {
          setMessages((prev) => {
            const updated = prev.map((m) =>
              m.id === aiResponse.id ? { ...m, showCateringOptions: true } : m
            );
            // Schedule parent update separately to avoid update-during-render warning
            setTimeout(() => {
              if (onMessagesUpdate) {
                onMessagesUpdate(updated);
              }
            }, 0);
            return updated;
          });
        }, 4100);
      }, 1000);

      // Add user message to state and update parent component immediately
      setMessages(updatedMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(updatedMessages);
      }
      return;
    }

    if (isCateringRequest) {
      // Handle ezCater agent response
      setTimeout(() => {
        const ezCaterResponse: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "Ok, I can help with that! First I need a little more information:\n* What is the address for the meeting?\n* What time will the meeting be?\n* How many people do you need to feed?\n* Do you have any dietary restrictions?\n* Do you have a specific cuisine in mind?",
          sender: "assistant",
          isTyping: true,
          agentType: "ezcater",
        };
        const messagesWithEz = [...updatedMessages, ezCaterResponse];
        setMessages(messagesWithEz);
        if (onMessagesUpdate) {
          onMessagesUpdate(messagesWithEz);
        }

        // Add Robin agent response with meeting list widget AFTER ezCater typing completes
        // ezCater message: ~262 chars
        // Animation time: 2000ms bouncing + 262 chars * 20ms + 100ms cleanup = 7340ms
        // Add 500ms buffer to ensure ezCater message is completely finished
        setTimeout(() => {
          const robinResponse: Message = {
            id: (Date.now() + 2).toString(),
            content:
              "If you click a meeting in the grid to the left I'll add some of this info for you. Or pick from the list below:",
            sender: "assistant",
            isTyping: true,
            agentType: "robin",
            showMeetingListWidget: false, // Don't show widget yet
          };
          const finalMessages = [...messagesWithEz, robinResponse];
          setMessages(finalMessages);
          if (onMessagesUpdate) {
            onMessagesUpdate(finalMessages);
          }

          // Show meeting list widget AFTER Robin's typing animation completes
          // Robin message: ~120 chars
          // Animation time: 2000ms bouncing + 120 chars * 20ms + 100ms cleanup = 4500ms
          // Add 500ms buffer for smooth transition
          setTimeout(() => {
            setMessages((prev) => {
              const updated = prev.map((m) =>
                m.id === robinResponse.id
                  ? { ...m, showMeetingListWidget: true }
                  : m
              );
              // Schedule parent update separately to avoid update-during-render warning
              setTimeout(() => {
                if (onMessagesUpdate) {
                  onMessagesUpdate(updated);
                }
              }, 0);
              return updated;
            });
          }, 5000);
        }, 7840);
      }, 1000);

      // Add user message to state and update parent component immediately
      setMessages(updatedMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(updatedMessages);
      }
      return;
    }

    // Check if this is a detailed meeting booking request

    // Try to parse requirements to see if we have enough details
    const testRequirements = parseMeetingRequirements(content);

    // Check if user provided enough details for a room search
    // We need at least: people count OR time, and ideally both
    const hasPeopleCount =
      /(\d+)\s*(?:people|person|attendees?|participants?)/i.test(content);
    const hasTime = /(\d+)(?::(\d+))?\s*(am|pm)/i.test(content);
    const hasAmenities =
      /video|projector|whiteboard|audio|screen|tv|conferencing/i.test(content);

    // Has booking details if we can extract meaningful requirements
    const hasBookingDetails =
      ((input.includes("book") ||
        input.includes("need") ||
        input.includes("schedule") ||
        input.includes("find") ||
        input.includes("looking for")) &&
        (hasPeopleCount || hasTime || hasAmenities)) ||
      ((input.includes("standup") ||
        input.includes("meeting") ||
        input.includes("presentation") ||
        input.includes("workshop") ||
        input.includes("training")) &&
        (hasPeopleCount || hasTime));

    // Trigger full thinking flow for any booking request with at least some details
    // This ensures consistent UX with thinking animation for all room searches
    const isDetailedBookingRequest = hasBookingDetails;

    if (isDetailedBookingRequest) {
      // Add intermediate message immediately after user input
      setTimeout(() => {
        // Generate dynamic intermediate message based on requirements
        const testReqs = parseMeetingRequirements(content);
        const intermediateMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Let me search for available meeting spaces that fit your requirements.`,
          sender: "assistant",
        };
        const messagesWithIntermediate = [
          ...updatedMessages,
          intermediateMessage,
        ];
        setMessages(messagesWithIntermediate);
        onMessagesUpdate?.(messagesWithIntermediate);

        // Add thinking message after brief delay
        setTimeout(() => {
          // Parse meeting requirements to calculate good fit rooms
          const requirements = parseMeetingRequirements(content);

          // Calculate number of good fit rooms (capacity >= attendees AND capacity <= attendees + 3 AND has required features)
          const goodFitRooms =
            rooms?.filter((room) => {
              // Must be available
              if (room.status !== "available") return false;

              // Good fit: capacity is within attendees to attendees + 3
              if (
                room.capacity < requirements.attendees ||
                room.capacity > requirements.attendees + 3
              ) {
                return false;
              }

              // Must have all required features
              if (requirements.features.length > 0) {
                const hasAllFeatures = requirements.features.every(
                  (requiredFeature) =>
                    room.features.some(
                      (roomFeature) =>
                        roomFeature
                          .toLowerCase()
                          .includes(requiredFeature.toLowerCase()) ||
                        requiredFeature
                          .toLowerCase()
                          .includes(roomFeature.toLowerCase())
                    )
                );
                if (!hasAllFeatures) return false;
              }

              // Must not have conflicts at the meeting time
              const meetingEnd = requirements.startTime + requirements.duration;
              const hasConflict = room.meetings.some((existingMeeting) => {
                const existingStart = existingMeeting.startTime;
                const existingEnd =
                  existingMeeting.startTime + existingMeeting.duration;
                return !(
                  meetingEnd <= existingStart ||
                  requirements.startTime >= existingEnd
                );
              });

              return !hasConflict;
            }) || [];

          const goodFitCount = goodFitRooms.length;

          // Calculate poor fit rooms (available but wrong capacity or missing features)
          const poorFitRooms =
            rooms?.filter((room) => {
              // Must be available
              if (room.status !== "available") return false;

              // Must not have conflicts at the meeting time
              const meetingEnd = requirements.startTime + requirements.duration;
              const hasConflict = room.meetings.some((existingMeeting) => {
                const existingStart = existingMeeting.startTime;
                const existingEnd =
                  existingMeeting.startTime + existingMeeting.duration;
                return !(
                  meetingEnd <= existingStart ||
                  requirements.startTime >= existingEnd
                );
              });
              if (hasConflict) return false;

              // Poor fit if capacity is wrong or missing features
              const capacityTooSmall = room.capacity < requirements.attendees;
              const capacityTooLarge =
                room.capacity > requirements.attendees + 3;

              const missingFeatures =
                requirements.features.length > 0 &&
                !requirements.features.every((requiredFeature) =>
                  room.features.some(
                    (roomFeature) =>
                      roomFeature
                        .toLowerCase()
                        .includes(requiredFeature.toLowerCase()) ||
                      requiredFeature
                        .toLowerCase()
                        .includes(roomFeature.toLowerCase())
                  )
                );

              return capacityTooSmall || capacityTooLarge || missingFeatures;
            }) || []; // Show all poor fit rooms

          // Format features text for thinking display
          const featureText =
            requirements.features.length > 0
              ? `, and have ${requirements.features
                  .map((f) => {
                    const lower = f.toLowerCase();
                    if (lower === "video conf") return "video-conferencing";
                    return lower;
                  })
                  .join(" and ")}`
              : "";

          // Prepare room data for display
          const goodFitRoomData = goodFitRooms.map((room) => ({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            attendees: requirements.attendees,
          }));

          const poorFitRoomData = poorFitRooms.map((room) => {
            const capacityTooSmall = room.capacity < requirements.attendees;
            const capacityTooLarge = room.capacity > requirements.attendees + 3;

            let reason = "";
            if (capacityTooSmall) {
              reason = `The space capacity of ${room.capacity} is too small for the ${requirements.attendees} invitees.`;
            } else if (capacityTooLarge) {
              reason = `The space capacity of ${room.capacity} is much larger than needed for the ${requirements.attendees} invitees.`;
            } else {
              // Check which specific features are missing
              const missingFeaturesList = requirements.features.filter(
                (requiredFeature) =>
                  !room.features.some(
                    (roomFeature) =>
                      roomFeature
                        .toLowerCase()
                        .includes(requiredFeature.toLowerCase()) ||
                      requiredFeature
                        .toLowerCase()
                        .includes(roomFeature.toLowerCase())
                  )
              );

              if (missingFeaturesList.length > 0) {
                const formattedFeatures = missingFeaturesList
                  .map((f) => {
                    const lower = f.toLowerCase();
                    if (lower === "video conf") return "video-conferencing";
                    return lower;
                  })
                  .join(", ");
                reason = `Missing ${formattedFeatures}.`;
              } else {
                reason = `Missing required features.`;
              }
            }

            return {
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              attendees: requirements.attendees,
              reason,
            };
          });

          const firstThinking: Message = {
            id: (Date.now() + 2).toString(),
            content: "Thinking...",
            sender: "assistant",
            isThinking: true,
            thinkingText: `• Looking for spaces that...\n  fit at least ${
              requirements.attendees
            } ${
              requirements.attendees === 1 ? "person" : "people"
            }, are available at ${formatTime(
              requirements.startTime
            )} today${featureText}.\n• Found ${goodFitCount} suitable space${
              goodFitCount !== 1 ? "s" : ""
            }\n  There ${
              goodFitCount !== 1 ? "are" : "is"
            } ${goodFitCount} good ${
              goodFitCount !== 1 ? "choices" : "choice"
            } so I should ${
              goodFitCount > 1
                ? "ask the user which one they would prefer"
                : goodFitCount === 1
                ? "recommend this space"
                : "look for alternative options"
            }.\n  [ROOM_LIST]`,
            thinkingRoomData: {
              goodFitRooms: goodFitRoomData,
              poorFitRooms: poorFitRoomData,
            },
          };
          const messagesWithFirstThinking = [
            ...messagesWithIntermediate,
            firstThinking,
          ];
          setMessages(messagesWithFirstThinking);
          onMessagesUpdate?.(messagesWithFirstThinking);

          // Wait for thinking animation to complete (5 lines: 500ms initial + 4x1000ms for lines 2-5 = 4500ms), then add final response after 500ms delay
          setTimeout(() => {
            const finalResponse: Message = {
              id: (Date.now() + 3).toString(),
              content: getAiResponse(content),
              sender: "assistant",
              isTyping: true,
              showRoomSuggestions: false, // Don't show suggestions yet
              meetingRequirements: requirements,
            };
            const finalMessages = [...messagesWithFirstThinking, finalResponse];
            setMessages(finalMessages);
            onMessagesUpdate?.(finalMessages);

            // Show room suggestions AFTER typing animation completes
            // Typing time: 2000ms bouncing + ~85 chars * 20ms = ~3700ms total
            // Add 500ms buffer to ensure typing is completely finished before suggestions appear
            setTimeout(() => {
              setMessages((prev) => {
                const updated = prev.map((m) =>
                  m.id === finalResponse.id
                    ? { ...m, showRoomSuggestions: true }
                    : m
                );
                // Schedule parent update separately to avoid update-during-render warning
                setTimeout(() => {
                  onMessagesUpdate?.(updated);
                }, 0);
                return updated;
              });
            }, 4200);
          }, 5000); // 4500ms for thinking animation + 500ms delay
        }, 500);
      }, 500);
    } else {
      // Regular AI response for other messages (non-booking queries)
      const aiResponseContent = getAiResponse(content);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "assistant",
        isTyping: true,
        // Room suggestions are handled in the thinking flow above
        showRoomSuggestions: false,
        meetingRequirements: undefined,
      };

      // Add user message immediately
      setMessages(updatedMessages);
      if (onMessagesUpdate) {
        onMessagesUpdate(updatedMessages);
      }

      // Then add AI response after delay
      setTimeout(() => {
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);

        // Auto-populate input if this was a room booking request - wait for typing to complete
        if (shouldAutoPopulate) {
          // Calculate typing animation duration: 2000ms (bouncing dots) + (content.length * 20ms) + 100ms (cleanup)
          const typingDuration = 2000 + aiResponseContent.length * 20 + 100;

          setTimeout(() => {
            setInputValue(
              "I need to book a team check-in for 4 people at 2pm today with video-conferencing"
            );
          }, typingDuration);
        }

        // Update parent component with new messages
        if (onMessagesUpdate) {
          onMessagesUpdate(finalMessages);
        }
      }, 1000);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const toggleThinkingExpansion = (messageId: string) => {
    setExpandedThinking((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleEditMessage = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.sender !== "user") return;

    // Check if there are any active thinking messages
    const activeThinkingMessages = messages.filter(
      (m) =>
        m.isThinking &&
        !m.isPaused &&
        thinkingProgress[m.id] &&
        !thinkingProgress[m.id].isComplete
    );

    // Pause all active thinking
    if (activeThinkingMessages.length > 0) {
      activeThinkingMessages.forEach((thinkingMsg) => {
        // Clear all active timeouts for this message
        const timeouts = activeTimeouts.current.get(thinkingMsg.id);
        if (timeouts) {
          timeouts.forEach((timeout) => clearTimeout(timeout));
          activeTimeouts.current.delete(thinkingMsg.id);
        }

        // Mark as paused
        setPausedThinking((prev) => {
          const next = new Set(prev);
          next.add(thinkingMsg.id);
          return next;
        });
      });

      // Update messages to show paused state
      setMessages((prevMessages) =>
        prevMessages.map((m) => {
          if (activeThinkingMessages.some((am) => am.id === m.id)) {
            return { ...m, isPaused: true };
          }
          return m;
        })
      );
    }

    setEditingMessageId(messageId);
    setEditedContent(message.content);
  };

  const handleSaveEditedMessage = () => {
    if (!editingMessageId || !editedContent.trim()) return;

    // Find the index of the message being edited
    const messageIndex = messages.findIndex((m) => m.id === editingMessageId);
    if (messageIndex === -1) return;

    // Get all messages after the edited message to clean up their state
    const messagesAfterEdit = messages.slice(messageIndex + 1);

    // Clear thinking state and typing state for any messages that will be removed
    messagesAfterEdit.forEach((msg) => {
      if (msg.isThinking) {
        setExpandedThinking((prev) => {
          const next = new Set(prev);
          next.delete(msg.id);
          return next;
        });
        setThinkingProgress((prev) => {
          const next = { ...prev };
          delete next[msg.id];
          return next;
        });
        // Clear from initialized tracking
        initializedThinkingMessages.current.delete(msg.id);
      }
      // Also clear typing animation tracking and timeouts
      initializedTypingMessages.current.delete(msg.id);
      completedTypingMessages.current.delete(msg.id);
      const timeouts = typingTimeouts.current.get(msg.id);
      if (timeouts) {
        timeouts.forEach((timeout) => clearTimeout(timeout));
        typingTimeouts.current.delete(msg.id);
      }
    });

    // Remove all messages after the edited message (including AI responses)
    const messagesBeforeEdit = messages.slice(0, messageIndex);

    // Update the edited message
    const updatedMessage: Message = {
      ...messages[messageIndex],
      content: editedContent.trim(),
    };

    // Clear editing state
    setEditingMessageId(null);
    setEditedContent("");

    // Clear any room highlights and meeting previews
    if (onHighlightRoom) {
      onHighlightRoom(null);
    }
    if (onAiMeetingPreviewUpdate) {
      onAiMeetingPreviewUpdate(null);
    }

    // Update messages array with only messages before edit + edited message (no AI responses yet)
    const newMessages = [...messagesBeforeEdit, updatedMessage];
    setMessages(newMessages);
    onMessagesUpdate?.(newMessages);

    // Now regenerate AI response based on the edited content
    // We need to manually trigger the AI response logic without calling handleSendMessage
    // because handleSendMessage would create a duplicate user message
    const content = editedContent.trim();
    const input = content.toLowerCase();

    // Check if this is a detailed meeting booking request
    const hasPeopleCount =
      /(\d+)\s*(?:people|person|attendees?|participants?)/i.test(content);
    const hasTime = /(\d+)(?::(\d+))?\s*(am|pm)/i.test(content);
    const hasAmenities =
      /video|projector|whiteboard|audio|screen|tv|conferencing/i.test(content);

    const hasBookingDetails =
      ((input.includes("book") ||
        input.includes("need") ||
        input.includes("schedule") ||
        input.includes("find") ||
        input.includes("looking for")) &&
        (hasPeopleCount || hasTime || hasAmenities)) ||
      ((input.includes("standup") ||
        input.includes("meeting") ||
        input.includes("presentation") ||
        input.includes("workshop") ||
        input.includes("training")) &&
        (hasPeopleCount || hasTime));

    const isDetailedBookingRequest = hasBookingDetails;

    if (isDetailedBookingRequest) {
      // Add intermediate message immediately after edited user message
      setTimeout(() => {
        const intermediateMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Let me search for available meeting spaces that fit your requirements.`,
          sender: "assistant",
        };
        const messagesWithIntermediate = [...newMessages, intermediateMessage];
        setMessages(messagesWithIntermediate);
        onMessagesUpdate?.(messagesWithIntermediate);

        // Add thinking message after brief delay
        setTimeout(() => {
          // Parse meeting requirements to calculate good fit rooms
          const requirements = parseMeetingRequirements(content);

          // Calculate good fit rooms
          const goodFitRooms =
            rooms?.filter((room) => {
              if (room.status !== "available") return false;
              if (
                room.capacity < requirements.attendees ||
                room.capacity > requirements.attendees + 3
              ) {
                return false;
              }
              if (requirements.features.length > 0) {
                const hasAllFeatures = requirements.features.every(
                  (requiredFeature) =>
                    room.features.some(
                      (roomFeature) =>
                        roomFeature
                          .toLowerCase()
                          .includes(requiredFeature.toLowerCase()) ||
                        requiredFeature
                          .toLowerCase()
                          .includes(roomFeature.toLowerCase())
                    )
                );
                if (!hasAllFeatures) return false;
              }
              const meetingEnd = requirements.startTime + requirements.duration;
              const hasConflict = room.meetings.some((existingMeeting) => {
                const existingStart = existingMeeting.startTime;
                const existingEnd =
                  existingMeeting.startTime + existingMeeting.duration;
                return !(
                  meetingEnd <= existingStart ||
                  requirements.startTime >= existingEnd
                );
              });
              return !hasConflict;
            }) || [];

          const goodFitCount = goodFitRooms.length;

          // Calculate poor fit rooms
          const poorFitRooms =
            rooms?.filter((room) => {
              if (room.status !== "available") return false;
              const meetingEnd = requirements.startTime + requirements.duration;
              const hasConflict = room.meetings.some((existingMeeting) => {
                const existingStart = existingMeeting.startTime;
                const existingEnd =
                  existingMeeting.startTime + existingMeeting.duration;
                return !(
                  meetingEnd <= existingStart ||
                  requirements.startTime >= existingEnd
                );
              });
              if (hasConflict) return false;
              const capacityTooSmall = room.capacity < requirements.attendees;
              const capacityTooLarge =
                room.capacity > requirements.attendees + 3;
              const missingFeatures =
                requirements.features.length > 0 &&
                !requirements.features.every((requiredFeature) =>
                  room.features.some(
                    (roomFeature) =>
                      roomFeature
                        .toLowerCase()
                        .includes(requiredFeature.toLowerCase()) ||
                      requiredFeature
                        .toLowerCase()
                        .includes(roomFeature.toLowerCase())
                  )
                );
              return capacityTooSmall || capacityTooLarge || missingFeatures;
            }) || [];

          // Format features text
          const featureText =
            requirements.features.length > 0
              ? `, and have ${requirements.features
                  .map((f) => {
                    const lower = f.toLowerCase();
                    if (lower === "video conf") return "video-conferencing";
                    return lower;
                  })
                  .join(" and ")}`
              : "";

          // Prepare room data
          const goodFitRoomData = goodFitRooms.map((room) => ({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            attendees: requirements.attendees,
          }));

          const poorFitRoomData = poorFitRooms.map((room) => {
            const capacityTooSmall = room.capacity < requirements.attendees;
            const capacityTooLarge = room.capacity > requirements.attendees + 3;
            let reason = "";
            if (capacityTooSmall) {
              reason = `With a capacity of ${
                room.capacity
              }, this space is too small for ${
                requirements.attendees
              } attendee${requirements.attendees > 1 ? "s" : ""}.`;
            } else if (capacityTooLarge) {
              reason = `With a capacity of ${
                room.capacity
              }, this space is much larger than needed for ${
                requirements.attendees
              } attendee${requirements.attendees > 1 ? "s" : ""}.`;
            } else {
              reason = `This space doesn't have all the required features.`;
            }
            return {
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              attendees: requirements.attendees,
              reason,
            };
          });

          const thinkingText = `Understanding your requirements
• You need space for ${requirements.attendees} attendee${
            requirements.attendees > 1 ? "s" : ""
          }
• Meeting duration: ${
            requirements.duration === 0.5
              ? "30 minutes"
              : requirements.duration === 1
              ? "1 hour"
              : `${requirements.duration} hours`
          }
• Start time: ${formatTime(requirements.startTime)}${featureText}

Checking room availability
• Found ${goodFitCount} room${
            goodFitCount !== 1 ? "s" : ""
          } that match your criteria
• Filtering by capacity and features
• Confirming no scheduling conflicts`;

          const thinkingMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Analyzing your requirements...",
            sender: "assistant",
            isThinking: true,
            thinkingText: thinkingText,
            thinkingRoomData: {
              goodFitRooms: goodFitRoomData,
              poorFitRooms: poorFitRoomData,
            },
          };

          const messagesWithThinking = [
            ...messagesWithIntermediate,
            thinkingMessage,
          ];
          setMessages(messagesWithThinking);
          onMessagesUpdate?.(messagesWithThinking);

          // Add final response with room suggestions after thinking
          setTimeout(() => {
            const finalResponse =
              goodFitCount > 0
                ? `I found ${goodFitCount} room${
                    goodFitCount !== 1 ? "s" : ""
                  } that ${goodFitCount === 1 ? "fits" : "fit"} your needs. ${
                    goodFitCount === 1 ? "This space is" : "These spaces are"
                  } available at ${formatTime(requirements.startTime)} and ${
                    goodFitCount === 1 ? "has" : "have"
                  } the capacity and features you need.`
                : `I couldn't find any rooms that perfectly match your requirements. However, I found some alternative options that might work.`;

            const finalMessage: Message = {
              id: (Date.now() + 3).toString(),
              content: finalResponse,
              sender: "assistant",
              showRoomSuggestions: true,
              meetingRequirements: requirements,
            };

            const finalMessages = [...messagesWithThinking, finalMessage];
            setMessages(finalMessages);
            onMessagesUpdate?.(finalMessages);
          }, 2000);
        }, 800);
      }, 300);
    } else {
      // Simple response for non-booking queries
      setTimeout(() => {
        const response = getAiResponse(content);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: "assistant",
        };
        const updatedMessagesWithAI = [...newMessages, aiMessage];
        setMessages(updatedMessagesWithAI);
        onMessagesUpdate?.(updatedMessagesWithAI);
      }, 500);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleSelectRoom = (roomId: string, requirements: any) => {
    // Call the parent's onSelectRoom if provided - parent will handle all message updates
    if (onSelectRoom) {
      onSelectRoom(roomId, requirements);
    }
  };

  const handleHighlightRoom = (roomId: string | null) => {
    if (onHighlightRoom) {
      onHighlightRoom(roomId);
    }
  };

  const handleCancelRoomSuggestions = () => {
    // Remove room suggestions from the last assistant message
    const updatedMessages = messages.map((message, index) => {
      if (
        index === messages.length - 1 &&
        message.sender === "assistant" &&
        message.showRoomSuggestions
      ) {
        return {
          ...message,
          showRoomSuggestions: false,
          meetingRequirements: undefined,
        };
      }
      return message;
    });

    setMessages(updatedMessages);

    if (onMessagesUpdate) {
      onMessagesUpdate(updatedMessages);
    }

    // Clear any room highlights and meeting preview
    if (onHighlightRoom) {
      onHighlightRoom(null);
    }

    if (onAiMeetingPreviewUpdate) {
      onAiMeetingPreviewUpdate(null);
    }
  };

  // Function to parse meeting requirements from user input
  const parseMeetingRequirements = (input: string) => {
    const inputLower = input.toLowerCase();

    // Extract number of people
    let attendees = 1;
    const peopleMatches = input.match(
      /(\d+)\s*(?:people|person|attendees?|participants?)/i
    );
    if (peopleMatches) {
      attendees = parseInt(peopleMatches[1]);
    }

    // Extract duration
    let duration = 1; // default 1 hour
    const durationMatches =
      input.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/i) ||
      input.match(/(\d+)\s*(?:minutes?|mins?|m)/i);
    if (durationMatches) {
      if (input.toLowerCase().includes("minute")) {
        duration = parseInt(durationMatches[1]) / 60; // convert minutes to hours
      } else {
        duration = parseFloat(durationMatches[1]);
      }
    }

    // Extract time
    let startTime = 14; // default 2 PM
    const timeMatch = input.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toLowerCase();

      if (period === "pm" && hours !== 12) {
        hours += 12;
      } else if (period === "am" && hours === 12) {
        hours = 0;
      }

      startTime = hours + minutes / 60;
    } else {
      // Handle relative time expressions
      if (inputLower.includes("now") || inputLower.includes("right now")) {
        const currentHour = new Date().getHours();
        startTime = currentHour + 0.5; // Round up to next half hour
      } else if (inputLower.includes("morning")) {
        startTime = 9; // 9 AM
      } else if (inputLower.includes("afternoon")) {
        startTime = 14; // 2 PM
      } else if (inputLower.includes("evening")) {
        startTime = 17; // 5 PM
      } else if (inputLower.includes("noon") || inputLower.includes("lunch")) {
        startTime = 12; // 12 PM
      }
    }

    // Extract meeting type/title
    let title = "Team Meeting";
    let type = "";

    if (
      inputLower.includes("standup") ||
      inputLower.includes("stand up") ||
      inputLower.includes("daily")
    ) {
      title = "Team Standup";
      type = "standup";
    } else if (
      inputLower.includes("presentation") ||
      inputLower.includes("demo")
    ) {
      title = "Presentation";
      type = "presentation";
    } else if (inputLower.includes("workshop")) {
      title = "Workshop";
      type = "workshop";
    } else if (inputLower.includes("training")) {
      title = "Training Session";
      type = "training";
    } else if (inputLower.includes("interview")) {
      title = "Interview";
      type = "interview";
    } else if (
      inputLower.includes("review") ||
      inputLower.includes("retrospective") ||
      inputLower.includes("retro")
    ) {
      title = "Review Meeting";
      type = "review";
    } else if (
      inputLower.includes("brainstorm") ||
      inputLower.includes("ideation")
    ) {
      title = "Brainstorming Session";
      type = "brainstorm";
    } else if (
      inputLower.includes("1:1") ||
      inputLower.includes("one on one") ||
      inputLower.includes("1-on-1")
    ) {
      title = "1:1 Meeting";
      type = "1:1";
    } else if (
      inputLower.includes("check-in") ||
      inputLower.includes("check in") ||
      inputLower.includes("sync")
    ) {
      title = "Team Check-in";
      type = "check-in";
    } else if (inputLower.includes("meeting")) {
      title = "Team Meeting";
      type = "meeting";
    }

    // Extract required features
    const features: string[] = [];
    if (
      inputLower.includes("video conferencing") ||
      inputLower.includes("video conf") ||
      inputLower.includes("video-conferencing") ||
      inputLower.includes("video") ||
      inputLower.includes("zoom") ||
      inputLower.includes("teams") ||
      inputLower.includes("conferencing")
    ) {
      features.push("Video Conf");
    }
    if (
      inputLower.includes("projector") ||
      inputLower.includes("screen") ||
      inputLower.includes("display") ||
      inputLower.includes("presentation")
    ) {
      features.push("Projector");
    }
    if (
      inputLower.includes("whiteboard") ||
      inputLower.includes("white board")
    ) {
      features.push("Whiteboard");
    }
    if (
      inputLower.includes("audio") ||
      inputLower.includes("sound") ||
      inputLower.includes("speaker")
    ) {
      features.push("Audio System");
    }
    if (inputLower.includes("tv") || inputLower.includes("monitor")) {
      features.push("TV");
    }

    return {
      title,
      attendees,
      duration,
      startTime,
      features,
      type,
    };
  };

  // Helper function to format time for display
  const formatTime = (timeSlot: number) => {
    const hour = Math.floor(timeSlot);
    const minutes = (timeSlot % 1) * 60;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinutes =
      minutes === 0 ? "" : `:${minutes.toString().padStart(2, "0")}`;
    return `${displayHour}${displayMinutes} ${period}`;
  };

  // Helper function to render message content with markdown link support
  const renderMessageContent = (content: string) => {
    // Match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          className="text-[#2774C1] hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  const getAiResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Check if user provided enough details for a room search
    const hasPeopleCount =
      /(\d+)\s*(?:people|person|attendees?|participants?)/i.test(userInput);
    const hasTime = /(\d+)(?::(\d+))?\s*(am|pm)/i.test(userInput);
    const hasAmenities =
      /video|projector|whiteboard|audio|screen|tv|conferencing/i.test(input);

    // Has booking details if we can extract meaningful requirements
    const hasBookingKeywords =
      input.includes("book") ||
      input.includes("need") ||
      input.includes("schedule") ||
      input.includes("find") ||
      input.includes("looking for") ||
      input.includes("standup") ||
      input.includes("meeting") ||
      input.includes("presentation") ||
      input.includes("workshop") ||
      input.includes("training");

    const hasEnoughDetails =
      (hasPeopleCount && hasTime) ||
      (hasPeopleCount && hasAmenities) ||
      (hasTime && hasAmenities);

    if (hasBookingKeywords && hasEnoughDetails) {
      return "I found these options for you. I've analyzed availability, capacity, and features to find the top matches.";
    }

    // Handle specific room booking request
    if (input.includes("book a room for my team")) {
      return "The more you tell me about your meeting the better a space I can find:\n\n• What type of meeting is it?\n• How many people will attend?\n• How long will it be?\n• Do you need any specific amenities such as a projector or whiteboard?\n• What time and date are you looking for?\n";
    }

    if (
      input.includes("seat") ||
      input.includes("desk") ||
      input.includes("assignment")
    ) {
      return "I can help you with seat assignments! For new employees, I analyze team proximity, schedule patterns, and desk availability to suggest optimal seating. Would you like me to explain the automated assignment process or help with a specific assignment?";
    }

    if (input.includes("ticket") || input.includes("workflow")) {
      return "I can assist with ticket management and workflows. When you approve a seat assignment, I automatically generate IT setup, facilities preparation, welcome package, and access tickets. Need help with a specific ticket or workflow?";
    }

    if (
      input.includes("map") ||
      input.includes("floor") ||
      input.includes("room")
    ) {
      return "I can guide you through the interactive map features! You can view desk occupancy, room availability, and even track equipment issues like the AV problem in Conference Room B. What would you like to explore on the map?";
    }

    if (input.includes("notification") || input.includes("alert")) {
      return "I help manage your notifications and alerts. You can see new to-dos, system updates, and urgent issues through the notification system. Would you like me to explain how to prioritize or manage your alerts?";
    }

    if (input.includes("help") || input.includes("how")) {
      return "I'm here to help with any Robin workplace management questions! I can assist with:\n\n• Seat assignments and approvals\n• Ticket workflows and automation\n��� Map navigation and room booking\n• Dashboard insights and to-dos\n• System notifications and alerts\n\nWhat specific area would you like guidance on?";
    }

    return "Thanks for your question! I'm designed to help with Robin workplace management tasks. I can assist with seat assignments, ticket workflows, map navigation, and dashboard management. Could you tell me more about what you'd like help with?";
  };

  // Get page-specific suggested prompts for AI assistant intro screen
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format relative time for chat history
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  const containerClass = isEmbedded
    ? "h-full w-full flex flex-col"
    : "fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col";

  // Show chat history view
  if (showChatHistory) {
    return (
      <div className={containerClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToChat}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              Chat History
            </h2>
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faX} className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {normalizedChatHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No previous chats</p>
              </div>
            ) : (
              normalizedChatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleLoadChat(chat)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-sm text-gray-900 line-clamp-2">
                      {chat.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {chat.messages.length} message
                        {chat.messages.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(chat.updatedAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Helper function to render message content with clickable links
  const parseMessageContent = (
    content: string
  ): (string | React.ReactElement)[] | string => {
    // Match markdown-style links: [text](#anchor) or [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkHref = match[2];

      // Handle ticket links
      if (linkHref === "#ticket") {
        parts.push(
          <button
            key={match.index}
            onClick={() => {
              if (onNavigateToTicket) {
                // Use the linkText as the ticket ID (it contains the actual ticket number like SRV-123456)
                onNavigateToTicket(linkText);
              }
            }}
            className="text-[#2774C1] hover:underline cursor-pointer inline"
          >
            {linkText}
          </button>
        );
      } else {
        // Regular links
        parts.push(
          <a
            key={match.index}
            href={linkHref}
            className="text-[#2774C1] hover:underline"
            target={linkHref.startsWith("http") ? "_blank" : undefined}
            rel={
              linkHref.startsWith("http") ? "noopener noreferrer" : undefined
            }
          >
            {linkText}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    // If no links found, return original content
    return parts.length === 0 ? content : parts;
  };

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">
            Robin AI Assistant
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          {hasStartedChat && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Start new chat"
            >
              <FontAwesomeIcon icon={faRotateRight} className="h-4 w-4" />
            </Button>
          )}
          {shouldShowHistoryButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowChatHistory}
              className="h-8 w-8 p-0 hover:bg-gray-100"
              title="Chat history"
            >
              <FontAwesomeIcon icon={faBars} className="h-4 w-4" />
            </Button>
          )}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faX} className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {messages.length === 0 && !hasStartedChatRef.current ? (
        /* Intro Mode */
        <>
          {/* Welcome Content */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="box-border content-stretch flex flex-col gap-4 items-center justify-center p-4 relative w-full">
              {/* Welcome Message */}
              <div className="relative rounded-bl-lg rounded-br-lg rounded-tl-sm rounded-tr-lg shrink-0 w-full">
                <div className="relative size-full">
                  <div className="box-border content-stretch flex gap-4 items-start pl-4 pr-4 py-3 relative w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[8px] mb-4">
                    {/* Robin Avatar */}
                    <div className="w-[46px] h-[46px] shrink-0">
                      <Avatar />
                    </div>

                    {/* Welcome Text */}
                    <div className="basis-0 content-stretch flex flex-col gap-2 grow items-start min-h-px min-w-px relative shrink-0">
                      <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                        <div className="basis-0 flex flex-col font-medium grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1c1c1c] text-[18px]">
                          <p className="leading-[26px]">
                            I'm Robin, your AI Assistant
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1c1c1c] text-[14px] w-full">
                        <p className="leading-[22px]">
                          I can help you manage your events and spaces.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="content-stretch flex flex-col gap-2 items-start relative shrink-0 w-full">
                <div className="flex flex-col font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6c6c6c] text-[14px] w-full">
                  <p className="leading-[22px]">I want to...</p>
                </div>

                <div className="content-stretch flex flex-col gap-3 items-start relative shrink-0 w-full">
                  {getPageSpecificPrompts(currentPage).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="bg-white relative rounded-lg shrink-0 w-full hover:bg-gray-50 transition-colors"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute border border-[#f0f0f0] border-solid inset-0 pointer-events-none rounded-lg"
                      />
                      <div className="relative size-full">
                        <div className="box-border content-stretch flex gap-3 items-start px-4 py-3 relative w-full">
                          <div className="flex-shrink-0 mt-[2px]">
                            <FontAwesomeIcon
                              icon={prompt.icon}
                              className="h-4 w-4 text-primary"
                            />
                          </div>
                          <div className="basis-0 flex flex-col font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1c1c1c] text-[14px]">
                            <div className="flex items-center gap-2">
                              <p className="leading-[22px]">{prompt.text}</p>
                              {prompt.isNew && (
                                <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 h-4 leading-[16px]">
                                  NEW
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Input Area - Always visible */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Robin..."
                className="w-full resize-none pr-14"
                rows={2}
              />
              <Button
                onClick={() => handleSendMessage()}
                className="absolute right-2 bottom-2 h-10 w-10 p-0 flex-shrink-0"
                disabled={!inputValue.trim()}
              >
                <FontAwesomeIcon
                  icon={faMagicWandSparkles}
                  className="h-4 w-4"
                />
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Chat Mode */
        <>
          {/* Messages Area */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
            {(() => {
              // Group messages into turns (user message + following assistant messages)
              const turns: Message[][] = [];
              let currentTurn: Message[] = [];

              messages.forEach((message) => {
                if (message.sender === "user") {
                  // Start a new turn
                  if (currentTurn.length > 0) {
                    turns.push(currentTurn);
                  }
                  currentTurn = [message];
                } else {
                  // Add to current turn
                  currentTurn.push(message);
                }
              });

              // Add the last turn
              if (currentTurn.length > 0) {
                turns.push(currentTurn);
              }

              return turns.map((turn, turnIndex) => {
                const isCurrentTurn = turnIndex === turns.length - 1;

                return (
                  <div
                    key={turn[0].id}
                    className="space-y-4 pb-4"
                    style={{
                      minHeight:
                        isCurrentTurn && isCurrentTurnFullHeight
                          ? "100%"
                          : undefined,
                      display:
                        isCurrentTurn && isCurrentTurnFullHeight
                          ? "flex"
                          : undefined,
                      flexDirection:
                        isCurrentTurn && isCurrentTurnFullHeight
                          ? "column"
                          : undefined,
                      justifyContent:
                        isCurrentTurn && isCurrentTurnFullHeight
                          ? "flex-start"
                          : undefined,
                    }}
                  >
                    {turn.map((message) => (
                      <div key={message.id} className="flex flex-col space-y-3">
                        <div
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start items-start gap-2"
                          }`}
                          onMouseEnter={() =>
                            message.sender === "user" &&
                            setHoveredMessageId(message.id)
                          }
                          onMouseLeave={() =>
                            message.sender === "user" &&
                            setHoveredMessageId(null)
                          }
                        >
                          {/* Edit button - appears on hover to the left of user messages */}
                          {message.sender === "user" &&
                            hoveredMessageId === message.id &&
                            editingMessageId !== message.id && (
                              <button
                                onClick={() => handleEditMessage(message.id)}
                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors mt-3"
                                title="Edit message"
                              >
                                <FontAwesomeIcon
                                  icon={faPencil}
                                  className="w-3.5 h-3.5"
                                />
                              </button>
                            )}

                          {/* AI Avatar - only for assistant messages (not for thinking messages) */}
                          {message.sender === "assistant" &&
                            !message.isThinking && (
                              <div className="w-8 h-8 flex-shrink-0 mt-1">
                                {message.agentType === "ezcater" ? (
                                  <EzCaterAvatar />
                                ) : (
                                  <Avatar />
                                )}
                              </div>
                            )}

                          {/* Message Content */}
                          <div className="flex flex-col space-y-1 max-w-[320px]">
                            {/* Agent Label - shown above bubble */}
                            {message.sender === "assistant" &&
                              !message.isThinking && (
                                <div className="text-gray-900">
                                  {message.agentType === "ezcater"
                                    ? "ezCater Agent"
                                    : "Robin AI Assistant"}
                                </div>
                              )}

                            {/* Message bubble or thinking content wrapper */}
                            <div className="flex flex-col space-y-3">
                              {/* Thinking Message */}
                              {message.isThinking ? (
                                <div className="flex flex-col space-y-2">
                                  <button
                                    onClick={() =>
                                      toggleThinkingExpansion(message.id)
                                    }
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                                  >
                                    {expandedThinking.has(message.id) ? (
                                      <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="h-4 w-4"
                                      />
                                    ) : (
                                      <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className="h-4 w-4"
                                      />
                                    )}
                                    <span
                                      className={`text-sm ${
                                        thinkingProgress[message.id]
                                          ?.isComplete || message.isPaused
                                          ? ""
                                          : "italic"
                                      }`}
                                    >
                                      {message.isPaused
                                        ? "Paused"
                                        : thinkingProgress[message.id]
                                            ?.isComplete
                                        ? "See thinking"
                                        : message.content}
                                    </span>
                                    {!thinkingProgress[message.id]
                                      ?.isComplete &&
                                      !message.isPaused && (
                                        <FontAwesomeIcon
                                          icon={faSpinner}
                                          className="h-4 w-4 animate-spin text-gray-400"
                                        />
                                      )}
                                  </button>
                                  {expandedThinking.has(message.id) && (
                                    <div className="mt-2 ml-6">
                                      <div className="relative p-[0px]">
                                        {/* Thinking steps */}
                                        <div className="space-y-3">
                                          {message.thinkingText &&
                                            thinkingProgress[message.id] &&
                                            (() => {
                                              const allLines =
                                                message.thinkingText
                                                  .split("\n")
                                                  .filter((line) => line.trim())
                                                  .slice(
                                                    0,
                                                    thinkingProgress[message.id]
                                                      .visibleLines
                                                  );

                                              // Parse lines into hierarchical structure
                                              // Lines starting with "• " are main steps (with green dots)
                                              // Lines starting with "  • " are nested bulleted items (with bullets, no green dots)
                                              // Lines starting with "  " (two spaces, not followed by •) are nested plain text (no bullets, no green dots)
                                              // Lines with no prefix are main steps without bullets (with green dots)
                                              const parsedSteps: Array<{
                                                main: string;
                                                hasBullet: boolean;
                                                nested: Array<{
                                                  text: string;
                                                  isBulleted: boolean;
                                                }>;
                                              }> = [];
                                              let currentStep: {
                                                main: string;
                                                hasBullet: boolean;
                                                nested: Array<{
                                                  text: string;
                                                  isBulleted: boolean;
                                                }>;
                                              } | null = null;

                                              allLines.forEach((line) => {
                                                if (line.startsWith("• ")) {
                                                  // Main step with bullet
                                                  if (currentStep) {
                                                    parsedSteps.push(
                                                      currentStep
                                                    );
                                                  }
                                                  currentStep = {
                                                    main: line.substring(2),
                                                    hasBullet: true,
                                                    nested: [],
                                                  };
                                                } else if (
                                                  line.startsWith("  • ")
                                                ) {
                                                  // Nested bulleted item
                                                  if (currentStep) {
                                                    currentStep.nested.push({
                                                      text: line.substring(4),
                                                      isBulleted: true,
                                                    });
                                                  }
                                                } else if (
                                                  line.startsWith("  ")
                                                ) {
                                                  // Nested plain text
                                                  if (currentStep) {
                                                    currentStep.nested.push({
                                                      text: line.trim(),
                                                      isBulleted: false,
                                                    });
                                                  }
                                                } else {
                                                  // Main step without bullet
                                                  if (currentStep) {
                                                    parsedSteps.push(
                                                      currentStep
                                                    );
                                                  }
                                                  currentStep = {
                                                    main: line,
                                                    hasBullet: false,
                                                    nested: [],
                                                  };
                                                }
                                              });

                                              if (currentStep) {
                                                parsedSteps.push(currentStep);
                                              }

                                              // Calculate line height for the green connector
                                              // The line should go from the center of the first dot to the center of the last dot
                                              let lineHeight = 0;
                                              if (parsedSteps.length > 1) {
                                                // For each step except the last, calculate total height
                                                for (
                                                  let i = 0;
                                                  i < parsedSteps.length - 1;
                                                  i++
                                                ) {
                                                  const step = parsedSteps[i];
                                                  // Main step container height: 20px (leading-[20px])
                                                  lineHeight += 20;
                                                  // If there are nested items, add their total height
                                                  if (step.nested.length > 0) {
                                                    // Gap from main to first nested (space-y-1 = 4px)
                                                    lineHeight += 4;
                                                    // Each nested item: 20px, plus gaps between them (space-y-1 = 4px each)
                                                    lineHeight +=
                                                      step.nested.length * 20 +
                                                      (step.nested.length - 1) *
                                                        4;
                                                  }
                                                  // Gap between step containers (space-y-3 = 12px)
                                                  lineHeight += 12;
                                                }
                                                // Add the offset to reach the center of the last dot
                                                // The last dot has mt-[2px] and is 16px tall, so center is at 2px + 8px = 10px
                                                lineHeight += 10;
                                                // Add 3 extra pixels to make the line slightly taller
                                                lineHeight += 3;
                                              }

                                              return (
                                                <>
                                                  {/* Green vertical line - absolutely positioned behind dots */}
                                                  {lineHeight > 0 && (
                                                    <div
                                                      className="absolute left-[7px] top-[10px] w-[2px] bg-[#72B433]"
                                                      style={{
                                                        height: `${lineHeight}px`,
                                                      }}
                                                    />
                                                  )}

                                                  {parsedSteps.map(
                                                    (step, index) => (
                                                      <div
                                                        key={index}
                                                        className="space-y-1"
                                                      >
                                                        {/* Main step with green dot */}
                                                        <div className="flex items-start gap-3 relative">
                                                          {/* Green circle with checkmark - z-10 to appear above line */}
                                                          <div className="relative flex-shrink-0 w-4 h-4 mt-[2px] z-10">
                                                            <div className="w-full h-full bg-[#72B433] rounded-full flex items-center justify-center">
                                                              <svg
                                                                width="10"
                                                                height="8"
                                                                viewBox="0 0 10 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                              >
                                                                <path
                                                                  d="M1 4L3.5 6.5L9 1"
                                                                  stroke="white"
                                                                  strokeWidth="1.5"
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                />
                                                              </svg>
                                                            </div>
                                                          </div>

                                                          {/* Main step text */}
                                                          <div className="text-[12px] font-normal text-[#6c6c6c] leading-[20px] flex-1">
                                                            {step.main}
                                                          </div>
                                                        </div>

                                                        {/* Nested items */}
                                                        {step.nested.length >
                                                          0 && (
                                                          <div className="ml-[28px] space-y-1">
                                                            {step.nested.map(
                                                              (
                                                                nested,
                                                                nestedIndex
                                                              ) => {
                                                                // Check if this is the room list placeholder
                                                                if (
                                                                  nested.text ===
                                                                    "[ROOM_LIST]" &&
                                                                  message.thinkingRoomData
                                                                ) {
                                                                  return (
                                                                    <div
                                                                      key={
                                                                        nestedIndex
                                                                      }
                                                                    >
                                                                      <ThinkingRoomList
                                                                        goodFitRooms={
                                                                          message
                                                                            .thinkingRoomData
                                                                            .goodFitRooms
                                                                        }
                                                                        poorFitRooms={
                                                                          message
                                                                            .thinkingRoomData
                                                                            .poorFitRooms
                                                                        }
                                                                      />
                                                                    </div>
                                                                  );
                                                                }

                                                                return (
                                                                  <div
                                                                    key={
                                                                      nestedIndex
                                                                    }
                                                                    className="flex items-start gap-2 text-[12px] font-normal text-[#6c6c6c] leading-[20px]"
                                                                  >
                                                                    {nested.isBulleted && (
                                                                      <span className="flex-shrink-0">
                                                                        •
                                                                      </span>
                                                                    )}
                                                                    <span
                                                                      className={
                                                                        nested.isBulleted
                                                                          ? ""
                                                                          : "block"
                                                                      }
                                                                    >
                                                                      {
                                                                        nested.text
                                                                      }
                                                                    </span>
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                        )}
                                                      </div>
                                                    )
                                                  )}
                                                </>
                                              );
                                            })()}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : /* Regular Message Bubble or Edit Mode */
                              editingMessageId === message.id ? (
                                /* Editing Mode */
                                <div className="w-full max-w-[320px] space-y-2">
                                  <Textarea
                                    value={editedContent}
                                    onChange={(e) =>
                                      setEditedContent(e.target.value)
                                    }
                                    className="w-full resize-none"
                                    rows={3}
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSaveEditedMessage();
                                      } else if (e.key === "Escape") {
                                        handleCancelEdit();
                                      }
                                    }}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                      className="h-8"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={handleSaveEditedMessage}
                                      disabled={!editedContent.trim()}
                                      className="h-8"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="w-3 h-3 mr-1.5"
                                      />
                                      Save & Regenerate
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                /* Regular Message Bubble */
                                <div
                                  className={`rounded-[8px] ${
                                    message.sender === "user"
                                      ? "bg-white border border-gray-200 px-4 py-3"
                                      : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-3"
                                  }`}
                                >
                                  {/* Bouncing dots animation - only show if message hasn't completed AND is still typing */}
                                  {message.sender === "assistant" &&
                                  message.isTyping &&
                                  !completedTypingMessages.current.has(
                                    message.id
                                  ) &&
                                  message.typedContent === undefined ? (
                                    <div className="typing-dots py-1">
                                      <div className="typing-dot"></div>
                                      <div className="typing-dot"></div>
                                      <div className="typing-dot"></div>
                                    </div>
                                  ) : (
                                    /* Message content with typewriter effect or full content */
                                    <div
                                      className={`text-sm whitespace-pre-wrap leading-[22px] ${
                                        message.sender === "user"
                                          ? "text-gray-900"
                                          : "text-[#1c1c1c]"
                                      }`}
                                    >
                                      {message.typedContent !== undefined
                                        ? parseMessageContent(
                                            message.typedContent
                                          )
                                        : parseMessageContent(message.content)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Room Suggestions - Full Width */}
                        {message.sender === "assistant" &&
                          message.showRoomSuggestions &&
                          message.meetingRequirements && (
                            <RoomBookingSuggestions
                              meetingRequirements={message.meetingRequirements}
                              rooms={rooms || []}
                              onSelectRoom={handleSelectRoom}
                              onHighlightRoom={handleHighlightRoom}
                              onAiMeetingPreviewUpdate={
                                onAiMeetingPreviewUpdate
                              }
                              onCancel={handleCancelRoomSuggestions}
                              onAddDetails={onAddDetails}
                              className="w-full"
                            />
                          )}

                        {/* Cuisine Options - Full Width */}
                        {message.sender === "assistant" &&
                          message.showCuisineOptions && (
                            <div className="w-full mt-3">
                              <CuisineOptionsCard
                                onSelectCuisine={handleCuisineSelect}
                              />
                            </div>
                          )}

                        {/* Catering Options - Full Width */}
                        {message.sender === "assistant" &&
                          message.showCateringOptions &&
                          message.cateringItems && (
                            <div className="w-full mt-3">
                              <CateringOptionsCard
                                items={message.cateringItems}
                                onSelectRestaurant={handleRestaurantSelect}
                              />
                            </div>
                          )}

                        {/* Catering Menu - Full Width */}
                        {message.sender === "assistant" &&
                          message.showCateringMenu &&
                          message.menuItems &&
                          message.restaurantName && (
                            <div className="w-full mt-3">
                              <CateringMenuCard
                                restaurantName={message.restaurantName}
                                items={message.menuItems}
                                onConfirmOrder={(items) =>
                                  handleConfirmMenuOrder(
                                    items,
                                    message.restaurantName!
                                  )
                                }
                              />
                            </div>
                          )}

                        {/* Meeting List Widget - Full Width */}
                        {message.sender === "assistant" &&
                          message.showMeetingListWidget &&
                          (() => {
                            // Get next 5 upcoming meetings
                            const now = new Date();
                            const currentHour =
                              now.getHours() + now.getMinutes() / 60;

                            const upcomingMeetings: Array<{
                              meeting: Meeting;
                              room: Room;
                            }> = [];

                            rooms.forEach((room) => {
                              room.meetings.forEach((meeting) => {
                                if (meeting.startTime >= currentHour) {
                                  upcomingMeetings.push({ meeting, room });
                                }
                              });
                            });

                            // Sort by start time and take first 5
                            upcomingMeetings.sort(
                              (a, b) =>
                                a.meeting.startTime - b.meeting.startTime
                            );
                            const nextFiveMeetings = upcomingMeetings.slice(
                              0,
                              5
                            );

                            return nextFiveMeetings.length > 0 ? (
                              <div className="w-full mt-3">
                                <MeetingListWidget
                                  meetings={nextFiveMeetings}
                                  onSelectMeeting={
                                    handleMeetingSelectFromWidget
                                  }
                                />
                              </div>
                            ) : null;
                          })()}
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </div>

          {/* Input Area with integrated Catering Order Preview */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            {/* Catering Order Preview - shown when ezCater agent is active and order not yet submitted */}
            {messages.some((m) => m.agentType === "ezcater") &&
              !cateringOrderSubmitted &&
              (() => {
                // Get available menu items from the most recent menu message
                const menuMessage = messages
                  .slice()
                  .reverse()
                  .find((m) => m.showCateringMenu && m.menuItems);
                const availableMenuItems =
                  menuMessage?.menuItems?.map((item) => ({
                    ...item,
                    id: item.id || item.name,
                  })) || [];

                return (
                  <div className="border border-[#868686] rounded-t-lg border-b-0 overflow-hidden bg-white mb-0">
                    <CateringOrderPreview
                      orderDetails={cateringOrderDetails}
                      isOpen={isCateringPreviewOpen}
                      onToggle={() =>
                        setIsCateringPreviewOpen(!isCateringPreviewOpen)
                      }
                      onCancel={handleCancelCateringOrder}
                      onSubmit={handleSubmitCateringOrder}
                      ticketNumber={cateringTicketNumber}
                      onUpdateQuantity={handleUpdateCateringQuantity}
                      onRemoveItem={handleRemoveCateringItem}
                      onAddItem={handleAddCateringItem}
                      availableMenuItems={availableMenuItems}
                    />
                  </div>
                );
              })()}

            {/* Sender Input */}
            <div
              className="relative"
              style={{
                borderTopLeftRadius:
                  messages.some((m) => m.agentType === "ezcater") &&
                  !cateringOrderSubmitted
                    ? "0"
                    : undefined,
                borderTopRightRadius:
                  messages.some((m) => m.agentType === "ezcater") &&
                  !cateringOrderSubmitted
                    ? "0"
                    : undefined,
              }}
            >
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Robin..."
                className="w-full resize-none pr-14"
                rows={2}
              />
              <Button
                onClick={() => handleSendMessage()}
                className="absolute right-2 bottom-2 h-10 w-10 p-0 flex-shrink-0"
                disabled={!inputValue.trim()}
              >
                <FontAwesomeIcon
                  icon={faMagicWandSparkles}
                  className="h-4 w-4"
                />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
