# Robin Workplace Management - Project Guidelines

## Project Overview

This is a comprehensive workplace management application focused on meeting room booking, scheduling, and workspace coordination. The application features an AI assistant, real-time room availability, meeting management, and a multi-view navigation system.

**Project Origin**: This project was imported from another Figma Make project and includes Figma-imported components in the `/imports` directory.

## ⚡ Code Optimization (January 2025)

**New shared files created to eliminate duplication:**
- `/types/index.ts` - Shared type definitions (Meeting, Room, Message, etc.)
- `/constants/index.ts` - Shared constants (page titles, time windows, amenities, etc.)
- `/utils/index.ts` - Shared utility functions (filtering, formatting, calculations, etc.)

**For new code**: Use these shared files instead of duplicating types/logic.  
**For existing code**: Gradually migrate components as you modify them.  
**See**: `/OPTIMIZATION_SUMMARY.md` and `/MIGRATION_EXAMPLE.md` for details.

## Architecture

### Application Structure

The application uses a **centralized state management pattern** with App.tsx as the single source of truth. State is passed down through props (prop drilling pattern) to maintain clear data flow and component relationships.

#### Key Architecture Decisions:

1. **Single Entry Point**: `/App.tsx` manages all global state and coordinates between views
2. **Two Main Layout Components**:
   - `PageLayout.tsx` - Default shell for most views
   - `MeetingSpacesPage.tsx` - Specialized layout for the meeting spaces view
3. **Sidebar System**: Multiple contextual sidebars managed through a state machine pattern
4. **View-Based Navigation**: 40+ different views with conditional rendering
5. **Figma Imports**: Reusable Figma-imported components stored in `/imports` directory

### State Management Pattern

All state lives in App.tsx and flows down through props:

```typescript
// State categories in App.tsx:
- Navigation state (currentView, pendingNavigation)
- AI Assistant state (messages, chat history, current chat)
- Sidebar state (type, open/closed, context)
- Meeting data (rooms, meetings, filters)
- UI state (spotlightMyEvents, compactView, notifications, pinnedRoomIds)
- Preview state (aiMeetingPreview, highlightedRoomId)
- Time window state (timeWindowStart, meetingSpacesViewMode)
```

**Key Pattern**: Parent component owns state, child components receive:
- Data via props
- Update callbacks via `onEventName` props
- No local state for shared data

## Component System

### Core Components

Located in `/components`:

#### Layout Components:
- **PageLayout.tsx** - Default shell for most views (dashboard, tickets, map, analytics, settings, etc.)
- **MeetingSpacesPage.tsx** - Specialized layout for meeting spaces view with calendar grid
- **GlobalTabs.tsx** - Reusable tab navigation component used in page headers

#### Sidebar Components:
- **AiAssistantSidebar.tsx** - AI chat interface with room booking capabilities
- **MeetingDetailsSidebar.tsx** - View/edit meeting information
- **MeetingCreationSidebar.tsx** - Create new meetings with form
- **FiltersSidebar.tsx** - Meeting room filters (capacity, amenities, types)
- **RoomDetailsSidebar.tsx** - Room information and availability calendar
- **MapFloorSidebar.tsx** - Floor selection and settings for map view

#### Supporting Components:
- **NotificationsPopover.tsx** - Notification dropdown with read/unread tracking
- **RoomBookingSuggestions.tsx** - AI room suggestion cards with preview capability
- **RoomPreviewPopover.tsx** - Hover preview for room details
- **EditMeetingForm.tsx** - Inline form for editing meeting details
- **ResourceCenter.tsx** - Draggable help/resource panel (bottom right)

### Figma-Imported Components

Located in `/imports`:

These are components imported from Figma designs that are actively used in the application:

