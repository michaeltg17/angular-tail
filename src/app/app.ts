import { Component, signal } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [CustomersTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app');

  constructor(private theme: ThemeService) {
    this.theme.init();
  }
}
