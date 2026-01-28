import { Component, OnInit, inject } from '@angular/core';
import { CustomersTable } from './components/customers-table/customers-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from './services/theme.service';
import { themeColors, themeModes } from './models/theme';

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
    MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  themeService = inject(ThemeService);
  themeColors = themeColors;
  themeModes = themeModes;

  ngOnInit() {
    this.themeService.loadTheme();
  }
}
