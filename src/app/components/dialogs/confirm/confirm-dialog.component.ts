import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string;
  text: string;
  confirmButtonText: string;
  cancelButtonText: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: {title: string, text: string, confirmButtonText: string, cancelButtonText?: string}
  ) {
    ({
      title: this.title,
      text: this.text,
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: this.cancelButtonText = 'Отмена'
    } = this.dialogData);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
