import { Injectable } from '@angular/core';
import { Theme, ThemeColor, themeColors, ThemeType, themeTypes } from '../models/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme';
  currentTheme = new Theme('light', 'blue');

  setThemeColor(color: ThemeColor) {
    this.currentTheme = { ...this.currentTheme, color };
    this.applyTheme();
    this.persistTheme();
  }

  setThemeType(type: ThemeType) {
    this.currentTheme = { ...this.currentTheme, type };
    this.applyTheme();
    this.persistTheme();
  }

  loadTheme() {
    const json = localStorage.getItem(this.storageKey);
    if (!json) {
      this.applyTheme();
      return;
    }

    try {
      this.currentTheme = JSON.parse(json);
      this.applyTheme();
      // eslint-disable-next-line no-empty
    } catch {}
  }

  private applyTheme() {
    const html = document.documentElement;
    html.classList.remove(...themeTypes, ...themeColors);
    html.classList.add(this.currentTheme.type, this.currentTheme.color);
  }

  private persistTheme() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.currentTheme));
  }
}
