# Robin Workplace Management System

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the app in your browser (Vite will print the local URL, typically `http://localhost:5173`).

Preview deployed at: https://robinpowered.github.io/sched-agent-demo-ux/

A comprehensive workplace management application for meeting room booking, scheduling, workspace coordination, and AI-assisted resource management.

## Project Overview

This is a full-featured workplace management platform inspired by Robin, built with React and Tailwind CSS. The application provides:

- **Meeting Room Management** - Book, view, and manage meeting spaces
- **AI Assistant** - Intelligent room suggestions and booking assistance
- **Calendar Views** - Day, week, and month views with real-time availability
- **Workplace Coordination** - Dashboard, tickets, visitor management, and more
- **Advanced Filtering** - Search rooms by capacity, amenities, and availability
- **Real-time Updates** - Auto check-in, availability tracking, and notifications

### Tech Stack

- **React** - Component-based UI
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with custom design system
- **Font Awesome** - Icon library
- **Shadcn/UI** - High-quality component library
- **Radix UI** - Accessible primitives

## Quick Start

### For New Development

```typescript
// Import shared types
import { Meeting, Room, Message } from './types';

// Import utilities
import { formatTimeFloat, getRoomType, getFilteredRooms } from './utils';

// Import constants
import { ROOM_AMENITIES, TIME_WINDOWS, PAGE_TITLES } from './constants';

// Use them in your component
function MyComponent() {
  const rooms: Room[] = [...];
  const formattedTime = formatTimeFloat(9.5); // "9:30 AM"
  const roomType = getRoomType(rooms[0]);
  // ...
}
```

### For Existing Components

See `MIGRATION_EXAMPLE.md` for step-by-step migration guides.

## Project Structure

```
/
├── App.tsx                          # Main application entry point
├── types/                           # Shared TypeScript definitions
│   └── index.ts                     # All interfaces and types
├── constants/                       # Shared constants
│   └── index.ts                     # Page titles, amenities, config values
├── utils/                           # Shared utility functions
│   └── index.ts                     # Formatting, filtering, calculations
├── components/                      # React components
│   ├── PageLayout.tsx              # Default page shell
│   ├── MeetingSpacesPage.tsx       # Meeting spaces calendar view
│   ├── AiAssistantSidebar.tsx      # AI chat interface
│   ├── CustomTooltip.tsx           # Shared tooltip component
│   ├── [other components...]
│   ├── figma/                      # Figma-specific components
│   │   └── ImageWithFallback.tsx
│   └── ui/                         # Shadcn UI components
├── imports/                         # Figma-imported assets
│   ├── Avatar.tsx
│   └── [SVG path files...]
├── styles/
│   └── globals.css                 # Tailwind v4 + custom styles
└── Guidelines.md                    # Complete project guidelines

Documentation Files:
├── README.md                        # This file - project overview
├── Guidelines.md                    # Comprehensive development guide
└── CATERING_TIMING_REFERENCE.md     # Animation timing reference
```

## Key Features

### 1. Meeting Space Management

- **Calendar Views**: Day (hour-by-hour), Week (7-day), Month (monthly grid)
- **Time Windows**: Three 11-hour windows (Morning 12am-11am, Business 8am-7pm, Evening 1pm-12am)
- **Real-time Availability**: Live room status with occupied/available indicators
- **Auto Check-in**: Automatic meeting check-in when time arrives
- **Drag & Drop**: Reschedule meetings by dragging to new time slots
- **Pinning**: Pin favorite rooms to top of list
- **Demo Mode**: Draggable time indicator for presentations

### 2. AI Assistant

- **Room Suggestions**: AI analyzes requirements and suggests optimal rooms
- **Thinking Animation**: Multi-phase analysis visualization
- **Room Preview**: Hover over suggestions to preview on calendar
- **Chat History**: Multiple conversation threads with auto-generated titles
- **Context-Aware**: Different prompts based on current page
- **Booking Flow**: Seamless booking from AI suggestions to calendar

### 3. Advanced Filtering

- **Duration**: Filter by meeting length (30min, 1h, 2h, 4h+)
- **Capacity**: Filter by attendee count (1-4, 5-8, 9-12, 13+)
- **Amenities**: Projector, Whiteboard, Video Conf, TV Display, etc.
- **Room Types**: Conference, Huddle, Board Room, Phone Booth, etc.
- **Availability**: Show all, available only, or booked rooms

### 4. Comprehensive Views

**Navigation**:

- Dashboard - Overview and metrics
- My Schedule - Personal calendar
- Meeting Spaces - Room booking interface
- Tickets - Issue tracking system
- Map - Interactive floor plans
- Analytics - Usage reports
- People - Team directory

**Workplace** (expandable menu):

- Daily Roster, Meeting Services, Space Requests
- Issue Reports, Announcements, Visitors
- Deliveries, Surveys, Devices, Calendars

**Settings** (expandable menu):

- Organization, Offices, Themes, Integrations
- People, Groups, Roles, Calendars
- Event Audit Logs, Hybrid Work Policies
- Notifications, Billing, Priority Support

