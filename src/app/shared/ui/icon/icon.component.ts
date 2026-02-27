import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type IconDef = {
  svg: string;
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [class]="classes"
      [style.display]="'inline-flex'"
      [style.color]="color"
      [innerHTML]="renderedSvg"
    ></span>
  `
})
export class IconComponent {
  constructor(private readonly sanitizer: DomSanitizer) {}

  @Input() icon: IconDef = {
    svg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z"/></svg>'
  };
  @Input() size: number = 24;
  @Input() color: string = 'currentColor';
  @Input() classes: string = '';

  get renderedSvg(): SafeHtml {
    const svg = this.icon.svg
      .replace(/width="[^"]*"/, `width="${this.size}"`)
      .replace(/height="[^"]*"/, `height="${this.size}"`);

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