- **Avatar.tsx** - User avatar with logo (used in AiAssistantSidebar)
- **svg-2f9yr5tjal.ts** - SVG path data for Avatar component
- **svg-2zju4fq6lg.ts** - SVG path data used in AiAssistantSidebar
- **svg-lb4i9w2xwv.ts** - SVG path data for success toast icons (used in sonner.tsx)
- **svg-qkb7ffmkcm.ts** - SVG path data used in RoomBookingSuggestions

**Usage Pattern**:
```typescript
import Avatar from '../imports/Avatar';
import svgPaths from '../imports/svg-2zju4fq6lg';

// In sonner.tsx:
import svgPaths from "../../imports/svg-lb4i9w2xwv";
```

### Sidebar Architecture

The application uses a **sidebar state machine** with six possible states:

```typescript
type SidebarType = 
  | 'none' 
  | 'ai-assistant' 
  | 'meeting-details' 
  | 'create-meeting' 
  | 'filters' 
  | 'room-details';
```

#### Sidebar Coordination Rules:

- Only ONE sidebar visible at a time
- AI assistant can persist across navigation when explicitly kept open
- Sidebar state changes trigger cleanup of related state
- Navigation context tracking for back button functionality (e.g., room details → back to meeting details)

### Component Communication Patterns

#### Pattern 1: Callback Props
```typescript
// Parent provides callback
onSidebarStateChange={(type) => setSidebarState(type)}

// Child calls callback
onSidebarStateChange('meeting-details')
```

#### Pattern 2: State + Callback Pairs
```typescript
// Parent provides current state + updater
spotlightMyEvents={spotlightMyEvents}
onSpotlightMyEventsChange={setSpotlightMyEvents}

// Child uses for controlled component pattern
```

#### Pattern 3: Complex Event Handlers
```typescript
// Parent provides handler with business logic
onEditMeeting={(meeting, selectedRooms) => {
  // Update rooms data
  // Show notifications
  // Clear related state
}}
```

## Styling System

### Tailwind v4 with CSS Variables

The project uses **Tailwind CSS v4** with a custom configuration via `@theme inline` in `styles/globals.css`.

#### Critical Styling Rules:

1. **DO NOT use font size classes** (`text-2xl`, `text-lg`, etc.)
   - Typography is handled via semantic HTML elements (h1, h2, p, etc.)
   - Custom typography system in `globals.css` applies styles automatically
   - **Exception**: You MAY use text size classes if you need to override the base typography

2. **DO NOT use font weight classes** (`font-bold`, `font-medium`, etc.)
   - Font weights defined via CSS variables (`--font-weight-medium`, `--font-weight-normal`)
   - Default weights applied to semantic elements
   - **Exception**: You MAY use weight classes if you need to override the base typography

3. **DO NOT use line-height classes** (`leading-tight`, etc.)
   - Line heights defined in typography system (default: 1.5)
   - **Exception**: You MAY use line-height classes if you need to override the base typography

4. **DO use color, spacing, and layout classes normally**

5. **IMPORTANT: Override default component styling**
   - Some Shadcn/UI base components have styling (gap, typography, spacing) baked in as defaults
   - Always explicitly set styling information from these guidelines in generated React code to override component defaults
   - Example: If a Card component has default padding, explicitly set `p-6` or `p-0` as needed

### Typography System

Semantic HTML elements automatically receive appropriate styling:

```css
/* globals.css base layer */
h1 { font-size: var(--text-2xl); font-weight: var(--font-weight-medium); line-height: 1.5; }
h2 { font-size: var(--text-xl); font-weight: var(--font-weight-medium); line-height: 1.5; }
h3 { font-size: var(--text-lg); font-weight: var(--font-weight-medium); line-height: 1.5; }
h4 { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
p  { font-size: var(--text-base); font-weight: var(--font-weight-normal); line-height: 1.5; }
label { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
button { font-size: var(--text-base); font-weight: var(--font-weight-medium); line-height: 1.5; }
input { font-size: var(--text-base); font-weight: var(--font-weight-normal); line-height: 1.5; }
```

