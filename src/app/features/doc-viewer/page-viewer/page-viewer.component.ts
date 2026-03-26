import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { AnnotationComponent } from '../annotation/annotation.component';
import { createAnnotationResizeDragFilter } from '../annotation/filters/annotation-resize.drag-filter';
import { CommonModule } from '@angular/common';
import { DraggableItemDirective } from '@shared/directives/draggable-item.directive';
import { DraggableAreaDirective } from '@shared/directives/draggable-area.directive';
import { DOUBLE_TAP_DELAY } from './config/page-viewer.config';
import type { InputSignal, OutputEmitterRef } from '@angular/core';
import type { IPage } from '@core/models/page.interface';
import type { IDragPosition, IPointerPosition } from '@shared/interfaces';
import type { IAnnotation } from '@core/models/annotation.interface';

@Component({
  selector: 'app-page-viewer',
  imports: [CommonModule, AnnotationComponent, DraggableAreaDirective, DraggableItemDirective],
  templateUrl: './page-viewer.component.html',
  styleUrl: './page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageViewerComponent {
  // Inputs
  public page: InputSignal<IPage> = input.required<IPage>();
  public zoom: InputSignal<number> = input<number>(1);

  // Outputs
  public addAnnotation: OutputEmitterRef<IPointerPosition> = output<IPointerPosition>();
  public annotationDeleted: OutputEmitterRef<string> = output<string>();
  public annotationUpdated: OutputEmitterRef<IAnnotation> = output<IAnnotation>();

  protected annotationDragFilter = createAnnotationResizeDragFilter();

  // State
  private lastTapTime = 0;

  /**
   * Handles the double-click event on the page to add a new annotation.
   *
   * @param {MouseEvent} event The mouse event triggered by the double click on the page.
   */
  protected onPageDblClick(event: MouseEvent): void {
    this.addAnnotation.emit({
      clientX: event.clientX,
      clientY: event.clientY,
      currentTarget: event.currentTarget,
    });
  }

  /**
   * Handles the touchend event to detect double-tap and add a new annotation.
   *
   * @param {TouchEvent} event The touch event triggered by a tap on the page.
   */
  protected onPageTouchEnd(event: TouchEvent): void {
    const now: number = Date.now();

    if (now - this.lastTapTime < DOUBLE_TAP_DELAY) {
      event.preventDefault();
      const touch: Touch = event.changedTouches[0];
      this.addAnnotation.emit({
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: event.currentTarget,
      });
      this.lastTapTime = 0;
    } else {
      this.lastTapTime = now;
    }
  }

  /**
   * Handles the update event for an annotation.
   *
   * @param {IAnnotation} updatedAnnotation The updated annotation data.
   */
  protected updateAnnotation(updatedAnnotation: IAnnotation): void {
    this.annotationUpdated.emit(updatedAnnotation);
  }

  /**
   * Handles the position change after dragging an annotation.
   *
   * @param {IAnnotation} annotation The annotation that was moved.
   * @param {IDragPosition} position The new position in percentages.
   */
  protected onAnnotationMoved(annotation: IAnnotation, position: IDragPosition): void {
    this.annotationUpdated.emit({ ...annotation, x: position.x, y: position.y });
  }
}
