import { Room, ServiceTicket } from '../types';

export const MOCK_SERVICE_TICKETS: ServiceTicket[] = [
    {
        id: 'SRV-001425',
        status: 'completed',
        eventStartTime: '2025-11-05T09:00:00.000Z',
        serviceName: 'Coffee & Pastries',
        space: 'Conference Room A',
        eventTitle: 'Marketing Review',
        approver: 'Jennifer Martin',
        requester: 'Sarah Johnson',
        assignee: 'ezCater Services',
        category: 'catering',
        created: '2025-11-04T15:30:00.000Z',
        lastUpdated: '2025-11-05T09:15:00.000Z',
        description: 'Morning coffee service with assorted pastries for team meeting',
        items: [
            { name: 'Coffee Service (12 cups)', quantity: 1, price: 35.00 },
            { name: 'Assorted Pastries', quantity: 12, price: 48.00 }
        ],
        totalCost: 83.00,
    },
    {
        id: 'SRV-001398',
        status: 'in-progress',
        eventStartTime: '2025-11-07T14:00:00.000Z',
        serviceName: 'AV Equipment Setup',
        space: 'Board Room',
        eventTitle: 'Executive Board Meeting',
        approver: 'Robert Thompson',
        requester: 'David Kim',
        assignee: 'Marcus Johnson',
        category: 'av-support',
        created: '2025-11-03T10:20:00.000Z',
        lastUpdated: '2025-11-07T08:30:00.000Z',
        description: 'Setup dual displays, video conferencing equipment, and wireless presentation system',
        notes: 'Test all equipment 1 hour before meeting starts',
    },
    {
        id: 'SRV-001412',
        status: 'approved',
        eventStartTime: '2025-11-08T12:00:00.000Z',
        serviceName: 'Lunch Catering - Italian',
        space: 'Large Conference Room',
        eventTitle: 'Product Launch Planning',
        approver: 'Jennifer Martin',
        requester: 'Emily Rodriguez',
        assignee: 'ezCater Services',
        category: 'catering',
        created: '2025-11-06T09:15:00.000Z',
        lastUpdated: '2025-11-06T14:20:00.000Z',
        description: 'Italian lunch buffet for 25 people',
        items: [
            { name: 'Caesar Salad (serves 25)', quantity: 1, price: 75.00 },
            { name: 'Pasta Primavera', quantity: 2, price: 120.00 },
            { name: 'Chicken Parmesan', quantity: 2, price: 150.00 },
            { name: 'Garlic Bread', quantity: 3, price: 24.00 },
            { name: 'Tiramisu (serves 25)', quantity: 1, price: 85.00 }
        ],
        totalCost: 454.00,
    },
    {
        id: 'SRV-001389',
        status: 'pending',
        eventStartTime: '2025-11-09T10:00:00.000Z',
        serviceName: 'Room Setup - Theater Style',
        space: 'Multi-Purpose Room',
        eventTitle: 'All-Hands Company Meeting',
        approver: 'Robert Thompson',
        requester: 'HR Department',
        assignee: 'Facilities Team',
        category: 'setup',
        created: '2025-11-02T16:45:00.000Z',
        lastUpdated: '2025-11-02T16:45:00.000Z',
        description: 'Theater-style seating for 80 people, podium, microphone, and projector setup',
        notes: 'Setup required by 9:00 AM',
    },
    {
        id: 'SRV-001356',
        status: 'completed',
        eventStartTime: '2025-11-04T13:30:00.000Z',
        serviceName: 'Post-Event Cleaning',
        space: 'Training Room B',
        eventTitle: 'Customer Workshop',
        approver: 'Jennifer Martin',
        requester: 'Training Department',
        assignee: 'Cleaning Services',
        category: 'cleaning',
        created: '2025-11-03T11:00:00.000Z',
        lastUpdated: '2025-11-04T16:30:00.000Z',
        description: 'Deep cleaning after full-day workshop with food service',
    },
    {
        id: 'SRV-001403',
        status: 'approved',
        eventStartTime: '2025-11-07T15:30:00.000Z',
        serviceName: 'Coffee & Snacks',
        space: 'Innovation Lab',
        eventTitle: 'Design Sprint Day 3',
        approver: 'Jennifer Martin',
        requester: 'Michael Torres',
        assignee: 'ezCater Services',
        category: 'catering',
        created: '2025-11-05T13:20:00.000Z',
        lastUpdated: '2025-11-06T09:10:00.000Z',
        description: 'Afternoon coffee service and healthy snacks for design team',
        items: [
            { name: 'Coffee Service (15 cups)', quantity: 1, price: 42.00 },
            { name: 'Assorted Energy Bars', quantity: 15, price: 30.00 },
            { name: 'Fresh Fruit Platter', quantity: 1, price: 35.00 }
        ],
        totalCost: 107.00,
    },
    {
        id: 'SRV-001367',
        status: 'cancelled',
        eventStartTime: '2025-11-06T09:00:00.000Z',
        serviceName: 'Breakfast Catering',
        space: 'Conference Room C',
        eventTitle: 'Team Sync',
        approver: 'Jennifer Martin',
        requester: 'Alex Chen',
        assignee: 'ezCater Services',
        category: 'catering',
        created: '2025-11-01T14:30:00.000Z',
        lastUpdated: '2025-11-05T10:15:00.000Z',
        description: 'Breakfast meeting cancelled due to schedule conflict',
        notes: 'Cancelled with 24hr notice - no fees',
    },
    {
        id: 'SRV-001378',
        status: 'in-progress',
        eventStartTime: '2025-11-08T09:00:00.000Z',
        serviceName: 'Video Recording Setup',
        space: 'Presentation Studio',
        eventTitle: 'Webinar Recording Session',
        approver: 'Robert Thompson',
        requester: 'Marketing Team',
        assignee: 'Marcus Johnson',
        category: 'av-support',
        created: '2025-11-01T09:00:00.000Z',
        lastUpdated: '2025-11-07T14:45:00.000Z',
        description: 'Professional video recording setup with lighting and audio for webinar content',
        notes: 'Test recording session scheduled for Nov 7 at 4pm',
    },
];

