import { Component, OnInit, ViewChild, AfterViewInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, effect } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
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
import { ConfirmationDialog, ConfirmatonDialogData } from '../confirmation-dialog/confirmation-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerDialog, DialogMode } from '../customer-dialog/customer-dialog';

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

  customers = this.customerService.customers
  loading = this.customerService.loading
  error = this.customerService.error

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly errorEffect = effect(() => {
    const msg = this.error()
    if (msg) {
      this.snackBar.open(msg, 'Close', { duration: 4000 })
    }
  })

  readonly tableEffect = effect(() => {
    this.dataSource.data = this.customers()
    this.applyFilter(this.filterValue)
    this.changeDetectorRef.markForCheck()
  })

  ngOnInit() {
    this.customerService.loadCustomers();
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

  addCustomer() {
    const dialogRef = this.dialog.open(CustomerDialog, {
      data: { mode: DialogMode.Add },
      panelClass: 'customer-dialog',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.customerService.addCustomer(result)
    })
  }

  editCustomer() {
    if (this.selection.selected.length !== 1) return

    const dialogRef = this.dialog.open(CustomerDialog, {
      data: {
        mode: DialogMode.Edit,
        customer: this.selection.selected[0],
        disableClose: true
      },
      panelClass: 'customer-dialog'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.customerService.updateCustomer(result)
      this.selection.clear()
    })
  }

  deleteCustomers() {
    const dialogData: ConfirmatonDialogData = {
      title: 'Delete customers',
      message: 'Do you really want to delete these customers?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return

      this.customerService.deleteCustomers(
        this.selection.selected.map(r => r.id)
      )

      this.selection.clear()
      this.changeDetectorRef.markForCheck()
    })
  }
}
