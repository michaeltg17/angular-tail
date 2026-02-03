import { Component } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeSelector } from './components/theme-selector/theme-selector';

@Component({
  selector: 'app-root',
  imports: [CustomersTable, MatToolbarModule, ThemeSelector],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
