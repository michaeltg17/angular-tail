import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'theme';

  init() {
    const saved = localStorage.getItem(this.key);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(this.key, isDark ? 'dark' : 'light');
  }

  isDark() {
    return document.documentElement.classList.contains('dark');
  }
}
