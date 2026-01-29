import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DeleteDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.html',
  styleUrls: ['./delete-dialog.scss'],
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteDialog {
  data: DeleteDialogData = inject(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef<DeleteDialog>);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
