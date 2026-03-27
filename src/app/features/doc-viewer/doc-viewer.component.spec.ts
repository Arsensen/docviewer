import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DocViewerComponent } from './doc-viewer.component';
import { DocumentService } from '@core/services/document.service';
import { MOCK_DOCUMENT_2 } from '../../testing/mock-data';
import type { IAnnotation } from '@core/models/annotation.interface';

vi.mock('uuid', () => ({
  v4: (): string => 'mock-uuid-1234',
}));

describe('DocViewerComponent', () => {
  let component: DocViewerComponent;
  let fixture: ComponentFixture<DocViewerComponent>;
  let mockDocService: {
    getDocument: ReturnType<typeof vi.fn>;
    saveDocument: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockDocService = {
      getDocument: vi.fn().mockReturnValue(structuredClone(MOCK_DOCUMENT_2)),
      saveDocument: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DocViewerComponent],
      providers: [
        { provide: DocumentService, useValue: mockDocService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: (): string => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should load document from route param on init', () => {
    expect(mockDocService.getDocument).toHaveBeenCalledWith('1');
  });

  it('should have success loading state after init', () => {
    expect((component as unknown as { loadingState: () => string }).loadingState()).toBe('success');
  });

  it('should expose document name', () => {
    expect((component as unknown as { documentName: () => string }).documentName()).toBe(
      'Test Document',
    );
  });

  it('should set error state when document loading fails', () => {
    mockDocService.getDocument.mockImplementation(() => {
      throw new Error('Network error');
    });

    (component as unknown as { loadDocument: () => void }).loadDocument();

    expect((component as unknown as { loadingState: () => string }).loadingState()).toBe('error');
    expect((component as unknown as { errorMessage: () => string }).errorMessage()).toBe(
      'Network error',
    );
  });

  it('should recover from error state on retry', () => {
    mockDocService.getDocument.mockImplementation(() => {
      throw new Error('Network error');
    });
    (component as unknown as { loadDocument: () => void }).loadDocument();

    mockDocService.getDocument.mockReturnValue(structuredClone(MOCK_DOCUMENT_2));
    (component as unknown as { loadDocument: () => void }).loadDocument();

    expect((component as unknown as { loadingState: () => string }).loadingState()).toBe('success');
    expect((component as unknown as { errorMessage: () => string }).errorMessage()).toBe('');
  });

  it('should expose pages from document', () => {
    const pages: Array<{ number: number }> = (
      component as unknown as { pages: () => Array<{ number: number }> }
    ).pages();
    expect(pages).toHaveLength(2);
    expect(pages[0].number).toBe(1);
    expect(pages[1].number).toBe(2);
  });

  describe('zoom', () => {
    it('should have initial zoom of 1', () => {
      expect((component as unknown as { zoom: () => number }).zoom()).toBe(1);
    });

    it('should increase zoom on zoomIn()', () => {
      (component as unknown as { zoomIn: () => void }).zoomIn();
      expect((component as unknown as { zoom: () => number }).zoom()).toBeCloseTo(1.1, 5);
    });

    it('should decrease zoom on zoomOut()', () => {
      (component as unknown as { zoomOut: () => void }).zoomOut();
      expect((component as unknown as { zoom: () => number }).zoom()).toBeCloseTo(0.9, 5);
    });

    it('should not exceed max zoom of 3', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      for (let i = 0; i < 30; i++) {
        (component as unknown as { zoomIn: () => void }).zoomIn();
      }
      expect((component as unknown as { zoom: () => number }).zoom()).toBe(3);
    });

    it('should not go below min zoom of 0.5', () => {
      // eslint-disable-next-line @typescript-eslint/typedef
      for (let i = 0; i < 20; i++) {
        (component as unknown as { zoomOut: () => void }).zoomOut();
      }
      expect((component as unknown as { zoom: () => number }).zoom()).toBe(0.5);
    });
  });

  describe('addAnnotation', () => {
    it('should add annotation to the correct page', () => {
      const mockTarget: HTMLDivElement = document.createElement('div');
      vi.spyOn(mockTarget, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
        right: 800,
        bottom: 600,
        x: 0,
        y: 0,
        toJSON: () => {
          /* empty */
        },
      });

      (
        component as unknown as {
          addAnnotation: (
            pageNumber: number,
            event: { clientX: number; clientY: number; currentTarget: HTMLDivElement },
          ) => void;
        }
      ).addAnnotation(1, {
        clientX: 400,
        clientY: 300,
        currentTarget: mockTarget,
      });

      const pages: Array<{ annotations: Array<IAnnotation> }> = (
        component as unknown as { pages: () => Array<{ annotations: Array<IAnnotation> }> }
      ).pages();
      const page1Annotations: Array<IAnnotation> = pages[0].annotations;
      expect(page1Annotations).toHaveLength(1);
      expect(page1Annotations[0]).toEqual({
        id: 'mock-uuid-1234',
        pageNumber: 1,
        x: 50,
        y: 50,
        text: 'New annotation',
      });
    });
  });

  describe('updateAnnotation', () => {
    it('should update existing annotation', () => {
      const updated: IAnnotation = {
        id: 'ann-1',
        pageNumber: 2,
        x: 50,
        y: 60,
        text: 'Updated text',
      };

      (
        component as unknown as { updateAnnotation: (annotation: IAnnotation) => void }
      ).updateAnnotation(updated);

      const page2: { annotations: Array<IAnnotation> } = (
        component as unknown as { pages: () => Array<{ annotations: Array<IAnnotation> }> }
      ).pages()[1];
      expect(page2.annotations[0].text).toBe('Updated text');
      expect(page2.annotations[0].x).toBe(50);
      expect(page2.annotations[0].y).toBe(60);
    });

    it('should not crash when document is null', () => {
      (
        component as unknown as { documentSignal: { set: (value: null) => void } }
      ).documentSignal.set(null);

      expect(() => {
        (
          component as unknown as { updateAnnotation: (annotation: IAnnotation) => void }
        ).updateAnnotation({
          id: 'ann-1',
          pageNumber: 2,
          x: 0,
          y: 0,
          text: 'test',
        });
      }).not.toThrow();
    });
  });

  describe('deleteAnnotation', () => {
    it('should remove annotation by id', () => {
      (component as unknown as { deleteAnnotation: (id: string) => void }).deleteAnnotation(
        'ann-1',
      );

      const page2: { annotations: Array<IAnnotation> } = (
        component as unknown as { pages: () => Array<{ annotations: Array<IAnnotation> }> }
      ).pages()[1];
      expect(page2.annotations).toHaveLength(0);
    });

    it('should not crash when document is null', () => {
      (
        component as unknown as { documentSignal: { set: (value: null) => void } }
      ).documentSignal.set(null);
      expect(() => {
        (component as unknown as { deleteAnnotation: (id: string) => void }).deleteAnnotation(
          'ann-1',
        );
      }).not.toThrow();
    });
  });

  describe('save', () => {
    it('should call docService.saveDocument with current document', () => {
      (component as unknown as { save: () => void }).save();

      expect(mockDocService.saveDocument).toHaveBeenCalledTimes(1);
      const savedDoc: { name: string } = mockDocService.saveDocument.mock.calls[0][0];
      expect(savedDoc.name).toBe('Test Document');
    });
  });
});
