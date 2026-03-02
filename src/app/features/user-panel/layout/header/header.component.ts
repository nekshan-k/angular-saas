import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { appsIcon, bellIcon } from '../../../../shared/ui/icon/icons';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isThemePanelOpen = false;

  bellIcon = bellIcon();
  appsIcon = appsIcon();

  readonly primaryColor;
  readonly secondaryColor;

  constructor(private readonly themeService: ThemeService) {
    this.primaryColor = this.themeService.primaryColor;
    this.secondaryColor = this.themeService.secondaryColor;
  }

  toggleThemePanel(): void {
    this.isThemePanelOpen = !this.isThemePanelOpen;
  }

  onPrimaryColorChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.themeService.setPrimaryColor(value);
  }

  onSecondaryColorChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.themeService.setSecondaryColor(value);
  }
}
