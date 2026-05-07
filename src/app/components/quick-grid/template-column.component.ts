import { Component, computed, ContentChild, input, TemplateRef } from '@angular/core';
import { GridSort } from './grid-sort';

@Component({
  selector: 'template-column',
  imports: [],
  template: ''
})
export class TemplateColumnComponent {
  @ContentChild(TemplateRef) template!: TemplateRef<any>;

  readonly title = input.required<string>();
  readonly align = input<'start' | 'center' | 'end'>('start');
  readonly sortBy = input<GridSort<any> | null>(null);

  readonly isSortable = computed(() => this.sortBy() != null);
}