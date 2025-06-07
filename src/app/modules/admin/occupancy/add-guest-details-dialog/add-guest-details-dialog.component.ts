import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Occupancy } from '../occupancy.model';
import { UtilsServiceService } from '@core/services/utils-service.service';
import { OccupancyService } from '../occupancy.service';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-add-guest-details-dialog',
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
    MatCheckboxModule
  ],
  templateUrl: './add-guest-details-dialog.component.html',
  styleUrl: './add-guest-details-dialog.component.scss',
})
export class AddGuestDetailsDialogComponent {
  guestForm: FormGroup;
  loading = false;
  isEditMode: any;
  packages: any[] = [];
  occupants: any[] = [];
  showOtherPaymentInput = false;
  otherPaymentType = '';
  paymentStatus: string = '';
  minCheckInDate = new Date();
  minCheckOutDate: Date | null = null;
  totalAmountToPay: number = 0;
  roomPrice: number = 0;
  packagePrice: number = 0;
  selectedPackage: any[] = [];
  allAvailableRooms: any[] = [];
  nights: number = 1;
  selectedRoomNos: number[] = []
  roomBreakdown: {
    room_no: string;
    room_name: string;
    price: number;
    nights: number;
  }[] = [];
  
  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsServiceService,
    private occupancyService: OccupancyService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { room: Occupancy },
    public dialogRef: MatDialogRef<AddGuestDetailsDialogComponent>
  ) {
    this.guestForm = this.fb.group({
      guestInfoGroup: this.fb.group({
        guest_title: [''],
        guest_name:  ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)], ],
        guest_surname: ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)], ],
        guest_address: ['', Validators.required],
        guest_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        guest_email: ['', Validators.email],
      }),
      bookingGroup: this.fb.group({
        checkInDate: ['', Validators.required],
        checkOutDate: ['', Validators.required],
        roomNos: [[]],
        package_id: [[]],
        special_requests: [''],
      }), 
      payment_status: ['', Validators.required],
      payment_types: [''],
    //  booking_status: ['', Validators.required],
      payment_amount: [0],
      guest_invoice: [''],
    }, {
      validators: this.utilsService.dateRangeValidator()  // ✅ Apply validator here
    });
  }
    // ✅ Add these getters below constructor
    get guestInfoForm(): FormGroup {
      return this.guestForm.get('guestInfoGroup') as FormGroup;
    }
    get bookingForm(): FormGroup {
      return this.guestForm.get('bookingGroup') as FormGroup;
    }

  ngOnInit(){
    this.getPackages();
   // this.getOccupants();
    this.getAvailableRooms();
  //  console.log('ROOM Details', this.data);
    this.guestForm.get('bookingGroup.checkInDate')?.valueChanges.subscribe((checkIn) => {
      if (checkIn) {
        this.minCheckOutDate = new Date(checkIn);
        const currentCheckOut = this.guestForm.get('bookingGroup.checkOutDate')?.value;
        if (currentCheckOut && new Date(currentCheckOut) < this.minCheckOutDate) {
          this.guestForm.get('bookingGroup.checkOutDate')?.setValue('');
        }
      }
    });
    
    // Handle room selection
    this.guestForm.get('bookingGroup.roomNos')?.valueChanges.subscribe((selected: number[]) => {
      this.selectedRoomNos = [...new Set(selected)]; // deduplicate room numbers
      this.updateBookingSummary();
    });
    

    // Handle package selection
    this.guestForm.get('bookingGroup.package_id')?.valueChanges.subscribe((selectedIds: number[]) => {
      this.selectedPackage = this.packages.filter(pkg => selectedIds.includes(pkg.id));
      this.updateBookingSummary();
    });

    // Handle date changes
    this.guestForm.get('bookingGroup.checkInDate')?.valueChanges.subscribe(() => {
      this.calculateNights();
      this.updateBookingSummary();
    });

    this.guestForm.get('bookingGroup.checkOutDate')?.valueChanges.subscribe(() => {
      this.calculateNights();
      this.updateBookingSummary();
    });
    

    // Initial night count
    this.calculateNights();
    this.updateBookingSummary();
    
  //  console.log('Room Details', this.data);
    this.guestForm.get('payment_status')?.valueChanges.subscribe(status => {
      this.paymentStatus = status;
    
      if (status === 'UnPaid') {
        this.showOtherPaymentInput = false;
    
        // Clear and disable payment type field
        this.guestForm.get('payment_types')?.setValue('');
        this.guestForm.get('payment_types')?.clearValidators();
        this.guestForm.get('payment_types')?.updateValueAndValidity();
    
        // Also reset other input value if needed
        this.otherPaymentType = '';
      } else if (status === 'Paid') {
        // Enable and validate again
        this.guestForm.get('payment_types')?.setValidators([Validators.required]);
        this.guestForm.get('payment_types')?.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    if (this.guestForm.valid) {
      this.loading = true;
  
      // 🔹 Extract nested group values
      const guestInfo = this.guestForm.get('guestInfoGroup')!.value;
      const bookingInfo = this.guestForm.get('bookingGroup')!.value;
      // 🔹 Extract top-level fields
      const payment_amount = this.guestForm.get('payment_amount')?.value;
      const guest_invoice = this.guestForm.get('guest_invoice')?.value;
      // 🔹 Format dates for MySQL
      const formattedCheckIn = this.utilsService.formatToMySQLDate(bookingInfo.checkInDate);
      const formattedCheckOut = this.utilsService.formatToMySQLDate(bookingInfo.checkOutDate);
      const payment_status = this.guestForm.get('payment_status')?.value;


      // 🔹 Final object for backend
      const formattedBookingData = {
        ...guestInfo,
        ...bookingInfo,
        checkInDate: formattedCheckIn,
        checkOutDate: formattedCheckOut,
        payment_amount,
        guest_invoice,
        bookingId: this.data.room.id,
        roomNo: this.data.room.roomNo,
        booking_status: 'CheckIn',
        payment_status,
        payment_types: this.otherPaymentType || this.guestForm.get('payment_types')?.value
     //   otherPaymentType: this.showOtherPaymentInput ? this.otherPaymentType : null
     //   booking_status
      };

      debugger;
      // 🔹 Submit
      this.occupancyService.addNewBooking(formattedBookingData).pipe(first()).subscribe(
        (data) => {
          if (data.status === 'success') {
            this.toastr.success('Booking Added successfully!');
            this.loading = false;
            this.dialogRef.close(); // close and pass value if needed
            // after success
            this.dialogRef.close('refresh');

            this.getAvailableRooms();
          //  location.reload();
          } else {
            this.toastr.error('Something went wrong. Please contact System Admin.');
            this.loading = false;
          }
        },
        (error) => {
          this.toastr.error('Booking failed.');
          this.loading = false;
        }
      );
    }
  }
  
  editGuest(): void {
    if (!this.isEditMode) {
      this.isEditMode = true;
      return;
    }
    const payload = {
      booking_reference: this.data.room.guestDetails?.reservationInfo?.bookingReference,
      ...this.guestForm.value,
      guest_invoice: this.guestForm.value.guest_invoice ? 1 : 0
    };
  
    debugger;
    
    this.loading = true;
    this.occupancyService.editGuestPersonalDetails(payload).pipe(first()).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.toastr.success('Guest info updated');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Update failed');
        }
        this.loading = false;
      },
      () => {
        this.toastr.error('Server error');
        this.loading = false;
      }
    );
  }
  
  onPaymentTypeSelect(value: string): void {
    this.showOtherPaymentInput = value === 'Other';
  
    if (!this.showOtherPaymentInput) {
      this.guestForm.patchValue({ payment_types: value });
    } else {
      this.guestForm.patchValue({ payment_types: '' });
    }
  }
  
  onOtherPaymentTypeChange(event: any): void {
    const val = event.target.value;
    this.otherPaymentType = val;
    this.guestForm.patchValue({ payment_types: val });
  }
  

  getPackages(): void {
    this.occupancyService.getPackages().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.packages = response.data;
         // console.log('packages', this.packages);
        } else {
          this.toastr.warning("Failed to load packages.");
        }
      },
      (error) => {
        console.error("[ERROR] Failed to fetch packages:", error);
        this.toastr.error("Something went wrong. Please contact the Super Admin.");
      }
    );
  }

  getAvailableRooms(): void {
    this.occupancyService.getAvailableRooms().subscribe(
      (res: any) => {
        this.allAvailableRooms = res.data;
       // console.log('Available rooms', this.allAvailableRooms);
      },
      (err) => {
        this.toastr.error("Could not fetch rooms");
      }
    );
  }

  getRoomDetails(roomNo: number): any {
    return this.allAvailableRooms.find(r => r.room_no === roomNo);
  }

