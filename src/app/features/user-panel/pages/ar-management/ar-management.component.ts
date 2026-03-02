import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ModalWrapperComponent } from '../../../../shared/ui/modal-wrapper/modal-wrapper.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { TableComponent, type TableAction, type TableColumn } from '../../../../shared/ui/table/table.component';
import { isPlatformBrowser } from '@angular/common';
import { CreateEditArComponent } from './ar-component/create-edit-ar/create-edit-ar.component';

@Component({
  selector: 'app-ar-management-page',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent, ModalWrapperComponent, ButtonComponent, TableComponent, CreateEditArComponent],
  templateUrl: './ar-management.component.html'
})
export class ArManagementComponent {
  private readonly storageKey = 'wealthmax-ar-records';
  private readonly isBrowser: boolean;

  hasData = false;
  isAddArModalOpen = false;
  arRecords: any[] = [];

  columns: TableColumn[] = [
    {
      header: 'Company Name',
      type: 'user',
      sortable: true,
      field: 'companyName',
      nameField: 'companyName',
      idField: 'companyId',
      statusField: 'status'
    },
    { header: 'Created Date', field: 'createdDate', type: 'date', sortable: true },
    { header: 'Principal AR', field: 'principalAr', type: 'text', sortable: true },
    { header: 'Company Email', field: 'companyEmail', type: 'text', sortable: true },
    { header: 'Credits', field: 'credits', type: 'text', sortable: true },
    { header: 'Action', type: 'actions' }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadRecords();
  }

  openAddArModal(): void {
    this.isAddArModalOpen = true;
  }

  closeAddArModal(): void {
    this.isAddArModalOpen = false;
  }

  getRowActions = (row: any): { menu: TableAction[] } => ({
    menu: [
      { key: 'view', label: 'View' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' }
    ]
  });

  onAction(event: { key: string; row: any }): void {
    void event;
  }

  onCreateArSave(payload: any): void {
    const now = new Date();
    const id = `RPHX-${String(this.arRecords.length + 1).padStart(4, '0')}`;

    const record = {
      id,
      companyId: id,
      companyName: payload.companyName || 'Untitled Company',
      createdDate: now.toISOString(),
      principalAr: payload.principalAr || '-',
      companyEmail: payload.contactEmail || '-',
      credits: payload.credits || '0',
      status: 'active',
      details: { ...payload }
    };

    this.arRecords = [record, ...this.arRecords];
    this.hasData = this.arRecords.length > 0;
    this.persistRecords();
    this.closeAddArModal();
  }

  private loadRecords(): void {
    if (!this.isBrowser) {
      this.hasData = false;
      this.arRecords = [];
      return;
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      this.arRecords = raw ? JSON.parse(raw) : [];
    } catch {
      this.arRecords = [];
    }

    this.hasData = this.arRecords.length > 0;
  }

  private persistRecords(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.arRecords));
  }
}
