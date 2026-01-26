import { Component } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { themeColors } from './models/theme';

@Component({
  selector: 'app-root',
  imports: [
    CustomersTable, 
    MatToolbarModule, 
    MatSelectModule, 
    MatFormFieldModule, 
    CommonModule, 
    MatIconModule, 
    MatRadioModule, 
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  selectedPalette = themeColors[1];

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) this.selectedPalette = savedTheme;
    document.documentElement.className = this.selectedPalette;
  }

  setTheme(theme: string) {
    this.selectedPalette = theme;
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }

  setMode(mode: 'light' | 'dark') {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(mode);
  }

}
