import type { DragFilterFn } from '@shared/types';
import { RESIZE_HANDLE_SIZE } from '../config/annotation.config';

/**
 * Creates a drag filter that prevents dragging when the user clicks
 * in the resize zone (bottom-right corner) of the annotation.
 */
export function createAnnotationResizeDragFilter(): DragFilterFn {
  return (_target: EventTarget | null, event: MouseEvent | Touch): boolean => {
    const el: HTMLElement | null = (event.target as HTMLElement).closest<HTMLElement>(
      '.app-annotation__textarea-wrapper',
    );

    if (!el) {
      return false;
    }

    const rect: DOMRect = el.getBoundingClientRect();
    const offsetRight: number = rect.right - event.clientX;
    const offsetBottom: number = rect.bottom - event.clientY;

    return offsetRight <= RESIZE_HANDLE_SIZE && offsetBottom <= RESIZE_HANDLE_SIZE;
  };
}
