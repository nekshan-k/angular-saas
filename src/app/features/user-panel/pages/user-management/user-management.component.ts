import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent, type TableAction, type TableColumn } from '../../../../shared/ui/table/table.component';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent {
  columns: TableColumn[] = [
    {
      header: 'User',
      type: 'user',
      sortable: true,
      field: 'name',
      nameField: 'name',
      idField: 'userId',
      statusField: 'status'
    },
    { header: 'Email', field: 'email', type: 'text', sortable: true },
    { header: 'Role', field: 'role', type: 'text', sortable: true },
    { header: 'Joined', field: 'joinedAt', type: 'date', sortable: true },
    { header: 'Actions', type: 'actions' }
  ];

  records = [
    { id: 1, userId: 'USR-1001', name: 'Aarav Shah', status: 'active', email: 'aarav@wealthmax.com', role: 'Advisor', joinedAt: '2025-01-15' },
    { id: 2, userId: 'USR-1002', name: 'Mia Johnson', status: 'pending', email: 'mia@wealthmax.com', role: 'Manager', joinedAt: '2025-03-10' },
    { id: 3, userId: 'USR-1003', name: 'Noah Patel', status: 'active', email: 'noah@wealthmax.com', role: 'Advisor', joinedAt: '2024-11-08' },
    { id: 4, userId: 'USR-1004', name: 'Sophia Khan', status: 'blocked', email: 'sophia@wealthmax.com', role: 'Reviewer', joinedAt: '2024-09-21' },
    { id: 5, userId: 'USR-1005', name: 'Liam Brown', status: 'active', email: 'liam@wealthmax.com', role: 'Admin', joinedAt: '2023-12-01' },
    { id: 6, userId: 'USR-1006', name: 'Olivia Smith', status: 'pending', email: 'olivia@wealthmax.com', role: 'Advisor', joinedAt: '2025-02-02' }
  ];

  getRowActions = (row: any): { direct: TableAction[] } => ({
    direct: [
      { key: 'view', label: 'View' },
      { key: 'edit', label: 'Edit' }
    ]
  });

  onAction(event: { key: string; row: any }): void {
    console.log(event);
  }
}