export const MOCK_ROOMS: Room[] = [
    // Floor 1 Rooms
    {
        id: 'conf-a',
        name: 'Conference Room A',
        capacity: 8,
        floor: 1,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Video Conf'],
        meetings: [
            { id: 'meet-1', title: 'Marketing Review', organizer: 'Sarah Johnson', startTime: 9, duration: 1, attendees: 6 },
            { id: 'meet-2', title: 'Client Presentation', organizer: 'Mike Chen', startTime: 14, duration: 2, attendees: 4 }
        ]
    },
    {
        id: 'conf-b',
        name: 'Executive Conference Room B',
        capacity: 12,
        floor: 1,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System'],
        requestOnly: true,
        meetings: [
            { id: 'meet-3', title: 'Team Standup', organizer: 'Alex Rodriguez', startTime: 10, duration: 0.5, attendees: 8 },
            { id: 'meet-4', title: 'Product Demo', organizer: 'Lisa Wang', startTime: 15, duration: 1.5, attendees: 10 },
            { id: 'meet-5', title: 'Sprint Planning', organizer: 'Jane Doe', startTime: 8, duration: 2, attendees: 7 }
        ]
    },
    {
        id: 'conf-c',
        name: 'Conference Room C',
        capacity: 6,
        floor: 1,
        status: 'available',
        features: ['Whiteboard', 'Monitor', 'Video Conf'],
        meetings: [
            { id: 'meet-6', title: 'Design Review', organizer: 'Emma Thompson', startTime: 11, duration: 1, attendees: 5 },
            { id: 'meet-7', title: 'Budget Review', organizer: 'Jane Doe', startTime: 16, duration: 1, attendees: 4 }
        ]
    },
    {
        id: 'huddle-1',
        name: 'Huddle Room 1',
        capacity: 4,
        floor: 1,
        status: 'available',
        features: ['Monitor', 'Video Conf'],
        meetings: [
            { id: 'meet-8', title: '1:1 Check-in', organizer: 'Michael Brown', startTime: 13, duration: 0.5, attendees: 2 },
            { id: 'meet-9', title: 'Quick Sync', organizer: 'Amanda Foster', startTime: 17, duration: 0.5, attendees: 3 }
        ]
    },
    {
        id: 'focus-room-1',
        name: 'Focus Room 1',
        capacity: 6,
        floor: 1,
        status: 'available',
        features: ['Whiteboard', 'Monitor', 'Video Conf', 'Noise Cancellation'],
        meetings: [
            { id: 'meet-10', title: 'Engineering Deep Dive', organizer: 'Carlos Martinez', startTime: 9, duration: 3, attendees: 5 },
            { id: 'meet-11', title: 'Code Review Session', organizer: 'Tom Wilson', startTime: 14, duration: 1, attendees: 4 }
        ]
    },
    {
        id: 'creative-space-1',
        name: 'Creative Space 1',
        capacity: 10,
        floor: 1,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Flexible Seating', 'Art Supplies', 'Video Conf'],
        meetings: [
            { id: 'meet-12', title: 'Brand Workshop', organizer: 'Jessica Lee', startTime: 10, duration: 2, attendees: 8 },
            { id: 'meet-13', title: 'Innovation Brainstorm', organizer: 'Mark Thompson', startTime: 15, duration: 1.5, attendees: 6 }
        ]
    },

    // Floor 2 Rooms
    {
        id: 'board-room',
        name: 'Board Room',
        capacity: 16,
        floor: 2,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'Executive Seating'],
        meetings: [
            { id: 'meet-14', title: 'Board Meeting', organizer: 'David Kim', startTime: 13, duration: 2, attendees: 12 },
            { id: 'meet-15', title: 'Quarterly Review', organizer: 'Jane Doe', startTime: 10, duration: 2, attendees: 8 }
        ]
    },
    {
        id: 'training-room',
        name: 'Professional Development Center',
        capacity: 20,
        floor: 2,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Audio System', 'Multiple Monitors', 'Video Conf'],
        meetings: [
            { id: 'meet-16', title: 'New Hire Training', organizer: 'Rachel Green', startTime: 9, duration: 4, attendees: 15 },
            { id: 'meet-17', title: 'Sales Workshop', organizer: 'Steve Davis', startTime: 14, duration: 2, attendees: 12 }
        ]
    },
    {
        id: 'small-meeting-1',
        name: 'Small Meeting Room 1',
        capacity: 4,
        floor: 2,
        status: 'available',
        features: ['Monitor', 'Whiteboard', 'Video Conf'],
        meetings: [
            { id: 'meet-18', title: 'Performance Review', organizer: 'Linda Johnson', startTime: 11, duration: 1, attendees: 2 },
            { id: 'meet-19', title: 'Vendor Call', organizer: 'Robert Chen', startTime: 16, duration: 1, attendees: 3 }
        ]
    },
    {
        id: 'executive-suite',
        name: 'Executive Suite',
        capacity: 8,
        floor: 2,
        status: 'available',
        features: ['Projector', 'Video Conf', 'Audio System', 'Premium Seating'],
        requestOnly: true,
        meetings: [
            { id: 'meet-20', title: 'Leadership Sync', organizer: 'Patricia Moore', startTime: 8, duration: 1, attendees: 6 },
            { id: 'meet-21', title: 'Strategic Planning', organizer: 'William Taylor', startTime: 15, duration: 2, attendees: 7 },
            { id: 'meet-pending-1', title: 'Executive Review', organizer: 'Jane Doe', startTime: 11, duration: 1, attendees: 5 }
        ]
    },
    {
        id: 'collaboration-hub',
        name: 'Collaboration Hub',
        capacity: 12,
        floor: 2,
        status: 'available',
        features: ['Multiple Monitors', 'Whiteboard', 'Video Conf', 'Flexible Layout'],
        meetings: [
            { id: 'meet-22', title: 'Cross-team Alignment', organizer: 'Nancy Williams', startTime: 9, duration: 1.5, attendees: 10 },
            { id: 'meet-23', title: 'Product Roadmap', organizer: 'Kevin Anderson', startTime: 13, duration: 2, attendees: 9 }
        ]
    },
    {
        id: 'innovation-lab',
        name: 'Innovation Lab',
        capacity: 14,
        floor: 2,
        status: 'available',
        features: ['Interactive Display', 'Whiteboard', 'Video Conf', 'Research Tools'],
        meetings: [
            { id: 'meet-24', title: 'Research Review', organizer: 'Daniel Garcia', startTime: 10, duration: 2, attendees: 8 },
            { id: 'meet-25', title: 'Tech Talk', organizer: 'Sarah Martinez', startTime: 16, duration: 1, attendees: 12 }
        ]
    },

    // Floor 3 Rooms
    {
        id: 'skyline-suite',
        name: 'Skyline Suite - Premium View',
        capacity: 18,
        floor: 3,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'Premium View'],
        requestOnly: true,
        meetings: [
            { id: 'meet-26', title: 'Executive Presentation', organizer: 'Bruce Wayne', startTime: 9, duration: 2, attendees: 15 },
            { id: 'meet-27', title: 'Investor Meeting', organizer: 'Lucius Fox', startTime: 14, duration: 1.5, attendees: 12 }
        ]
    },
    {
        id: 'design-studio',
        name: 'Design Studio',
        capacity: 10,
        floor: 3,
        status: 'available',
        features: ['Whiteboard', 'Multiple Monitors', 'Video Conf', 'Art Supplies', 'Standing Desks'],
        meetings: [
            { id: 'meet-28', title: 'UX Review', organizer: 'Selina Kyle', startTime: 10, duration: 1.5, attendees: 7 },
            { id: 'meet-29', title: 'Design Sprint', organizer: 'Dick Grayson', startTime: 15, duration: 2, attendees: 8 }
        ]
    },
    {
        id: 'tech-lab',
        name: 'Tech Lab',
        capacity: 8,
        floor: 3,
        status: 'available',
        features: ['Multiple Monitors', 'Whiteboard', 'Video Conf', 'Dev Tools'],
        meetings: [
            { id: 'meet-30', title: 'Architecture Review', organizer: 'Barbara Gordon', startTime: 8.5, duration: 1.5, attendees: 6 },
            { id: 'meet-31', title: 'Code Demo', organizer: 'Tim Drake', startTime: 13, duration: 1, attendees: 5 }
        ]
    },
    {
        id: 'huddle-2',
        name: 'Huddle Room 2',
        capacity: 4,
        floor: 3,
        status: 'available',
        features: ['Monitor', 'Video Conf'],
        meetings: [
            { id: 'meet-32', title: 'Weekly 1:1', organizer: 'Alfred Pennyworth', startTime: 11, duration: 0.5, attendees: 2 },
            { id: 'meet-33', title: 'Quick Standup', organizer: 'Commissioner Gordon', startTime: 16.5, duration: 0.5, attendees: 3 }
        ]
    },
    {
        id: 'penthouse-conf',
        name: 'Penthouse Conference',
        capacity: 12,
        floor: 3,
        status: 'available',
        features: ['Projector', 'Whiteboard', 'Video Conf', 'Audio System', 'City View'],
        meetings: [
            { id: 'meet-34', title: 'All Hands Meeting', organizer: 'You', startTime: 9, duration: 1, attendees: 11 },
            { id: 'meet-35', title: 'Strategy Session', organizer: 'Rachel Dawes', startTime: 14.5, duration: 2, attendees: 10 }
        ]
    },
    {
        id: 'think-tank',
        name: 'Think Tank',
        capacity: 6,
        floor: 3,
        status: 'available',
        features: ['Whiteboard', 'Monitor', 'Video Conf', 'Quiet Space'],
        meetings: [
            { id: 'meet-36', title: 'Problem Solving Workshop', organizer: 'Edward Nygma', startTime: 10.5, duration: 2, attendees: 5 },
            { id: 'meet-37', title: 'Innovation Brainstorm', organizer: 'Harvey Dent', startTime: 15.5, duration: 1.5, attendees: 6 }
        ]
    }
];