**Note**: Typography styles are NOT applied if an element has an ancestor with Tailwind text classes.

### Custom Utilities

Available custom utilities in `globals.css`:

```css
.scrollbar-hide          /* Hide scrollbars across browsers */
.scrollbar-overlay       /* macOS-style overlay scrollbar (shows on hover) */
.grid-cols-21           /* 21-column grid for time slots */
.grid-cols-22           /* 22-column grid for time slots + label */
.skeleton-ripple        /* Animated loading skeleton with blue gradient */
.toast-alert-custom     /* Custom toast notification styles */
.toast-alert-success    /* Success toast styling (green) */
.toast-alert-title      /* Toast text styling */
.toast-alert-close      /* Toast close button */
.office-closed          /* Diagonal stripe pattern for closed hours */
```

### Color System

Uses CSS variables for theming with light/dark mode support:

```css
/* Light mode (default) */
--primary: #db2777          /* Pink primary color */
--background: #ffffff       /* Light mode background */
--foreground: oklch(...)    /* OKLCH color space for smooth gradients */
--muted: #ececf0           /* Muted backgrounds */
--border: rgba(0,0,0,0.1)  /* Subtle borders */
--input-background: #f3f3f5 /* Input field backgrounds */
--gray-border: #D6D6D6     /* Gray borders (common in UI) */
--destructive: #d4183d     /* Red for delete actions */
```

**Font**: Custom font family "Brown LL" with system fallbacks.

**Focus States**: Gray-bordered elements automatically get blue focus border (`--focus-border: #3b82f6`).

**Disabled States**: Primary/pink buttons when disabled get gray background and border.

## Technical Conventions

### Imports

#### UI Components (Shadcn):
```typescript
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
```

#### Icons (Font Awesome - Primary Icon Library):
```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapPin, faUsers, faCog, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';

// Usage
<FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
<FontAwesomeIcon icon={faMagicWandSparkles} />
```

**Icon Library**: **Always use Font Awesome for all icons** in the application (except for a few Shadcn UI components that use Lucide internally).

- **Solid icons**: `@fortawesome/free-solid-svg-icons` (primary choice)
- **Regular icons**: `@fortawesome/free-regular-svg-icons` (when needed)

**Icon Naming Convention**: Font Awesome uses `fa` prefix with camelCase (e.g., `faCalendar`, `faChartLine`, `faTableCells`)

**Common Icon Mappings**:
- Navigation: `faCity`, `faChartLine`, `faTableCells`, `faCalendar`, `faUsers`, `faMapMarkerAlt`
- Actions: `faPlus`, `faPencil`, `faTrash`, `faX`, `faCheck`, `faSpinner`
- UI: `faBars`, `faChevronDown`, `faChevronRight`, `faChevronLeft`, `faEllipsisVertical`
- Features: `faDesktop`, `faTv`, `faWifi`, `faVolumeUp`, `faDoorOpen`, `faLock`
- AI/Magic: `faMagicWandSparkles`, `faWandSparkles`, `faCompass`
- Status: `faCircleCheck`, `faCircleXmark`, `faExclamationTriangle`, `faCircleInfo`

#### Lucide Icons (Only in specific Shadcn components):
```typescript
// Only used internally in some UI components
import { XIcon } from "lucide-react@0.487.0"; // sheet.tsx
import { GripVerticalIcon } from "lucide-react@0.487.0"; // resizable.tsx
import { ChevronDownIcon } from "lucide-react@0.487.0"; // navigation-menu.tsx
```

**Do not add new Lucide icons** - use Font Awesome for all new icon needs.

#### Figma Imports:
```typescript
// Components
import Avatar from '../imports/Avatar';

// SVG paths (specific to each use case)
import svgPaths from '../imports/svg-lb4i9w2xwv';  // For toast icons
import svgPaths from '../imports/svg-2zju4fq6lg';  // For AI assistant
import svgPaths from '../imports/svg-qkb7ffmkcm';  // For room booking suggestions
```

