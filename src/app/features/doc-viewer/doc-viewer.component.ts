import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PageViewerComponent } from './page-viewer/page-viewer.component';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '@core/services/document.service';
import { v4 as uuidv4 } from 'uuid';
import type { WritableSignal, Signal } from '@angular/core';
import type { IAnnotation } from '@core/models/annotation.interface';
import type { IDocument } from '@core/models/document.interface';
import type { IPointerPosition } from '@shared/interfaces';
import type { IPage } from '@core/models/page.interface';

@Component({
  selector: 'app-doc-viewer',
  imports: [CommonModule, MatButtonModule, PageViewerComponent],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocViewerComponent {
  // Dependencies
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly docService: DocumentService = inject(DocumentService);

  // Signals
  protected documentSignal: WritableSignal<IDocument | null> = signal<IDocument | null>(null);
  protected zoom: WritableSignal<number> = signal<number>(1);
  protected loadingState: WritableSignal<'loading' | 'error' | 'success'> = signal<
    'loading' | 'error' | 'success'
  >('loading');
  protected errorMessage: WritableSignal<string> = signal<string>('');
  protected pages: Signal<Array<IPage>> = computed(() => this.documentSignal()?.pages ?? []);
  protected documentName: Signal<string> = computed(() => this.documentSignal()?.name ?? '');

  constructor() {
    this.loadDocument();
  }

  protected loadDocument(): void {
    this.loadingState.set('loading');
    this.errorMessage.set('');

    try {
      const id: string = this.route.snapshot.paramMap.get('id') ?? '';
      const document: IDocument | null = this.docService.getDocument(id);
      this.documentSignal.set(document);
      this.loadingState.set('success');
    } catch (error: unknown) {
      this.loadingState.set('error');
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Не удалось загрузить документ',
      );
    }
  }

  /**
   * Zooms in the document by increasing the zoom level.
   */
  protected zoomIn(): void {
    this.zoom.update((z) => Math.min(z + 0.1, 3));
  }

  /**
   * Zooms out the document by decreasing the zoom level.
   */
  protected zoomOut(): void {
    this.zoom.update((z) => Math.max(z - 0.1, 0.5));
  }

  /**
   * Adds a new annotation to the specified page at the given pointer location.
   *
   * @param {number} pageNumber The number of the page to which the annotation will be added.
   * @param {IPointerPosition} event The pointer position containing the location where the annotation should be added.
   */
  protected addAnnotation(pageNumber: number, event: IPointerPosition): void {
    const doc: IDocument | null = this.documentSignal();
    if (!doc) {
      return;
    }

    const rect: DOMRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x: number = ((event.clientX - rect.left) / rect.width) * 100;
    const y: number = ((event.clientY - rect.top) / rect.height) * 100;

    const newAnn: IAnnotation = {
      id: uuidv4(),
      pageNumber,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      text: 'New annotation',
    };

    this.documentSignal.update((cur) => {
      if (!cur) {
        return cur;
      }

      const current: IDocument = structuredClone(cur);
      const page: IPage | undefined = current.pages.find((p) => p.number === pageNumber);

      if (page) {
        page.annotations = [...page.annotations, newAnn];
      }

      return current;
    });
  }

  /**
   * Updates an existing annotation with new data.
   *
   * @param {IAnnotation} updatedAnnotation The annotation object containing the updated data.
   */
  protected updateAnnotation(updatedAnnotation: IAnnotation): void {
    this.documentSignal.update((cur) => {
      if (!cur) {
        return cur;
      }
      const current: IDocument = structuredClone(cur);
      const page: { number: number; annotations: Array<IAnnotation> } | undefined =
        current.pages.find((p) => p.number === updatedAnnotation.pageNumber);

      if (page) {
        const annIndex: number = page.annotations.findIndex((a) => a.id === updatedAnnotation.id);

        if (annIndex > -1) {
          page.annotations[annIndex] = { ...updatedAnnotation };
        }
      }

      return current;
    });
  }

  /**
   * Deletes an annotation with the specified ID.
   *
   * @param {string} id The ID of the annotation to be deleted.
   */
  protected deleteAnnotation(id: string): void {
    this.documentSignal.update((cur) => {
      if (!cur) {
        return cur;
      }

      const current: IDocument = structuredClone(cur);

      current.pages.forEach((page) => {
        page.annotations = page.annotations.filter((a) => a.id !== id);
      });

      return current;
    });
  }

  /**
   * Saves the current state of the document.
   */
  protected save(): void {
    this.docService.saveDocument(this.documentSignal() as IDocument);
  }
}
