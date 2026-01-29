import { Component, OnInit, ViewChild, AfterViewInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { CustomerCell } from './customer-cell/customer-cell';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeleteDialog, DeleteDialogData } from '../delete-dialog/delete-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    MatCheckboxModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule],
  templateUrl: './customers-table.html',
  styleUrls: ['./customers-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersTable implements OnInit, AfterViewInit {
  private customerService = inject(CustomerService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private changeDetectorRef = inject(ChangeDetectorRef);

  columns = [
    { key: 'id', label: 'Id' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'isActive', label: 'Active' }
  ];
  displayedColumns = ['select', ...this.columns.map((c) => c.key)];
  selection = new SelectionModel<Customer>(true, []);
  dataSource = new MatTableDataSource<Customer>();
  filterValue = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.customerService
      .getCustomers()
      .pipe(
        shareReplay(1),
        catchError((err) => {
          this.snackBar.open(err?.status === 404 ? 'Customers file not found' : 'Failed to load customers', 'Close', {
            duration: 4000
          });
          return of([]);
        })
      )
      .subscribe((customers) => {
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
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  editCustomer() {}

  deleteCustomers() {
    const dialogData: DeleteDialogData = {
      title: 'Delete customers',
      message: 'Do you really want to delete these customers?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(DeleteDialog, {
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.selection.clear();
        this.changeDetectorRef.markForCheck();
        this.customerService.deleteCustomers(this.selection.selected.map(row => row.id)).subscribe(() => {
          this.snackBar.open('Customers deleted successfully', 'Close', {
            duration: 3000
          });
        });
      }
    });
  }
}
