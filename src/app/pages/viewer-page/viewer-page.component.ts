import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocViewerComponent } from '@features/doc-viewer/doc-viewer.component';

@Component({
  selector: 'app-viewer-page',
  imports: [DocViewerComponent],
  templateUrl: './viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerPageComponent {}
