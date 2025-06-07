import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Occupancy } from '../occupancy.model';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OccupancyService } from '../occupancy.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { CancelBookingDialogComponent } from '../cancel-booking-dialog/cancel-booking-dialog.component';

@Component({
    selector: 'app-guest-details-dialog',
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatFormFieldModule,
      MatTabsModule,
      MatButtonModule,
      MatInputModule,
      MatDatepickerModule,
      MatIconModule,
      MatCardModule,
      MatOptionModule,
      MatSelectModule,
      CommonModule,
      MatStepperModule,
      MatCheckboxModule,
      MatBottomSheetModule
    ],
    templateUrl: './guest-details-dialog.component.html',
    styleUrl: './guest-details-dialog.component.scss'
})
export class GuestDetailsDialogComponent implements OnInit{
  roomData: Occupancy;
  dialogTitle: string;
  loading = false;
  isEditMode = false;
  guestForm: FormGroup;
  packages: any[] = [];
  showCancelForm = false;
  cancellationReason = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { room: Occupancy },
    public dialogRef: MatDialogRef<GuestDetailsDialogComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private occupancyService: OccupancyService,
    private toastr: ToastrService,
    private bottomSheet: MatBottomSheet,

    
  ) {
    this.roomData = data.room;
    this.dialogTitle = 'Room # ' + this.roomData.roomNo;

    this.guestForm = this.fb.group({
      guest_title: [''],
      guest_name:  ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)], ],
      guest_surname: ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)], ],
      guest_email: [''],
      guest_phone: [''],
      guest_address: [''],
      guest_invoice: [false],
      checkInDate: [''],
      checkOutDate: [''],
      booking_status: [''],
      payment_status: [''],
      payment_types: [''],
      payment_amount: [''],
      special_requests: [''],
      package_id: [[]]
    });
  }


  ngOnInit(): void {
    this.loadPackages();

    const guest = this.roomData.guestDetails;
  
    this.guestForm.patchValue({
      guest_title: guest?.personalInfo?.title,
      guest_name: guest?.personalInfo?.name,
      guest_surname: guest?.personalInfo?.surname,
      guest_email: guest?.personalInfo?.email,
      guest_phone: guest?.personalInfo?.phone,
      guest_address: guest?.personalInfo?.address,
      guest_invoice: guest?.personalInfo?.invoice === '1',
  
      checkInDate: guest?.reservationInfo?.checkInDate,
      checkOutDate: guest?.reservationInfo?.checkOutDate,
      booking_status: guest?.reservationInfo?.bookingState,
      payment_status: guest?.reservationInfo?.paymentStatus,
      payment_types: guest?.reservationInfo?.paymentTypes,
      payment_amount: guest?.reservationInfo?.paymentAmount,
      special_requests: guest?.specialRequests,
      package_id: [] // you’ll load this after fetching packages
    });

  //  console.log('Room guest details', this.roomData.guestDetails);
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  getNumberOfNights(): number {
    const checkInRaw = this.roomData.guestDetails?.reservationInfo?.checkInDate;
    const checkOutRaw = this.roomData.guestDetails?.reservationInfo?.checkOutDate;
  
    if (!checkInRaw || !checkOutRaw) {
      return 0;
    }
  
    const checkIn = new Date(checkInRaw);
    const checkOut = new Date(checkOutRaw);
  
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return 0;
    }
  
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return days > 0 ? days : 0;
  }


  editGuest(): void {
    if (!this.isEditMode) {
      this.isEditMode = true;
      return;
    }
  
    const payload = {
      booking_reference: this.roomData.guestDetails?.reservationInfo?.bookingReference,
      ...this.guestForm.value,
      guest_invoice: this.guestForm.value.guest_invoice ? 1 : 0
    };
  
    this.loading = true;
  
    this.occupancyService.editGuestPersonalDetails(payload).pipe(first()).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.toastr.success('Booking updated successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Failed to update booking');
        }
        this.loading = false;
      },
      (err) => {
        this.toastr.error('Error sending update');
        this.loading = false;
      }
    );
  }

  confirmCancelBooking(): void {
    this.dialogRef.close(); // ✅ Close current Guest Details Dialog
  
    const ref = this.dialog.open(CancelBookingDialogComponent, {
      width: '400px',
      data: {
        booking_reference: this.data.room.guestDetails?.reservationInfo?.bookingReference
      }
    });
  
    ref.afterClosed().subscribe(reason => {
      if (!reason) return;
  
      const reasonText = typeof reason === 'object' ? reason.reason : reason;
      const refundStatus = typeof reason === 'object' ? reason.refund_status : null;

      const payload = {
        booking_reference: this.data.room.guestDetails?.reservationInfo?.bookingReference,
        cancellation_reason: reasonText,
        refund_status: refundStatus
      };
      
      this.occupancyService.cancelBooking(payload).pipe(first()).subscribe(
        (res) => {
          if (res.status === 'success') {
            this.toastr.success('Booking cancelled successfully.');
            location.reload();
          } else {
            this.toastr.error('Cancellation failed.');
          }
        },
        () => {
          this.toastr.error('Server error during cancellation.');
        }
      );
    });
  }
  


  loadPackages(): void {
    this.occupancyService.getPackages().pipe(first()).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.packages = response.data;
  
          // match by name
          const selectedNames = (this.roomData.guestDetails?.package?.name ?? '').split(',').map(name => name.trim());
          const selectedIds = this.packages
            .filter(pkg => selectedNames.includes(pkg.package_name))
            .map(pkg => pkg.id);
  
          this.guestForm.patchValue({ package_id: selectedIds });
        } else {
          this.toastr.warning('Failed to load packages');
        }
      },
      (err) => {
        this.toastr.error('Error fetching packages');
      }
    );
  }


  
}
