import type { InputSignal, OnDestroy, OnInit, OutputEmitterRef } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Directive, inject, input, output } from '@angular/core';
import type { IDragPosition } from '@shared/interfaces';
import type { DragFilterFn } from '@shared/types';

@Directive({
  selector: '[appDraggableItem]',
  standalone: true,
})
export class DraggableItemDirective implements OnInit, OnDestroy {
  // Dependencies
  private el: ElementRef<HTMLElement> = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  // Inputs
  /**
   * Allows to specify a filter function to prevent dragging on certain elements.
   */
  public dragFilter: InputSignal<DragFilterFn | null> = input<DragFilterFn | null>(null);

  // Outputs
  public positionChanged: OutputEmitterRef<IDragPosition> = output<IDragPosition>();

  // State
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialLeft = 0;
  private initialTop = 0;

  // Event listeners
  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;

  public ngOnInit(): void {
    const item: HTMLElement = this.el.nativeElement;

    this.renderer.addClass(item, 'draggable-item');
    this.renderer.setStyle(item, 'position', 'absolute');
    this.renderer.setStyle(item, 'cursor', 'move');
    this.renderer.setStyle(item, 'user-select', 'none');
    this.renderer.setStyle(item, 'touch-action', 'none');

    this.renderer.listen(item, 'mousedown', (e: MouseEvent) => this.onMouseDown(e));
    this.renderer.listen(item, 'touchstart', (e: TouchEvent) => this.onTouchStart(e));
  }

  public ngOnDestroy(): void {
    this.stopDragging();
  }

  /**
   * Checks if the target element is interactive, such as input fields or buttons.
   *
   * @param {EventTarget | null} target The target element of the event.
   * @param {MouseEvent | Touch} event The mouse or touch event.
   * @returns {boolean} True if the element is interactive, false otherwise.
   */
  private isInteractiveElement(target: EventTarget | null, event: MouseEvent | Touch): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const tag: string = target.tagName.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') {
      return true;
    }

    const filterFn: DragFilterFn | null = this.dragFilter();

    return filterFn ? filterFn(target, event) : false;
  }

  /**
   * Handles the mousedown event to start dragging the item.
   *
   * @param {MouseEvent} event The mouse event.
   */
  private onMouseDown(event: MouseEvent): void {
    if (this.isInteractiveElement(event.target, event)) {
      return;
    }

    event.preventDefault();
    this.startDragging(event.clientX, event.clientY);
  }

  /**
   * Handles the touchstart event to start dragging the item.
   *
   * @param {TouchEvent} event The touch event.
   */
  private onTouchStart(event: TouchEvent): void {
    const touch: Touch = event.touches[0];

    if (this.isInteractiveElement(event.target, touch)) {
      return;
    }

    event.preventDefault();
    this.startDragging(touch.clientX, touch.clientY);
  }

  /**
   * Initializes the dragging process by setting up necessary state and event listeners.
   *
   * @param {number} clientX The X coordinate of the mouse or touch event.
   * @param {number} clientY The Y coordinate of the mouse or touch event.
   */
  private startDragging(clientX: number, clientY: number): void {
    const item: HTMLElement = this.el.nativeElement;
    const area: HTMLElement | null = this.getBoundaryElement();

    if (!area) {
      return;
    }

    this.isDragging = true;

    this.startX = clientX;
    this.startY = clientY;
    this.initialLeft = item.offsetLeft;
    this.initialTop = item.offsetTop;

    this.renderer.setStyle(item, 'z-index', '1000');

    // Mouse
    this.mouseMoveListener = this.renderer.listen(document, 'mousemove', (e: MouseEvent) =>
      this.onMouseMove(e),
    );
    this.mouseUpListener = this.renderer.listen(document, 'mouseup', () => this.stopDragging());

    // Touch
    this.renderer.listen(document, 'touchmove', (e: TouchEvent) => this.onTouchMove(e));
    this.renderer.listen(document, 'touchend', () => this.stopDragging());
  }

  /**
   * Handles the mousemove event to update the position of the item while dragging.
   *
   * @param {MouseEvent} event The mouse event.
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.updatePosition(event.clientX, event.clientY);
  }

  /**
   * Handles the touchmove event to update the position of the item while dragging.
   *
   * @param {TouchEvent} event The touch event.
   */
  private onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) {
      return;
    }

    const touch: Touch = event.touches[0];
    this.updatePosition(touch.clientX, touch.clientY);
  }

  /**
   * Updates the position of the item while dragging.
   *
   * @param {number} clientX The X coordinate of the mouse or touch event.
   * @param {number} clientY The Y coordinate of the mouse or touch event.
   */
  private updatePosition(clientX: number, clientY: number): void {
    const item: HTMLElement = this.el.nativeElement;
    const area: HTMLElement | null = this.getBoundaryElement();

    if (!area) {
      return;
    }

    const areaRect: DOMRect = area.getBoundingClientRect();

    let newLeft: number = this.initialLeft + (clientX - this.startX);
    let newTop: number = this.initialTop + (clientY - this.startY);

    const maxLeft: number = areaRect.width - item.offsetWidth;
    const maxTop: number = areaRect.height - item.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    this.renderer.setStyle(item, 'left', `${newLeft}px`);
    this.renderer.setStyle(item, 'top', `${newTop}px`);
  }

  /**
   * Stops the dragging process and cleans up event listeners.
   */
  private stopDragging(): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    const item: HTMLElement = this.el.nativeElement;
    const area: HTMLElement | null = this.getBoundaryElement();

    if (area) {
      const xPercent: number = (item.offsetLeft / area.offsetWidth) * 100;
      const yPercent: number = (item.offsetTop / area.offsetHeight) * 100;

      this.renderer.setStyle(item, 'left', `${xPercent}%`);
      this.renderer.setStyle(item, 'top', `${yPercent}%`);

      this.positionChanged.emit({ x: xPercent, y: yPercent });
    }

    this.renderer.setStyle(item, 'z-index', 'auto');

    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }

    if (this.mouseUpListener) {
      this.mouseUpListener();
    }

    this.mouseMoveListener = null;
    this.mouseUpListener = null;
  }

  /**
   * Gets the boundary element within which the item can be dragged.
   *
   * @returns {HTMLElement | null} The boundary element or null if not found.
   */
  private getBoundaryElement(): HTMLElement | null {
    return this.el.nativeElement.parentElement;
  }
}
