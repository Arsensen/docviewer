import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { provideRouter } from '@angular/router';

describe('NotFoundComponent', () => {
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display "Page not found" heading', () => {
    const h1: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('Page not found');
  });

  it('should display description text', () => {
    const p: HTMLParagraphElement = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toBe('The page you are looking for does not exist.');
  });

  it('should have a link to /document/1', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.textContent).toBe('Open sample document');
    expect(link.getAttribute('href')).toBe('/document/1');
  });
});
