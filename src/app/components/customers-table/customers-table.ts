import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { CustomerCell } from './customer-cell/customer-cell';
import { FormsModule, NgModel } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-customers-table',
  imports: [
    MatTableModule,
    MatSnackBarModule,
    MatSortModule,
    MatPaginatorModule,
    CustomerCell,
    FormsModule,
    DragDropModule,
    MatCheckboxModule
  ],
  templateUrl: './customers-table.html',
  styleUrls: ['./customers-table.scss'],
})
export class CustomersTable implements OnInit, AfterViewInit {
  columns = [
    { key: 'id', label: 'Id' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'isActive', label: 'Active' }
  ];
  displayedColumns = ['select', ...this.columns.map(c => c.key)];
  selection = new SelectionModel<Customer>(true, []);
  dataSource = new MatTableDataSource<Customer>();
  filterValue: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.customerService.getCustomers().pipe(
      shareReplay(1),
      catchError(err => {
        this.snackBar.open(
          err?.status === 404 ? 'Customers file not found' : 'Failed to load customers',
          'Close',
          { duration: 4000 }
        );
        return of([]);
      })
    ).subscribe(customers => {
      this.dataSource.data = customers;
      this.applyFilter(this.filterValue);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.filterValue = value.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  
  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row))
  }
}