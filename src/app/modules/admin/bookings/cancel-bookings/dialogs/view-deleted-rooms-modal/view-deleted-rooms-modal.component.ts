import { Component, Inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Occupancy } from 'app/modules/admin/occupancy/occupancy.model';

@Component({
  selector: 'app-view-deleted-rooms-modal',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatTabsModule
  ],
  templateUrl: './view-deleted-rooms-modal.component.html',
  styleUrl: './view-deleted-rooms-modal.component.scss'
})
export class ViewDeletedRoomsModalComponent implements OnInit{

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDeletedRoomsModalComponent>
  ) {
  }

  ngOnInit(): void {
    console.log('Passed Data', this.data);
  }

}