#### Images:
```typescript
// For new images (not from Figma)
import { ImageWithFallback } from './figma/ImageWithFallback';

// Usage
<ImageWithFallback src="/path/to/image.jpg" alt="Description" className="w-full h-48 object-cover" />
```

#### Radix UI Primitives (when needed):
```typescript
import * as TooltipPrimitive from '@radix-ui/react-tooltip@1.1.8';
import * as SheetPrimitive from '@radix-ui/react-dialog@1.1.6';
```

#### Sonner Toast (version-specific):
```typescript
import { toast } from 'sonner@2.0.3';  // For toast() function
import { Toaster } from './components/ui/sonner';  // For UI component
```

### Naming Conventions

#### Components:
- PascalCase: `AiAssistantSidebar`, `MeetingSpacesPage`, `GlobalTabs`
- Descriptive names indicating purpose

#### Props:
- Callback props: `onEventName` (e.g., `onNavigate`, `onSidebarStateChange`)
- State props: noun or adjective (e.g., `currentView`, `isWorkplaceExpanded`)
- Data props: plural for arrays (e.g., `rooms`, `notifications`)

#### Functions:
- Event handlers: `handleEventName` (e.g., `handleNavigate`, `handleDeleteMeeting`)
- Utilities: verb-noun (e.g., `getFilteredRooms`, `generateChatTitle`)
- Getters: `getPageTitle`, `getRoomType`

#### State Variables:
```typescript
const [stateValue, setStateValue] = useState(...)
const [isCondition, setIsCondition] = useState(false)
const [hasFeature, setHasFeature] = useState(false)
```

### Type Definitions

**UPDATED (January 2025)**: Shared types are now centralized in `/types/index.ts` to eliminate duplication.

**For new code**: Import from `/types/index.ts`
```typescript
import { View, SidebarType, Meeting, Room, Message } from '../types';
```

**For existing code**: Types are currently defined inline at the top of App.tsx and re-declared in components. Gradually migrate to use shared types from `/types/index.ts` as you modify components.

**Legacy pattern** (being phased out):
```typescript
// App.tsx
type View = 'dashboard' | 'tickets' | 'map' | 'meeting-spaces' | 'my-schedule' | ...;
type SidebarType = 'none' | 'ai-assistant' | 'meeting-details' | ...;

// Components redeclare if needed
interface Message { ... }  // Repeated in components that use messages
interface Room { ... }     // Repeated in components that use rooms
```

### File Organization

```
/App.tsx                          # Main application entry point
/types/                           # ⚡ NEW: Shared type definitions
  └── index.ts                    # Meeting, Room, Message, etc.
/constants/                       # ⚡ NEW: Shared constants
  └── index.ts                    # Page titles, time windows, amenities, etc.
/utils/                           # ⚡ NEW: Shared utility functions
  └── index.ts                    # Filtering, formatting, calculations, etc.
/components/
  ├── PageLayout.tsx              # Default page shell
  ├── MeetingSpacesPage.tsx       # Meeting spaces specialized layout
  ├── GlobalTabs.tsx              # Reusable tab navigation
  ├── AiAssistantSidebar.tsx      # AI chat sidebar
  ├── MeetingDetailsSidebar.tsx   # Meeting details sidebar
  ├── MeetingCreationSidebar.tsx  # Create meeting sidebar
  ├── RoomDetailsSidebar.tsx      # Room details sidebar
  ├── FiltersSidebar.tsx          # Filters sidebar
  ├── MapFloorSidebar.tsx         # Map floor selection sidebar
  ├── NotificationsPopover.tsx    # Notifications dropdown
  ├── RoomBookingSuggestions.tsx  # AI room suggestions UI
  ├── RoomPreviewPopover.tsx      # Room hover preview
  ├── EditMeetingForm.tsx         # Meeting edit form
  ├── ResourceCenter.tsx          # Draggable resource panel
  ├── figma/
  │   └── ImageWithFallback.tsx   # Image component with fallback
  └── ui/                         # Shadcn UI components
/imports/                         # Figma-imported components/assets
  ├── Avatar.tsx                  # User avatar component
  ├── svg-2f9yr5tjal.ts           # SVG paths for Avatar
  ├── svg-2zju4fq6lg.ts           # SVG paths for AI assistant
  ├── svg-lb4i9w2xwv.ts           # SVG paths for toast icons
  └── svg-qkb7ffmkcm.ts           # SVG paths for room suggestions
/styles/
  └── globals.css                 # Tailwind v4 + custom styles
/guidelines/
  └── Guidelines.md               # This file
/OPTIMIZATION_SUMMARY.md          # ⚡ NEW: Optimization details
/MIGRATION_EXAMPLE.md             # ⚡ NEW: Migration examples
```

