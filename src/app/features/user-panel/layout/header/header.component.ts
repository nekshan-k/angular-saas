import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { appsIcon, bellIcon, sunIcon } from '../../../../shared/ui/icon/icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  sunIcon = sunIcon();
  bellIcon = bellIcon();
  appsIcon = appsIcon();
}
