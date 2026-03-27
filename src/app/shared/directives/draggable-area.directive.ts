import type { OnInit } from '@angular/core';
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appDraggableArea]',
})
export class DraggableAreaDirective implements OnInit {
  // Dependencies
  private readonly el: ElementRef<HTMLElement> = inject(ElementRef);

  public ngOnInit(): void {
    const element: HTMLElement = this.el.nativeElement;
    element.style.position = 'relative';
  }
}