### 5. Smart Notifications

- **Real-time Updates**: Meeting confirmations, changes, cancellations
- **Action Items**: Clickable notifications navigate to relevant views
- **Read/Unread Tracking**: Visual indicators for new notifications
- **Auto-dismiss**: Mark as read when popover closes
- **Relative Time**: "5m ago", "2h ago" timestamps

## Code Optimization (January 2025)

The codebase underwent a major optimization to eliminate ~700 lines of duplicated code:

### Three Shared Files

1. **`/types/index.ts`** - All TypeScript interfaces and types

   - Meeting, Room, Message, ChatSession
   - View, SidebarType, MeetingRoomFilters
   - Eliminates ~200 lines of type duplication

2. **`/constants/index.ts`** - All hardcoded values

   - Page titles, amenities, room types
   - Time windows, durations, capacities
   - Eliminates ~100 lines of magic values

3. **`/utils/index.ts`** - All reusable functions
   - Formatting (time, duration, dates)
   - Filtering (rooms, meetings)
   - Calculations (time windows, availability)
   - Eliminates ~400 lines of duplicated logic

### Benefits

- **Single Source of Truth**: Change once, affects everywhere
- **No More "Works Here But Not There"**: Shared code = consistent behavior
- **Type Safety**: Prevents mismatches between components
- **Easier Onboarding**: All utilities in one place
- **Faster Development**: Reuse instead of rewrite

### Documentation

- **Guidelines.md** - Comprehensive development guide

## Architecture

### State Management

**Centralized Pattern**: App.tsx owns all state, components receive via props (prop drilling)

**State Categories**:

- Navigation (currentView, pendingNavigation)
- AI Assistant (messages, chat history, current chat)
- Sidebar (type, open/closed, context)
- Meeting data (rooms, meetings, filters)
- UI state (spotlightMyEvents, compactView, pinnedRoomIds)
- Preview state (aiMeetingPreview, highlightedRoomId)

### Component Communication

**Callback Props**:

```typescript
onSidebarStateChange={(type) => setSidebarState(type)}
onNavigate={(view) => setCurrentView(view)}
```

**State + Callback Pairs**:

```typescript
spotlightMyEvents = { spotlightMyEvents };
onSpotlightMyEventsChange = { setSpotlightMyEvents };
```

### Sidebar System

**Six Sidebar Types**:

- `none` - No sidebar
- `ai-assistant` - AI chat interface
- `meeting-details` - View/edit meeting
- `create-meeting` - Create new meeting
- `filters` - Room filters
- `room-details` - Room information

**Rules**:

- Only ONE sidebar visible at a time
- AI assistant can persist across navigation
- Back button navigates sidebar stack
- Sidebars close on navigation (except AI if explicitly kept open)

## Styling System

### Tailwind v4 with Custom Typography

**Critical Rules**:

1. ❌ **DO NOT use font size classes** (`text-2xl`, `text-lg`) unless overriding

   - Typography handled by semantic HTML (h1, h2, p, etc.)
   - Custom typography in `globals.css` applies automatically

2. ❌ **DO NOT use font weight classes** (`font-bold`, `font-medium`) unless overriding

   - Weights defined via CSS variables
   - Applied to semantic elements automatically

3. ❌ **DO NOT use line-height classes** (`leading-tight`) unless overriding

   - Line heights in typography system

4. ✅ **DO use color, spacing, and layout classes normally**

5. ✅ **DO override component defaults explicitly**
   - Many Shadcn components have default styling
   - Explicitly set padding, gap, typography to override

### Color System

```css
--primary: #db2777              /* Pink primary color */
--background: #ffffff           /* Light mode background */
--muted: #ececf0               /* Muted backgrounds */
--gray-border: #D6D6D6         /* Gray borders */
--destructive: #d4183d         /* Red for delete actions */
--input-background: #f3f3f5    /* Input field backgrounds */
```

### Custom Utilities

- `.scrollbar-hide` - Hide scrollbars
- `.scrollbar-overlay` - macOS-style overlay scrollbar
- `.grid-cols-21` / `.grid-cols-22` - Time slot grids
- `.skeleton-ripple` - Loading skeleton animation
- `.office-closed` - Diagonal stripe pattern for closed hours

## Icon System

**Primary Library: Font Awesome** (always use for new icons)

```typescript
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCog,
  faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />;
```

**Common Icon Mappings**:

- Navigation: `faCity`, `faChartLine`, `faTableCells`, `faCalendar`
- Actions: `faPlus`, `faPencil`, `faTrash`, `faX`, `faCheck`
- AI/Magic: `faMagicWandSparkles`, `faWandSparkles`, `faCompass`
- Status: `faCircleCheck`, `faCircleXmark`, `faExclamationTriangle`

**Note**: Lucide icons only used internally in some Shadcn components. Do not add new Lucide icons.

## Development Guidelines

### Adding a New View

1. Add view name to `View` type in `/types/index.ts`
2. Add title to `PAGE_TITLES` in `/constants/index.ts`
3. Add navigation item in `PageLayout.tsx`
4. Render content in PageLayout's children or create specialized page

