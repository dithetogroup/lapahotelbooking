import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RegularClients } from '../../regular.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-regular-client-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './view-regular-client-dialog.component.html',
  styleUrl: './view-regular-client-dialog.component.scss'
})
export class ViewRegularClientDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewRegularClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { regularClient: RegularClients }
  ) {}

  client = this.data.regularClient;

  close(): void {
    this.dialogRef.close();
  }

}
