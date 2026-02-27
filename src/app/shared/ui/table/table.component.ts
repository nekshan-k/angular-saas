import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type TableSortOrder = 1 | -1 | 0;

export type TableAction = {
  key: string;
  label: string;
  className?: string;
};

export type TableColumn = {
  field?: string;
  header: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'currency' | 'status' | 'badge' | 'user' | 'actions';
  idField?: string;
  nameField?: string;
  statusField?: string;
  currencySymbol?: string;
};

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() records: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() selectable = true;
  @Input() initialRows = 10;
  @Input() highlightTerm = '';
  @Input() emptyHtml = 'No records found';
  @Input() addNewLinkLabel?: string;
  @Input() serverSideSort = false;
  @Input() sortField?: string | null;
  @Input() sortOrder?: TableSortOrder;
  @Input() pageSizeOptions: Array<{ label: string; value: number }> = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
  ];
  @Input() actions?: (row: any) => { direct?: TableAction[]; menu?: TableAction[] };

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() action = new EventEmitter<any>();
  @Output() onAddNew = new EventEmitter<void>();
  @Output() sortChange = new EventEmitter<{ field?: string; order: TableSortOrder }>();

  selection: any[] = [];
  rows = 10;
  first = 0;
  localSortField?: string;
  localSortOrder: TableSortOrder = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialRows']) {
      this.rows = typeof this.initialRows === 'number' && this.initialRows > 0 ? this.initialRows : 10;
    }

    if (changes['sortField']) {
      this.localSortField = this.sortField ?? undefined;
    }

    if (changes['sortOrder']) {
      this.localSortOrder = (this.sortOrder ?? 0) as TableSortOrder;
    }

    if (changes['records']) {
      this.syncSelection();
    }
  }

  get effectiveSortField(): string | undefined {
    if (this.sortField === null) return undefined;
    return this.sortField === undefined ? this.localSortField : this.sortField;
  }

  get effectiveSortOrder(): TableSortOrder {
    return (this.sortOrder ?? this.localSortOrder) as TableSortOrder;
  }

  get sortedRecords(): any[] {
    const list = Array.isArray(this.records) ? [...this.records] : [];
    if (this.serverSideSort || !this.effectiveSortField || !this.effectiveSortOrder) {
      return list;
    }

    const field = this.effectiveSortField;
    const order = this.effectiveSortOrder;

    return list.sort((a, b) => {
      const av = a?.[field];
      const bv = b?.[field];

      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return order === 1 ? av - bv : bv - av;
      }

      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as === bs) return 0;
      return order === 1 ? (as > bs ? 1 : -1) : as > bs ? -1 : 1;
    });
  }

  get visibleRecords(): any[] {
    if (this.serverSideSort) {
      return this.records;
    }
    const start = this.first;
    const end = this.first + this.rows;
    return this.sortedRecords.slice(start, end);
  }

  get total(): number {
    return this.totalRecords || this.records.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.rows));
  }

  get currentPage(): number {
    return Math.floor(this.first / this.rows);
  }

  get allVisibleSelected(): boolean {
    if (!this.visibleRecords.length) return false;
    return this.visibleRecords.every((row) => this.isSelected(row));
  }

  get someVisibleSelected(): boolean {
    if (!this.visibleRecords.length) return false;
    return this.visibleRecords.some((row) => this.isSelected(row)) && !this.allVisibleSelected;
  }

  isSelected(row: any): boolean {
    return this.selection.includes(row);
  }

  toggleRow(row: any, checked: boolean): void {
    if (checked) {
      if (!this.selection.includes(row)) {
        this.selection = [...this.selection, row];
      }
    } else {
      this.selection = this.selection.filter((r) => r !== row);
    }
    this.selectionChange.emit(this.selection);
  }

  toggleAllVisible(checked: boolean): void {
    if (checked) {
      const merged = [...this.selection];
      for (const row of this.visibleRecords) {
        if (!merged.includes(row)) {
          merged.push(row);
        }
      }
      this.selection = merged;
    } else {
      this.selection = this.selection.filter((row) => !this.visibleRecords.includes(row));
    }
    this.selectionChange.emit(this.selection);
  }

  clearSelection(): void {
    this.selection = [];
    this.selectionChange.emit(this.selection);
  }

  onSort(column: TableColumn): void {
    if (!column.sortable || !column.field) {
      return;
    }

    if (this.effectiveSortField !== column.field) {
      this.localSortField = column.field;
      this.localSortOrder = 1;
    } else if (this.effectiveSortOrder === 1) {
      this.localSortOrder = -1;
    } else if (this.effectiveSortOrder === -1) {
      this.localSortOrder = 0;
      this.localSortField = undefined;
    } else {
      this.localSortField = column.field;
      this.localSortOrder = 1;
    }

    this.sortChange.emit({ field: this.localSortField, order: this.localSortOrder });

    if (this.serverSideSort) {
      this.lazyLoad.emit({ first: this.first, rows: this.rows, sortField: this.localSortField, sortOrder: this.localSortOrder });
    }
  }

  onPageSizeChange(): void {
    this.first = 0;
    this.lazyLoad.emit({ first: this.first, rows: this.rows, size: this.rows, page: 0 });
  }

  prevPage(): void {
    if (this.currentPage <= 0) return;
    this.first = Math.max(0, this.first - this.rows);
    this.lazyLoad.emit({ first: this.first, rows: this.rows, size: this.rows, page: this.currentPage });
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages - 1) return;
    this.first = this.first + this.rows;
    this.lazyLoad.emit({ first: this.first, rows: this.rows, size: this.rows, page: this.currentPage });
  }

  getSortIndicator(column: TableColumn): string {
    if (!column.field || this.effectiveSortField !== column.field || !this.effectiveSortOrder) {
      return '↕';
    }
    return this.effectiveSortOrder === 1 ? '↑' : '↓';
  }

  displayValue(row: any, col: TableColumn): string {
    if (!col.field) return '';
    const value = row?.[col.field];
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (col.type === 'date') {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return String(value);
      }
      return date.toLocaleDateString('en-GB');
    }

    if (col.type === 'currency') {
      return `${col.currencySymbol ?? '£'} ${Number(value).toLocaleString('en-GB')}`;
    }

    return String(value);
  }

  getUserName(row: any, col: TableColumn): string {
    const field = col.nameField ?? 'name';
    return row?.[field] ?? '-';
  }

  getUserId(row: any, col: TableColumn): string {
    const field = col.idField ?? 'id';
    return row?.[field] ?? '-';
  }

  getUserStatus(row: any, col: TableColumn): string {
    const field = col.statusField ?? 'status';
    return row?.[field] ?? 'inactive';
  }

  getStatusDotClass(status: string): string {
    const value = String(status || '').toLowerCase();
    if (value === 'active') return 'bg-green-500';
    if (value === 'pending') return 'bg-amber-500';
    if (value === 'blocked') return 'bg-red-500';
    return 'bg-gray-400';
  }

  getStatusPillClass(status: string): string {
    const value = String(status || '').toLowerCase();
    if (value === 'active') return 'bg-green-100 text-green-700';
    if (value === 'pending') return 'bg-amber-100 text-amber-700';
    if (value === 'blocked') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  }

  emitAction(key: string, row: any): void {
    this.action.emit({ key, row });
  }

  getDirectActions(row: any): TableAction[] {
    if (!this.actions) {
      return [];
    }
    return this.actions(row).direct ?? [];
  }

  private syncSelection(): void {
    if (!Array.isArray(this.records) || !this.records.length) {
      this.selection = [];
      this.selectionChange.emit(this.selection);
      return;
    }

    this.selection = this.selection.filter((row) => this.records.includes(row));
    this.selectionChange.emit(this.selection);
  }

  highlight(value: unknown): string {
    const text = value === undefined || value === null ? '' : String(value);
    const term = (this.highlightTerm || '').trim();
    if (!term) return this.escapeHtml(text);

    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    let i = 0;
    let out = '';

    while (true) {
      const hit = lowerText.indexOf(lowerTerm, i);
      if (hit < 0) {
        out += this.escapeHtml(text.slice(i));
        break;
      }

      out += this.escapeHtml(text.slice(i, hit));
      out += `<span class="text-primary-2">${this.escapeHtml(text.slice(hit, hit + term.length))}</span>`;
      i = hit + term.length;
      if (i >= text.length) break;
    }

    return out;
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