### Adding a New Sidebar

1. Add type to `SidebarType` in `/types/index.ts`
2. Create sidebar component in `/components`
3. Add state for sidebar data in App.tsx
4. Add sidebar to PageLayout and MeetingSpacesPage
5. Implement open/close handlers

### Adding Room Features

1. Add feature string to room's `features` array
2. Update `ROOM_AMENITIES` in `/constants/index.ts`
3. Add to FiltersSidebar UI
4. Update AI room suggestion logic if relevant
5. Add Font Awesome icon mapping

### Using Figma Imports

The `/imports` directory contains actively used Figma assets:

```typescript
// Components
import Avatar from "./imports/Avatar";

// SVG paths
import svgPaths from "./imports/svg-lb4i9w2xwv"; // Toast icons
import svgPaths from "./imports/svg-2zju4fq6lg"; // AI assistant
```

### Images

```typescript
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

<ImageWithFallback
  src="/path/to/image.jpg"
  alt="Description"
  className="w-full h-48 object-cover"
/>;
```

## Testing Checklist

### Manual Testing

- [ ] Navigation between all views works
- [ ] Sidebars open/close correctly
- [ ] AI assistant persists when toggled open
- [ ] Meeting CRUD operations work
- [ ] Filters apply correctly
- [ ] Notifications show/clear properly
- [ ] Toast notifications appear
- [ ] Auto check-in system works
- [ ] Pin/unpin rooms functionality
- [ ] Time window navigation cycles
- [ ] View mode switching (day/week/month)
- [ ] Drag-and-drop meeting rescheduling

### Edge Cases

- Opening sidebar while another is open
- Navigating with pending changes
- Booking overlapping meetings
- Filtering to zero results
- Creating meeting via AI then editing
- Deleting meeting currently viewed
- Pinning all rooms

## Performance Considerations

- **Filtered Data**: Apply filters at parent before passing to children
- **State Updates**: Avoid unnecessary re-renders with careful state management
- **Preview State**: Track by chat ID to maintain across sidebar switches
- **Time Updates**: Update every minute for "available now" filter
- **Auto Check-in**: Runs every minute via setInterval

## Future Considerations

### Scalability

- State management library (Zustand, Redux) if views grow beyond 40+
- React Query for server data fetching/caching
- Component lazy loading for code splitting
- Virtual scrolling for large room lists

### Accessibility

**Current**:

- Semantic HTML structure
- ARIA labels on some components
- Keyboard navigation in dialogs
- Focus states on interactive elements

**Improvements Needed**:

- Full keyboard navigation for calendar
- Screen reader announcements for state changes
- Focus management in sidebars (focus trap, return focus)
- ARIA live regions for dynamic updates
- Better color contrast in some areas

### Mobile Responsiveness

Currently desktop-focused. Mobile considerations:

- Responsive sidebar → bottom sheet on mobile
- Calendar → simplified view or swipe navigation
- Touch-friendly tap targets (min 44x44px)
- Simplified filters in mobile view

## Troubleshooting

### Sidebar won't open

- Check if another sidebar is already open
- Verify sidebar state machine allows transition
- Check if data prop is set (e.g., `selectedMeetingDetails`)

### Filters not working

- Verify `getFilteredRooms()` is applied before passing to child
- Check filter state is updating correctly
- Ensure filter logic matches data structure

### Typography not applying

- Ensure using semantic HTML (h1, h2, p, not div with text classes)
- Check globals.css typography rules are loaded
- Verify no parent has Tailwind text classes

### Icons not showing

- Verify Font Awesome import is correct
- Check icon name spelling (camelCase with `fa` prefix)
- Ensure icon is from `@fortawesome/free-solid-svg-icons`
- Check className includes sizing (e.g., `w-4 h-4`)

## Project Origin

This project was imported from a Figma Make project and includes Figma-imported components in the `/imports` directory.

For comprehensive development guidelines, see **Guidelines.md**.

## Shared Code Guide

### When Creating a New Component

**✅ DO THIS (New Pattern)**

```typescript
// Import types from shared file
import { Meeting, Room, Message } from "./types";

// Import utilities from shared file
import { formatTimeFloat, getRoomType } from "./utils";

// Import constants from shared file
import { ROOM_AMENITIES, TOAST_DURATION } from "./constants";

export function NewComponent() {
  // Use imported types, utilities, and constants
  const formattedTime = formatTimeFloat(9.5); // "9:30 AM"

  return <div>{formattedTime}</div>;
}
```

**❌ DON'T DO THIS (Old Pattern)**

```typescript
// Don't redeclare types locally
interface Meeting { ... }

// Don't create local utility functions
function formatTime(time: number) { ... }

// Don't hardcode constants
const amenities = ['Projector', 'Whiteboard'];
```

## Attributions

- **Shadcn/UI**: UI components used under [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- **Unsplash**: Photos used under [Unsplash license](https://unsplash.com/license)

---

**Last Updated**: January 2025  
**Project Type**: Workplace Management Application  
**Framework**: React + TypeScript + Tailwind v4  
**Status**: Active Development
