import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  dialogTestId: string;
  title: string;
  message: string;
  confirmLabel: string;
  confirmTestId: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div [attr.data-testid]="data.dialogTestId">
      <h2 mat-dialog-title [id]="titleId">{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" data-testid="btn-cancel" (click)="dialogRef.close(false)">Abbrechen</button>
        <button
          mat-raised-button
          color="warn"
          type="button"
          [attr.data-testid]="data.confirmTestId"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmLabel }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ConfirmDialogComponent {
  readonly titleId = 'confirm-dialog-title';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
}
