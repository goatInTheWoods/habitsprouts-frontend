import React, {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
} from 'react';

interface DragOverlayHabitItemProps
  extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpacityEnabled?: boolean;
  isDragging?: boolean;
}

const DragOverlayHabitItem = forwardRef<
  HTMLDivElement,
  DragOverlayHabitItemProps
>(
  (
    { children, isOpacityEnabled, isDragging, style, ...props },
    ref
  ) => {
    const styles: CSSProperties = {
      opacity: isOpacityEnabled ? '0.4' : '1',
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      ...style,
    };

    return (
      <div {...props} style={styles} ref={ref}>
        {children}
      </div>
    );
  }
);

export default DragOverlayHabitItem;