## Key Features Implementation

### AI Assistant Integration

The AI assistant uses a chat-based interface with persistent chat history:

#### Message Types:
```typescript
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  showRoomSuggestions?: boolean;      // Show room booking UI
  isThinking?: boolean;               // Show thinking animation
  thinkingText?: string;              // Current thinking phase text
  thinkingComplete?: boolean;         // Thinking animation done
  thinkingVisibleLines?: number;      // Number of visible thinking lines
  thinkingRoomData?: {                // Room analysis data
    goodFitRooms: Array<{ id: string; name: string; capacity: number; attendees: number }>;
    poorFitRooms: Array<{ id: string; name: string; capacity: number; attendees: number; reason: string }>;
  };
  meetingRequirements?: {             // Parsed meeting details
    title: string;
    attendees: number;
    duration: number;
    startTime: number;
    features: string[];
    type?: string;
  };
}
```

#### Chat Session Management:
- Auto-save messages to history
- Chat titles generated from first user message (truncated to 50 chars)
- Load previous conversations
- Start new chats (saves current to history)
- Chat history persists in state (not localStorage)

#### Room Suggestions Flow:
1. User sends meeting request
2. AI shows "thinking" animation with phases (analyzing, evaluating, preparing)
3. AI presents room suggestions (good fit vs poor fit)
4. User can preview rooms (yellow overlay on calendar)
5. User books room → confirmation message added
6. Meeting syncs to calendar with loading state (4 seconds)
7. Success toast appears after sync completes

### Meeting Management

#### Room Data Structure:
```typescript
interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  status: 'available' | 'occupied' | 'offline';
  features: string[];
  meetings: Meeting[];
  requestOnly?: boolean;  // Executive rooms requiring approval
}

interface Meeting {
  id: string;
  title: string;
  organizer: string;
  startTime: number;      // Hour as number (9.5 = 9:30am)
  duration: number;       // Hours (1.5 = 90 minutes)
  attendees: number;
  checkedIn?: boolean;    // Auto-checked in when current time >= startTime
  checkInTime?: number;   // Time when checked in
}
```

#### CRUD Operations:
- **Create**: Via AI suggestions, manual booking form, or quick add from calendar
- **Read**: Calendar view with time slots (day/week/month views)
- **Update**: Edit sidebar with room reassignment capability
- **Delete**: With confirmation dialog to prevent accidental deletion

#### Auto Check-In System:
- Runs every minute (setInterval in App.tsx)
- Automatically checks in meetings when current time >= startTime
- Prevents "no-show" meetings from blocking rooms
- Visual indicator on calendar for checked-in meetings

### Filtering System

Multi-criteria filtering for meeting rooms:

