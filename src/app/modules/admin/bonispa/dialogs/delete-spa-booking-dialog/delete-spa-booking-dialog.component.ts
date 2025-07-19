import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-spa-booking-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, DatePipe],

  templateUrl: './delete-spa-booking-dialog.component.html',
  styleUrl: './delete-spa-booking-dialog.component.scss'
})
export class DeleteSpaBookingDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteSpaBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
