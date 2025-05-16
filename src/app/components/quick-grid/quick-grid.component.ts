import { Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';
import { TemplateColumnComponent } from './template-column.component';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'quick-grid',
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './quick-grid.component.html',
  styleUrl: './quick-grid.component.css'
})
export class QuickGridComponent<T> implements OnInit {

  @Input() items: T[] = [];
  @ContentChildren(TemplateColumnComponent) columns!: QueryList<TemplateColumnComponent>;

  protected sortColumn: TemplateColumnComponent;
  protected isAscending: boolean;
  protected sortedItems: T[];

  ngOnInit(): void {
    this.sortItems();
  }

  private sortItems() {
    if (this.sortColumn) {
      this.sortedItems = this.sortColumn.sortBy.apply(this.items, this.isAscending);
    } else{
      this.sortedItems = this.items;
    }
  }

  protected onColumnClick(column: TemplateColumnComponent) {
    if (this.sortColumn == column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortColumn = column;
      this.isAscending = true;
    }

    this.sortItems();
  }

  protected getSortClass(column: TemplateColumnComponent): string {
    return this.sortColumn === column
      ? (this.isAscending ? 'col-sort-asc' : 'col-sort-desc')
      : '';
  }

  protected getAlignClass(column: TemplateColumnComponent): string {
    return `col-justify-${column.align}`;
  }
}