```typescript
interface MeetingRoomFilters {
  duration: string;           // 'any' | '0.5' | '1' | '2' | '4+'
  amenities: string[];        // ['Projector', 'Whiteboard', 'Video Conf', etc.]
  capacity: string;           // 'any' | '1-4' | '5-8' | '9-12' | '13+'
  types: string[];            // ['Conference Room', 'Huddle Room', 'Board Room', etc.]
  show: string;               // 'all' | 'available' | 'booked'
  onlyShowAvailable: boolean; // Toggle for currently available rooms only
}
```

**Filter Application**: Filters are applied at the room level in App.tsx via `getFilteredRooms()` function before passing to child components.

**Room Type Detection**: `getRoomType()` function infers type from room name and capacity.

### Time Window Management

The calendar supports three 11-hour time windows:

- **Morning/Evening**: 12am-11am (0-11 hours)
- **Standard Business**: 8am-7pm (8-19 hours) - **DEFAULT**
- **Evening/Late**: 1pm-12am (13-24 hours)

Navigation cycles through these windows with Previous/Next/Now buttons.

### View Modes

Meeting spaces supports three view modes:

- **Day View**: Hour-by-hour calendar grid (default)
- **Week View**: 7-day overview
- **Month View**: Monthly calendar with room selection

State managed via `meetingSpacesViewMode` and `selectedMonthViewRoom`.

### Pinning System

Rooms can be pinned to appear at the top of the list:

```typescript
const [pinnedRoomIds, setPinnedRoomIds] = useState<string[]>([]);

// Visual indicator: thumbtack icon
// Pinned rooms appear first, then unpinned rooms sorted normally
```

### Notification System

Simple notification array with read/unread tracking:

```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: string;       // ISO 8601 format
  read: boolean;
  action: string | null;   // Navigation target (e.g., 'view-tickets')
}
```

**Badge Indicator**: Red dot on notification icon when `hasUnreadNotifications` is true.

**Auto-Read**: Notifications marked read when popover closes.

## UI/UX Patterns

### Toast Notifications

Use sonner for user feedback:

```typescript
// Success (uses custom green alert styling)
toast.success('Meeting booked successfully!', { duration: 3000 });

// Error
toast.error('Failed to delete meeting');

// Info
toast.info('Meeting updated');
```

**Placement**: Always `<Toaster position="top-center" />` in App.tsx

**Custom Styling**: Success toasts use custom green alert design from Figma imports (svg-lb4i9w2xwv).

### Loading States

#### Skeleton Loading:
- Use during initial data fetch
- Custom `.skeleton-ripple` animation with blue gradient
- Example: Room cards in meeting spaces

#### Inline Loading:
```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

{isLoading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
```

#### Syncing Meetings:
- Track meeting IDs in `syncingMeetings` Set
- Show spinner icon (FontAwesome `faSpinner`) in calendar with `animate-spin` class
- Clear after 4 seconds + show success toast

### Confirmation Dialogs

Use AlertDialog for destructive actions:

```typescript
<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Action</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. Are you sure you want to delete this meeting?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleConfirm}
        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Navigation Warnings

When user has unsaved changes (e.g., pending meeting move):
1. Intercept navigation with `pendingNavigation` state
2. Show confirmation dialog with AlertDialog
3. On confirm: proceed with navigation + clear pending state
4. On cancel: stay on current view

### Hover Previews

Room details can be previewed on hover:

- **RoomPreviewPopover**: Shows room info in small popover
- Used in AI suggestions and calendar views
- Prevents need to open full sidebar for quick info

### Drag and Drop

Meeting drag-and-drop for rescheduling:

- Drag meetings between time slots and rooms
- Visual feedback during drag (opacity, outline)
- Confirmation required before finalizing move
- Prevents accidental rescheduling

## Performance Considerations

### State Updates

Avoid unnecessary re-renders:
- Use `useCallback` for functions passed as props
- Keep state updates batched where possible
- Clear state when component unmounts or sidebar closes
- Use Set for tracking (e.g., `syncingMeetings`)

### Filtered Data

Apply filters at parent level before passing to children:
```typescript
rooms={getFilteredRooms(rooms, activeFilters)}
allRooms={rooms}  // Pass unfiltered for context
```

This ensures child components always receive ready-to-render data.

### Preview State Management

AI meeting previews are:
- Created when hovering rooms in suggestions
- Cleared when booking confirmed
- Restored when reopening AI assistant (if chat has active suggestions)
- Tracked by chat ID to maintain across sidebar switches

### Time Updates

Current time tracking for filter updates:
- `currentTimeStamp` state updated every minute
- Triggers re-evaluation of "available now" filter
- Auto check-in system runs on same interval

## Common Patterns

### Opening a Sidebar

```typescript
// From parent
setSidebarState('meeting-details');
setSelectedMeetingDetails(meetingData);

