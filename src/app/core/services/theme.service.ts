import { Injectable, computed, signal } from '@angular/core';

type ThemeState = {
  primary: string;
  secondary: string;
};

const STORAGE_KEY = 'wealthmax-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly defaultTheme: ThemeState = {
    primary: '#3874ff',
    secondary: '#f56630'
  };

  private readonly themeState = signal<ThemeState>(this.loadTheme());

  readonly primaryColor = computed(() => this.themeState().primary);
  readonly secondaryColor = computed(() => this.themeState().secondary);

  readonly themeCssVariables = computed<Record<string, string>>(() => {
    const state = this.themeState();
    const primaryShades = this.createPrimaryShades(state.primary);
    const secondaryHover = this.mixWithWhite(state.secondary, 0.86);

    return {
      '--primary-1': primaryShades[0],
      '--primary-2': primaryShades[1],
      '--primary-3': primaryShades[2],
      '--primary-4': primaryShades[3],
      '--primary-5': primaryShades[4],
      '--primary-6': primaryShades[5],
      '--primary-7': primaryShades[6],
      '--primary-8': primaryShades[7],
      '--primary-hover': this.mixWithWhite(state.primary, 0.88),
      '--secondary-1': state.secondary,
      '--secondary-hover': secondaryHover
    };
  });

  setPrimaryColor(color: string): void {
    const normalized = this.normalizeHex(color) ?? this.defaultTheme.primary;
    this.updateTheme({ primary: normalized });
  }

  setSecondaryColor(color: string): void {
    const normalized = this.normalizeHex(color) ?? this.defaultTheme.secondary;
    this.updateTheme({ secondary: normalized });
  }

  private updateTheme(partial: Partial<ThemeState>): void {
    const nextState = { ...this.themeState(), ...partial };
    this.themeState.set(nextState);
    this.saveTheme(nextState);
  }

  private createPrimaryShades(baseHex: string): string[] {
    const base = this.normalizeHex(baseHex) ?? this.defaultTheme.primary;

    return [
      this.mixWithBlack(base, 0.2),
      base,
      this.mixWithWhite(base, 0.18),
      this.mixWithWhite(base, 0.36),
      this.mixWithWhite(base, 0.52),
      this.mixWithWhite(base, 0.66),
      this.mixWithWhite(base, 0.78),
      this.mixWithWhite(base, 0.9)
    ];
  }

  private loadTheme(): ThemeState {
    if (typeof localStorage === 'undefined') {
      return this.defaultTheme;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return this.defaultTheme;
      }

      const parsed = JSON.parse(raw) as Partial<ThemeState>;
      const primary = this.normalizeHex(parsed.primary) ?? this.defaultTheme.primary;
      const secondary = this.normalizeHex(parsed.secondary) ?? this.defaultTheme.secondary;

      return { primary, secondary };
    } catch {
      return this.defaultTheme;
    }
  }

  private saveTheme(theme: ThemeState): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }

  private normalizeHex(color?: string): string | null {
    if (!color) {
      return null;
    }

    const value = color.trim().toLowerCase();
    const full = /^#([0-9a-f]{6})$/;
    const short = /^#([0-9a-f]{3})$/;

    if (full.test(value)) {
      return value;
    }

    const shortMatch = value.match(short);
    if (!shortMatch) {
      return null;
    }

    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  private mixWithWhite(hex: string, ratio: number): string {
    const rgb = this.hexToRgb(hex);
    const mixed = {
      r: Math.round(rgb.r + (255 - rgb.r) * ratio),
      g: Math.round(rgb.g + (255 - rgb.g) * ratio),
      b: Math.round(rgb.b + (255 - rgb.b) * ratio)
    };

    return this.rgbToHex(mixed.r, mixed.g, mixed.b);
  }

  private mixWithBlack(hex: string, ratio: number): string {
    const rgb = this.hexToRgb(hex);
    const mixed = {
      r: Math.round(rgb.r * (1 - ratio)),
      g: Math.round(rgb.g * (1 - ratio)),
      b: Math.round(rgb.b * (1 - ratio))
    };

    return this.rgbToHex(mixed.r, mixed.g, mixed.b);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const normalized = this.normalizeHex(hex) ?? this.defaultTheme.primary;
    const stripped = normalized.slice(1);
    const parsed = Number.parseInt(stripped, 16);

    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255
    };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}
