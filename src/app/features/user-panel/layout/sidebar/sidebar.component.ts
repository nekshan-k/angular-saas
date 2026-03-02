import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import {
  arIcon,
  capIcon,
  casesIcon,
  chatIcon,
  chevronLeftIcon,
  chevronRightIcon,
  ExamZoneIcon,
  commissionIcon,
  clientsIcon,
  dashboardIcon,
  folderIcon,
  myCommissionIcon,
  userManagementIcon,
  type IconDef
} from '../../../../shared/ui/icon';

type SidebarEntry =
  | { type: 'item'; id: string; label: string; icon: IconDef; badge?: string; route?: string }
  | { type: 'divider' };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  chevronLeftIcon = chevronLeftIcon();
  chevronRightIcon = chevronRightIcon();

  activeId = 'user-management';

  constructor(private router: Router) {}

  entries: SidebarEntry[] = [
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: dashboardIcon(), route: '/dashboard' },
    { type: 'divider' },
    { type: 'item', id: 'clients', label: 'Clients', icon: clientsIcon(), badge: '99+' },
    { type: 'item', id: 'cases', label: 'Cases', icon: casesIcon(), badge: '99+' },
    { type: 'divider' },
    {
      type: 'item',
      id: 'user-management',
      label: 'User Management',
      icon: userManagementIcon(),
      route: '/user-management'
    },
    { type: 'item', id: 'ar-management', label: 'AR Management', icon: arIcon(), route: '/ar-management' },
    { type: 'divider' },
    { type: 'item', id: 'cpd', label: 'CPD', icon: capIcon() },
    { type: 'item', id: 'exam-zone', label: 'Exam Zone', icon: ExamZoneIcon() },
    { type: 'divider' },
    { type: 'item', id: 'quick-sourcing', label: 'Quick Sourcing', icon: chatIcon() },
    { type: 'divider' },
    { type: 'item', id: 'commission', label: 'Commission', icon: commissionIcon() },
    { type: 'item', id: 'my-commission', label: 'My Commission', icon: myCommissionIcon() },
    { type: 'divider' },
    { type: 'item', id: 'documents', label: 'Documents Library', icon: folderIcon() }
  ];

  setActive(entry: SidebarEntry): void {
    if (entry.type !== 'item') {
      return;
    }

    if (entry.route) {
      this.storeLastProtectedRoute(entry.route);
      this.router.navigateByUrl(entry.route);
      return;
    }

    this.activeId = entry.id;
  }

  isActive(entry: SidebarEntry): boolean {
    if (entry.type !== 'item') {
      return false;
    }

    if (entry.route) {
      return this.router.url === entry.route;
    }

    return this.activeId === entry.id;
  }

  private storeLastProtectedRoute(route: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem('last_protected_route', route);
  }
}