getSelectedRoomDetails(): any[] {
  return this.allAvailableRooms.filter(room =>
    this.selectedRoomNos.includes(room.room_no) &&
    room.room_no !== this.data.room.roomNo // ✅ Exclude the main room
  );
}
  
  getRoomSummaryLabel(room: any): string {
    return `Room #${room.room_no} (${room.room_name}): Week: R${room.weekPrice}, Weekend: R${room.weekendPrice}`;
  }
  

  parseFloat(value: any): number {
    return parseFloat(value);
  }

  onPackageSelectionChange(selectedPackageIds: number[]): void {
    this.selectedPackage = this.packages.filter(pkg => selectedPackageIds.includes(pkg.id));
    this.updateBookingSummary(); // ✅ This will handle totals cleanly
  }
  
  getNightsBetween(startDate: any, endDate: any): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }

  calculateNights(): void {
    const checkIn = this.guestForm.get('bookingGroup.checkInDate')?.value;
    const checkOut = this.guestForm.get('bookingGroup.checkOutDate')?.value;
    this.nights = this.getNightsBetween(checkIn, checkOut);
  }

  getSelectedRooms(): any[] {
    const selectedIds = this.selectedRoomNos;
    return this.allAvailableRooms.filter(room => selectedIds.includes(room.room_no));
  }
  
  getRoomTotal(room: any): number {
    return this.nights * parseFloat(room.price || 0);
  }

  updateBookingSummary(): void {
    const checkIn = this.bookingForm.get('checkInDate')?.value;
    const checkOut = this.bookingForm.get('checkOutDate')?.value;
  
    const nights = this.getNightsBetween(checkIn, checkOut);
    this.nights = nights;
  
    const dateRange = this.getDateRange(checkIn, checkOut);
  
    this.totalAmountToPay = 0;
    this.packagePrice = 0;
    this.roomPrice = 0;
    this.roomBreakdown = [];
  
    const selectedRooms = this.getSelectedRoomDetails();
  
    const primaryRoom = {
      room_no: this.data.room.roomNo,
      room_name: this.data.room.roomType,
      weekPrice: this.data.room.weekPrice,
      weekendPrice: this.data.room.weekendPrice
    };
  
    const allRooms = [primaryRoom, ...selectedRooms];
  
    const summaryMap = new Map<string, { room_no: string; room_name: string; price: number; nights: number }>();
    let totalRoomCost = 0;
  
    for (const room of allRooms) {
      for (const day of dateRange) {
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        const rate = this.safeParseFloat(isWeekend ? room.weekendPrice : room.weekPrice);
  
        totalRoomCost += rate;
  
        const key = room.room_no;
        if (summaryMap.has(key)) {
          summaryMap.get(key)!.nights += 1;
        } else {
          summaryMap.set(key, {
            room_no: room.room_no,
            room_name: room.room_name,
            price: rate,
            nights: 1
          });
        }
      }
    }
  
    this.roomBreakdown = Array.from(summaryMap.values());
  
    const packageTotal = this.selectedPackage.reduce((sum, pkg) => {
      return sum + this.safeParseFloat(pkg.package_price);
    }, 0);
  
    this.roomPrice = totalRoomCost;
    this.packagePrice = packageTotal;
    this.totalAmountToPay = parseFloat((totalRoomCost + packageTotal).toFixed(2));
    this.guestForm.get('payment_amount')?.setValue(this.totalAmountToPay);
  
    //console.log('Room Cost:', totalRoomCost);
    //console.log('Package Cost:', packageTotal);
    //console.log('Total Amount to Pay:', this.totalAmountToPay);
  }
  
  
  private safeParseFloat(value: any): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  

  getDateRange(checkIn: any, checkOut: any): Date[] {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const dateArray: Date[] = [];
  
    while (startDate < endDate) { // ✅ strictly less than
      dateArray.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
  
    return dateArray;
  }
  
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
