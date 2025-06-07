import { CommonModule, NgClass, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { CancelBookingsService } from '../cancel-bookings.service';

@Component({
  selector: 'app-change-refund-status-modal',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatOptionModule,
    MatDialogModule
  ],
  templateUrl: './change-refund-status-modal.component.html',
  styleUrl: './change-refund-status-modal.component.scss'
})
export class ChangeRefundStatusModalComponent {

  refundStatus: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangeRefundStatusModalComponent>
 
  ) {
    this.refundStatus = this.fb.group({
      refund_status: ['', Validators.required],
      booking_reference: data.booking_reference
    });
  }

  changeRefundStatus(): void {
    if (this.refundStatus.valid) {
      this.dialogRef.close(this.refundStatus.value);
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}


