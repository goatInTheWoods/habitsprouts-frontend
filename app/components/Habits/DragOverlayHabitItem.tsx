import React, { forwardRef, HTMLAttributes } from 'react';

interface DragOverlayHabitItemProps
  extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const DragOverlayHabitItem = forwardRef<
  HTMLDivElement,
  DragOverlayHabitItemProps
>(({ children, ...props }, ref) => {
  return (
    <div {...props} ref={ref}>
      {children}
    </div>
  );
});

export default DragOverlayHabitItem;