// From child via callback
onSidebarStateChange('meeting-details');
```

### Creating a Meeting

```typescript
// 1. Set creation context
setMeetingCreationContext({ 
  roomId, 
  startTime, 
  title: 'Optional prefill',
  duration: 1,
  fromAiSuggestion: false 
});
setSidebarState('create-meeting');

// 2. User fills form in MeetingCreationSidebar

// 3. On save:
handleSaveNewMeeting(meetingData, selectedRooms);
```

### Deleting a Meeting

```typescript
// 1. Show confirmation dialog
// 2. On confirm:
handleDeleteMeeting(meetingId);
// Removes meeting from all rooms, clears related state
```

### AI Room Booking

```typescript
// 1. User sends request to AI
// 2. AI shows thinking animation (3 phases)
// 3. AI presents RoomBookingSuggestions component
// 4. User hovers room → preview appears (yellow overlay on calendar)
// 5. User clicks room → handleSelectRoom
// 6. Meeting added to room + syncing animation
// 7. After 4s: confirmation message + toast
```

### Pinning a Room

```typescript
// Toggle pin state
const handleTogglePin = (roomId: string) => {
  setPinnedRoomIds(prev => 
    prev.includes(roomId) 
      ? prev.filter(id => id !== roomId)
      : [...prev, roomId]
  );
};

// Render with pin indicator
<FontAwesomeIcon 
  icon={faThumbtack} 
  className={pinnedRoomIds.includes(room.id) ? 'text-primary' : 'text-gray-400'}
/>
```

## Extension Guidelines

### Adding a New View

1. Add view to `View` type in App.tsx (line 8)
2. Add title to `getPageTitle()` function (lines 47-95)
3. Add navigation item to sidebar in PageLayout (lines 150-300)
4. Render content in PageLayout's children or create specialized page

### Adding a New Sidebar

1. Add type to `SidebarType` (line 41)
2. Create sidebar component in `/components`
3. Add state for sidebar data in App.tsx
4. Add sidebar to both PageLayout and MeetingSpacesPage
5. Implement open/close handlers
6. Add to sidebar state machine logic

### Adding Filters

1. Add filter field to `MeetingRoomFilters` interface (lines 412-419)
2. Update `getFilteredRooms()` logic (lines 474-525)
3. Add UI control in FiltersSidebar
4. Connect to `activeFilters` state

### Adding Room Features

1. Add feature string to room's `features` array
2. Update room type detection in `getRoomType()` if needed (lines 528-546)
3. Add to FiltersSidebar amenities list
4. Update AI room suggestion logic if relevant
5. Add Font Awesome icon mapping if needed

### Using Figma Imports

The `/imports` directory contains Figma-imported assets that are actively used:

1. **Avatar component** - User avatar UI element
2. **SVG path files** - Contain path data for various icons and graphics

Import patterns:
```typescript
// Component
import Avatar from '../imports/Avatar';

