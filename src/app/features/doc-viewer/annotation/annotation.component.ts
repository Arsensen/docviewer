import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import type { InputSignal, OutputEmitterRef, ElementRef } from '@angular/core';
import type { IAnnotation } from '@core/models/annotation.interface';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationComponent {
  // Inputs
  public annotation: InputSignal<IAnnotation> = input.required<IAnnotation>();

  // Outputs
  public updateAnnotation: OutputEmitterRef<IAnnotation> = output<IAnnotation>();
  public deleted: OutputEmitterRef<string> = output<string>();

  // ViewChild
  private annotationEl = viewChild.required<ElementRef<HTMLElement>>('annotationEl');

  /**
   * Emits the new dimensions of the annotation.
   * Launches when user finishes resizing the annotation (on blur event).
   */
  protected emitResizedDimensions(): void {
    const el: HTMLElement = this.annotationEl().nativeElement;
    const width: number = Math.round(el.offsetWidth);
    const height: number = Math.round(el.offsetHeight);
    const annotation: IAnnotation = this.annotation();

    if (annotation.width !== width || annotation.height !== height) {
      this.updateAnnotation.emit({ ...annotation, width, height });
    }
  }

  /**
   * Automatically resizes the textarea.
   * Launches when user typing.
   *
   * @param {Event} event The input event from the textarea.
   */
  protected autoResize(event: Event): void {
    const textarea: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
    textarea.style.height = '0';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  /**
   * Edits the text of the annotation.
   * Launches when user finishes editing the text (on blur event).
   *
   * @param {FocusEvent} event The focus event from the textarea.
   */
  protected editText(event: FocusEvent): void {
    const newText: string | null = (event.target as HTMLTextAreaElement).value || null;

    if (newText !== null && newText.trim() !== '') {
      this.updateAnnotation.emit({ ...this.annotation(), text: newText });
    }
  }

  /**
   * Deletes the annotation.
   * Launches when user clicks the delete button.
   *
   * @param {Event} event The event from the delete action.
   */
  protected deleteAnnotation(event: Event): void {
    event.stopImmediatePropagation();
    this.deleted.emit(this.annotation().id);
  }
}
