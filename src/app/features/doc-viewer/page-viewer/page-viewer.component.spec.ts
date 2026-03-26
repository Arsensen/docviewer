import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { PageViewerComponent } from './page-viewer.component';
import { MOCK_PAGE } from '../../../testing/mock-data';
import type { IAnnotation } from '@core/models/annotation.interface';
import type { Mock } from 'vitest';

describe('PageViewerComponent', () => {
  let component: PageViewerComponent;
  let fixture: ComponentFixture<PageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('page', MOCK_PAGE);
    fixture.componentRef.setInput('zoom', 1);
    fixture.detectChanges();
  });

  it('should set wrapper width based on zoom', () => {
    fixture.componentRef.setInput('zoom', 2);
    fixture.detectChanges();

    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.app-page-viewer__wrapper');
    expect(wrapper.style.width).toBe('1600px');
  });

  describe('onPageDblClick', () => {
    it('should emit addAnnotation on double click', () => {
      const emitSpy: Mock<
        (value: { clientX: number; clientY: number; currentTarget: EventTarget }) => void
      > = vi.spyOn(component.addAnnotation, 'emit');

      const pageEl: HTMLElement = fixture.nativeElement.querySelector('.app-page-viewer__page');
      const event: MouseEvent = new MouseEvent('dblclick', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
      });
      pageEl.dispatchEvent(event);

      expect(emitSpy).toHaveBeenCalledWith({
        clientX: 100,
        clientY: 200,
        currentTarget: pageEl,
      });
    });
  });

  describe('updateAnnotation', () => {
    it('should emit annotationUpdated with the updated data', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.annotationUpdated,
        'emit',
      );
      const updated: IAnnotation = { id: 'a1', pageNumber: 1, x: 30, y: 40, text: 'Updated a1' };

      (
        component as unknown as { updateAnnotation: (annotation: IAnnotation) => void }
      ).updateAnnotation(updated);

      expect(emitSpy).toHaveBeenCalledWith(updated);
    });
  });

  describe('onAnnotationMoved', () => {
    it('should emit annotationUpdated with new position', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.annotationUpdated,
        'emit',
      );
      const annotation: IAnnotation = { id: 'a1', pageNumber: 1, x: 10, y: 20, text: 'Test a1' };

      (
        component as unknown as {
          onAnnotationMoved: (annotation: IAnnotation, position: { x: number; y: number }) => void;
        }
      ).onAnnotationMoved(annotation, { x: 55, y: 65 });

      expect(emitSpy).toHaveBeenCalledWith({
        id: 'a1',
        pageNumber: 1,
        x: 55,
        y: 65,
        text: 'Test a1',
      });
    });
  });

  describe('annotationDeleted', () => {
    it('should have an output for deleted annotations', () => {
      const emitSpy: Mock<(value: string) => void> = vi.spyOn(component.annotationDeleted, 'emit');
      (
        component as unknown as { annotationDeleted: { emit: (value: string) => void } }
      ).annotationDeleted.emit('a1');
      expect(emitSpy).toHaveBeenCalledWith('a1');
    });
  });
});