// SVG paths (named exports from each file)
import svgPaths from '../imports/svg-lb4i9w2xwv';
```

**Note**: All unused Figma imports have been removed. Only actively used components remain.

## Testing Considerations

### Manual Testing Checklist

- [ ] Navigation between all views works
- [ ] Sidebars open/close correctly (only one at a time)
- [ ] AI assistant persists when toggled open
- [ ] Meeting CRUD operations work
- [ ] Filters apply correctly
- [ ] Notifications show/clear properly
- [ ] Toast notifications appear with correct styling
- [ ] Unsaved changes warning shows when navigating
- [ ] AI room previews highlight correctly
- [ ] Meeting sync animation completes (4 seconds)
- [ ] Auto check-in system works
- [ ] Pin/unpin rooms functionality
- [ ] Time window navigation cycles correctly
- [ ] View mode switching (day/week/month)
- [ ] Drag-and-drop meeting rescheduling

### Edge Cases to Test

- Opening sidebar while another is open
- Navigating with pending changes
- Booking multiple meetings in same room at same time
- Filtering to zero results
- Creating meeting via AI then editing it
- Deleting meeting that's currently being viewed
- Checking in to past meeting
- Pinning all rooms
- Switching timezones with active meetings
- Room details → back to meeting details flow

## Troubleshooting

### Common Issues

**Sidebar won't open:**
- Check if another sidebar is already open
- Verify sidebar state machine allows transition
- Check if data prop is set (e.g., `selectedMeetingDetails`)

**Filters not working:**
- Verify `getFilteredRooms()` is applied before passing to child
- Check filter state is updating correctly
- Ensure filter logic matches data structure
- Check if "only available" toggle is interfering

**AI suggestions not showing:**
- Check `showRoomSuggestions` flag on message
- Verify `meetingRequirements` is set correctly
- Check if RoomBookingSuggestions component is rendered
- Verify room data is passed correctly

**Typography not applying:**
- Ensure using semantic HTML (h1, h2, p, not div with text classes)
- Check globals.css typography rules are loaded
- Verify no parent has Tailwind text classes
- Check if component has default styling that needs overriding

**Icons not showing:**
- Verify Font Awesome import is correct
- Check icon name spelling (camelCase with `fa` prefix)
- Ensure icon is from `@fortawesome/free-solid-svg-icons`
- Check className includes sizing (e.g., `w-4 h-4`)

**Figma imports not working:**
- Check import path is correct (`../imports/` or `../../imports/`)
- Available imports: Avatar.tsx and 4 SVG path files (see File Organization section)
- Check SVG paths export as default object with path properties
- Avatar component is imported as default export

## Future Considerations

### Scalability

Current architecture works well for this app size but consider:
- State management library (Zustand, Redux) if state grows beyond current 40+ views
- React Query for server data fetching/caching
- Component lazy loading for code splitting (especially for specialized pages)
- Virtual scrolling for large room lists

### Accessibility

Current implementation has basic accessibility:
- Semantic HTML structure
- ARIA labels on some components
- Keyboard navigation in dialogs
- Focus states on interactive elements

**Improvements needed**:
- Full keyboard navigation for calendar (arrow keys, tab, enter)
- Screen reader announcements for state changes (meeting booked, filter applied)
- Focus management in sidebars (focus trap, return focus)
- ARIA live regions for dynamic content updates
- Better color contrast ratios in some areas

### Mobile Responsiveness

App is primarily desktop-focused. Mobile considerations:
- Responsive sidebar → bottom sheet or drawer on mobile
- Calendar → simplified view or swipe navigation
- Touch-friendly tap targets (min 44x44px)
- Simplified filters in mobile view
- Resource center as bottom-anchored button

### Data Persistence

Currently all data lives in component state (no backend):
- Consider localStorage for user preferences (theme, pinned rooms, timezone)
- IndexedDB for offline meeting data
- Backend integration for real-time sync across devices
- WebSocket for live updates to room availability

---

**Last Updated**: January 2025 (based on current project analysis)  
**Project Type**: Workplace Management Application (Robin-inspired)  
**Project Origin**: Imported from Figma Make project
