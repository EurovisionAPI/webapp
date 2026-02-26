import { Component, computed, ContentChildren, input, QueryList, signal } from '@angular/core';
import { TemplateColumnComponent } from './template-column.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'quick-grid',
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './quick-grid.component.html',
  styleUrl: './quick-grid.component.css'
})
export class QuickGridComponent<T> {
  @ContentChildren(TemplateColumnComponent) columns!: QueryList<TemplateColumnComponent>;

  items = input.required<T[]>();

  private sortColumn = signal<TemplateColumnComponent | null>(null);
  private isAscending = signal<boolean>(true);
  protected sortedItems = computed<T[]>(() => this.sortItems());

  private sortItems() {
    return this.sortColumn()
      ? this.sortColumn().sortBy().apply(this.items(), this.isAscending())
      : this.items();
  }

  protected onColumnClick(column: TemplateColumnComponent) {
    if (this.sortColumn() == column) {
      this.isAscending.update(value => !value);
    } else {
      this.sortColumn.set(column);
      this.isAscending.set(true);
    }
  }

  protected getSortClass(column: TemplateColumnComponent): string {
    return this.sortColumn() === column
      ? (this.isAscending() ? 'col-sort-asc' : 'col-sort-desc')
      : '';
  }

  protected getAlignClass(column: TemplateColumnComponent): string {
    return `col-justify-${column.align}`;
  }
}
