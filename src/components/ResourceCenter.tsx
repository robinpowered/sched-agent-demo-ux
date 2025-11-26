import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronRight, faGripVertical } from '@fortawesome/free-solid-svg-icons';

interface ResourceCenterProps {}

export function ResourceCenter({}: ResourceCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(200);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Initialize position from localStorage or default to 40px from right edge
  useEffect(() => {
    const savedPosition = localStorage.getItem('resourceCenterPositionX');
    if (savedPosition) {
      setPositionX(parseFloat(savedPosition));
    } else {
      // Default to 40px from right edge
      const defaultX = window.innerWidth - 200 - 40; // Approximate initial width, 40px from right
      setPositionX(defaultX);
    }
  }, []);

  // Update button width when ref is available
  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonRef.current]);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (positionX !== 0) {
      localStorage.setItem('resourceCenterPositionX', positionX.toString());
    }
  }, [positionX]);

  // Handle viewport resize - keep button within bounds
  useEffect(() => {
    const handleResize = () => {
      if (!buttonRef.current) return;
      
      const currentButtonWidth = buttonRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      
      // Calculate distances from edges
      const distanceFromLeft = positionX;
      const distanceFromRight = viewportWidth - (positionX + currentButtonWidth);
      
      // If button is closer to right edge than left edge
      const isCloserToRight = distanceFromRight < distanceFromLeft;
      
      // Check if button would overflow or be too close to right edge (within 40px)
      if (positionX + currentButtonWidth + 40 > viewportWidth) {
        if (isCloserToRight) {
          // Keep it 40px from right edge as viewport shrinks
          const newX = viewportWidth - currentButtonWidth - 40;
          setPositionX(Math.max(0, newX));
        } else {
          // Just ensure it doesn't overflow (keep at least 0px margin)
          const maxX = viewportWidth - currentButtonWidth;
          setPositionX(Math.min(positionX, maxX));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [positionX, buttonWidth]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    setIsDragging(true);
    setHasDragged(false); // Reset drag flag
    setDragOffset(clientX - positionX);
  };

  // Handle drag move
  useEffect(() => {
    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const newX = clientX - dragOffset;

      // Mark that we've actually dragged (moved the mouse)
      setHasDragged(true);

      // Keep button within viewport bounds (horizontal only)
      const maxX = window.innerWidth - buttonWidth;
      
      setPositionX(Math.max(0, Math.min(newX, maxX)));
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      // Don't reset hasDragged here - we need it in handleButtonClick
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset, buttonWidth]);

  // Handle button click (only open if not dragging)
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Only open if we didn't actually drag
    if (!hasDragged) {
      setIsOpen(true);
    }
    
    // Reset drag flag for next interaction
    setHasDragged(false);
  };

  const menuItems = [
    {
      title: 'Get started with Robin',
      description: 'Step-by-step onboarding',
      action: () => console.log('Open onboarding')
    },
    {
      title: 'Training and events',
      description: 'View learning opportunities',
      action: () => console.log('Open training')
    },
    {
      title: 'Product updates',
      description: 'Get the latest product news',
      action: () => console.log('Open updates')
    }
  ];

  return (
    <>
      {/* Docked Bottom Button */}
      <div
        ref={buttonRef}
        className="fixed bottom-0 z-50 select-none"
        style={{
          left: `${positionX}px`,
        }}
      >
        {/* Main Button */}
        <button
          onClick={handleButtonClick}
          className="px-3 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          style={{ 
            backgroundColor: '#db2777',
            cursor: isDragging ? 'grabbing' : 'pointer',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {/* Drag Handle - Always visible */}
          <div
            className="cursor-move flex items-center justify-center"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{ fontSize: '12px' }}
          >
            <FontAwesomeIcon icon={faGripVertical} className="text-white/70" />
          </div>

          {/* Button Text */}
          <span className="text-white">
            Guide Center
          </span>
        </button>
      </div>

      {/* Guide Center Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu positioned above button */}
          <div 
            className="fixed z-[70] bg-white rounded-lg shadow-2xl"
            style={{
              width: '440px',
              maxHeight: '600px',
              // Position from left if there's space, otherwise position from right
              ...(positionX + 440 > window.innerWidth 
                ? { right: `${window.innerWidth - positionX - buttonWidth}px` }
                : { left: `${positionX}px` }
              ),
              bottom: buttonRef.current ? `${buttonRef.current.offsetHeight + 8}px` : '48px',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between px-6 py-4 border-b border-gray-200"
              style={{ 
                backgroundColor: '#db2777',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            >
              <h2 className="text-white" style={{ fontSize: '20px', fontWeight: 500 }}>
                Guide Center
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-100 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} style={{ fontSize: '20px' }} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    // Optionally close the modal after clicking an item
                    // setIsOpen(false);
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex flex-col items-start text-left">
                    <span 
                      className="text-gray-900 mb-1"
                      style={{ fontSize: '16px', fontWeight: 500 }}
                    >
                      {item.title}
                    </span>
                    <span 
                      className="text-gray-500"
                      style={{ fontSize: '14px', fontWeight: 400 }}
                    >
                      {item.description}
                    </span>
                  </div>
                  <FontAwesomeIcon 
                    icon={faChevronRight} 
                    className="text-gray-400"
                    style={{ fontSize: '16px' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
