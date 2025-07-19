import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-regular-client',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './delete-regular-client.component.html',
  styleUrl: './delete-regular-client.component.scss'
})
export class DeleteRegularClientComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteRegularClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account: string }
  ) {}

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
