import { Component, signal } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { ThemeService } from './services/theme.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [CustomersTable, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app');

  constructor(public theme: ThemeService) {
    this.theme.init();
  }
}
