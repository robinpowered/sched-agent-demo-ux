import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Meeting, Room } from '../types';

interface MeetingWithRoom {
  meeting: Meeting;
  room: Room;
}

interface MeetingListWidgetProps {
  meetings: MeetingWithRoom[];
  onSelectMeeting: (meeting: Meeting, room: Room) => void;
}

// Helper function to format time
function formatTimeFloat(time: number): string {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function MeetingListWidget({ meetings, onSelectMeeting }: MeetingListWidgetProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-700">
          Your upcoming meetings:
        </p>
      </div>

      {/* Meeting List */}
      <div className="divide-y divide-gray-200">
        {meetings.map(({ meeting, room }) => (
          <button
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting, room)}
            onMouseEnter={() => setHoveredId(meeting.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{meeting.title}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{formatTimeFloat(meeting.startTime)}</span>
              </div>
            </div>
            
            {hoveredId === meeting.id && (
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-[#2774C1]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
