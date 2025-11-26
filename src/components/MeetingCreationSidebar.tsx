import React, { useRef, useState } from 'react';
import { Button } from './ui/button';
import { EditMeetingForm } from './EditMeetingForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Import shared types
import { Meeting, Room, MeetingCreationContext } from '../types';

interface MeetingCreationSidebarProps {
  meetingCreationContext: MeetingCreationContext;
  allRooms: Room[];
  onSave: (meeting: Meeting, selectedRooms: string[]) => void;
  onCancel: () => void;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onMeetingPreviewUpdate?: (updatedFields: Partial<{
    startTime: number;
    duration: number; 
    title: string;
    roomIds: string[];
  }>) => void;
}

export function MeetingCreationSidebar({
  meetingCreationContext,
  allRooms,
  onSave,
  onCancel,
  onClose,
  onBack,
  showBackButton = false,
  showCloseButton = true,
  onMeetingPreviewUpdate
}: MeetingCreationSidebarProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Create the meeting object for the form, pre-filled if coming from AI suggestion
  const newMeeting: Meeting = {
    id: 'new',
    title: meetingCreationContext.title || '',
    organizer: 'You',
    startTime: meetingCreationContext.startTime,
    duration: meetingCreationContext.duration || 0.5,
    attendees: meetingCreationContext.attendees || 1,
    rooms: [meetingCreationContext.roomId]
  };

  const currentRoom = allRooms.find(room => room.id === meetingCreationContext.roomId) || allRooms[0];

  const handleFormValidityChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          {(showBackButton || meetingCreationContext.fromAiSuggestion) && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0 hover:bg-gray-100">
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-lg font-semibold text-gray-900">Create Meeting</h2>
        </div>
        {showCloseButton && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <FontAwesomeIcon icon={faX} className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Body Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <EditMeetingForm
            ref={formRef}
            meeting={newMeeting}
            currentRoom={currentRoom}
            allRooms={allRooms}
            onSave={onSave}
            onCancel={onCancel}
            fromAiSuggestion={meetingCreationContext.fromAiSuggestion}
            onMeetingPreviewUpdate={onMeetingPreviewUpdate}
            showActions={false}
            onFormValidityChange={handleFormValidityChange}
          />
        </div>
      </div>
      
      {/* Footer with Action Buttons */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 bg-pink-600 hover:bg-pink-700"
          >
            Book
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
