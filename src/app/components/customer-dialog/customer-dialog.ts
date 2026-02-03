import { Component, inject } from '@angular/core'
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'
import { Customer } from '../../models/customer'
import { DialogMode } from '../../models/dialogMode'

@Component({
  standalone: true,
  selector: 'app-customer-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './customer-dialog.html'
})
export class CustomerDialog {
  private dialogRef = inject(MatDialogRef<CustomerDialog>)
  data = inject<{ mode: DialogMode; customer?: Customer }>(MAT_DIALOG_DATA)
  dialogMode = DialogMode;

  firstName = new FormControl(this.data.customer?.firstName ?? '', {
    nonNullable: true,
    validators: Validators.required
  })

  lastName = new FormControl(this.data.customer?.lastName ?? '', {
    nonNullable: true,
    validators: Validators.required
  })

  email = new FormControl(this.data.customer?.email ?? '', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  })

  isActive = new FormControl(this.data.customer?.isActive ?? true, {
    nonNullable: true
  })

  constructor() {
    if (this.data.mode === DialogMode.View) {
      this.firstName.disable()
      this.lastName.disable()
      this.email.disable()
      this.isActive.disable()
    }
  }

  isValid(): boolean {
    return this.firstName.valid && this.lastName.valid && this.email.valid
  }

  save() {
    if (!this.isValid()) {
      return
    }

    this.dialogRef.close({
      id: this.data.customer?.id ?? 0,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      isActive: this.isActive.value
    })
  }

  cancel() {
    this.dialogRef.close()
  }
}
