import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface CustomTooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  children: React.ReactNode;
}

/**
 * Custom tooltip content component with consistent dark styling
 * Used throughout the application for a unified tooltip appearance
 */
export function CustomTooltipContent({ children, ...props }: CustomTooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={8}
        className="ml-2 text-white border-0 z-50 rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95"
        style={{ backgroundColor: '#131A23' }}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
