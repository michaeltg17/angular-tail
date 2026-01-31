import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { Customer } from '../../models/customer'

export type DialogMode = 'add' | 'edit' | 'view';

export interface CustomerDialogData {
  mode: DialogMode,
  customer?: Customer
}

@Component({
  standalone: true,
  selector: 'app-customer-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './customer-dialog.html'
})
export class CustomerDialog {
  private dialogRef = inject(MatDialogRef<CustomerDialog>)
  data = inject<CustomerDialogData>(MAT_DIALOG_DATA)

  customer: Customer = this.data.mode === 'edit'
    ? { ...this.data.customer! }
    : {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        isActive: true
      }

  save() {
    this.dialogRef.close(this.customer)
  }

  cancel() {
    this.dialogRef.close()
  }
}
