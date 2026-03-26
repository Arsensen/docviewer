import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AnnotationComponent } from './annotation.component';
import { MOCK_ANNOTATION } from '../../../testing/mock-data';
import type { IAnnotation } from '@core/models/annotation.interface';
import type { Mock } from 'vitest';

describe('AnnotationComponent', () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('annotation', MOCK_ANNOTATION);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render textarea with annotation text', () => {
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('.app-annotation__text');
    expect(textarea).toBeTruthy();
    expect(textarea.value.trim()).toBe('Test annotation');
  });

  it('should set width and height from annotation input', () => {
    const wrapper: HTMLElement = fixture.nativeElement.querySelector(
      '.app-annotation__textarea-wrapper',
    );
    expect(wrapper.style.width).toBe('200px');
    expect(wrapper.style.height).toBe('50px');
  });

  describe('emitResizedDimensions', () => {
    it('should emit updateAnnotation when dimensions change', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.updateAnnotation,
        'emit',
      );

      const wrapper: HTMLElement = fixture.nativeElement.querySelector(
        '.app-annotation__textarea-wrapper',
      );
      Object.defineProperty(wrapper, 'offsetWidth', { value: 300 });
      Object.defineProperty(wrapper, 'offsetHeight', { value: 100 });

      (component as unknown as { emitResizedDimensions: () => void }).emitResizedDimensions();

      expect(emitSpy).toHaveBeenCalledWith({
        ...MOCK_ANNOTATION,
        width: 300,
        height: 100,
      });
    });

    it('should not emit when dimensions have not changed', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.updateAnnotation,
        'emit',
      );

      const wrapper: HTMLElement = fixture.nativeElement.querySelector(
        '.app-annotation__textarea-wrapper',
      );
      Object.defineProperty(wrapper, 'offsetWidth', { value: 200 });
      Object.defineProperty(wrapper, 'offsetHeight', { value: 50 });

      (component as unknown as { emitResizedDimensions: () => void }).emitResizedDimensions();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('autoResize', () => {
    it('should adjust textarea height to scrollHeight', () => {
      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector('.app-annotation__text');
      Object.defineProperty(textarea, 'scrollHeight', { value: 80, configurable: true });

      (
        component as unknown as { autoResize: (event: { target: HTMLTextAreaElement }) => void }
      ).autoResize({ target: textarea });

      expect(textarea.style.height).toBe('80px');
    });
  });

  describe('editText', () => {
    it('should emit updateAnnotation with new text on blur', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.updateAnnotation,
        'emit',
      );

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector('.app-annotation__text');
      textarea.value = 'New text';
      textarea.dispatchEvent(new FocusEvent('blur'));

      expect(emitSpy).toHaveBeenCalledWith({
        ...MOCK_ANNOTATION,
        text: 'New text',
      });
    });

    it('should not emit when text is empty', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.updateAnnotation,
        'emit',
      );

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector('.app-annotation__text');
      textarea.value = '';
      textarea.dispatchEvent(new FocusEvent('blur'));

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit when text is only whitespace', () => {
      const emitSpy: Mock<(value: IAnnotation) => void> = vi.spyOn(
        component.updateAnnotation,
        'emit',
      );

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector('.app-annotation__text');
      textarea.value = '   ';
      textarea.dispatchEvent(new FocusEvent('blur'));

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('deleteAnnotation', () => {
    it('should emit deleted with annotation id', () => {
      const emitSpy: Mock<(value: string) => void> = vi.spyOn(component.deleted, 'emit');

      const btn: HTMLButtonElement = fixture.nativeElement.querySelector(
        '.app-annotation__delete-btn',
      );
      btn.click();

      expect(emitSpy).toHaveBeenCalledWith('ann-1');
    });
  });
});
