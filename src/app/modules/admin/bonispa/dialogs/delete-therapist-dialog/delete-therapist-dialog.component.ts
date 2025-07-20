import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-therapist-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './delete-therapist-dialog.component.html',
  styleUrl: './delete-therapist-dialog.component.scss'
})
export class DeleteTherapistDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteTherapistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
