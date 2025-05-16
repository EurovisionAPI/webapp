import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { GridSort } from './grid-sort';

@Component({
  selector: 'template-column',
  imports: [],
  template: ''
})
export class TemplateColumnComponent {
  @Input() title: string;
  @ContentChild(TemplateRef) template!: TemplateRef<any>;
  @Input() align: 'start' | 'center' | 'end' = 'start';
  @Input() sortBy: GridSort<any>;

  isSortable(): boolean {
    return this.sortBy != null;
  }
}