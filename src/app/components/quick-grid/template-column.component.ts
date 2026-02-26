import { Component, computed, ContentChild, input, Input, TemplateRef } from '@angular/core';
import { GridSort } from './grid-sort';

@Component({
  selector: 'template-column',
  imports: [],
  template: ''
})
export class TemplateColumnComponent {
  @ContentChild(TemplateRef) template!: TemplateRef<any>;

  title = input.required<string>();
  align = input<'start' | 'center' | 'end'>('start');
  sortBy = input<GridSort<any> | null>(null);

  isSortable = computed(() => this.sortBy() != null);
}