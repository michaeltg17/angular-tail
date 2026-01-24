import { Component, signal } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CustomersTable, MatToolbarModule, MatButtonModule, MatSelectModule, MatFormFieldModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  palettes = [
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta',
    'orange',
    'chartreuse',
    'spring-green',
    'azure',
    'violet',
    'rose',
  ];
  selectedPalette = this.palettes[1];

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
}
