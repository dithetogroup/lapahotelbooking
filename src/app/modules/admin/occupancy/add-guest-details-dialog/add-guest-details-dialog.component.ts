import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { Occupancy } from "../occupancy.model";
import { UtilsServiceService } from "@core/services/utils-service.service";
import { OccupancyService } from "../occupancy.service";
import { debounceTime, first, tap } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatStepperModule } from "@angular/material/stepper";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AuthService } from "@core/services/auth.service";
import { User } from "@core/models/interface";
import { MatRadioModule } from "@angular/material/radio";

@Component({
  selector: "app-add-guest-details-dialog",
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
    MatProgressSpinner,
    MatRadioModule
  ],
  templateUrl: "./add-guest-details-dialog.component.html",
  styleUrl: "./add-guest-details-dialog.component.scss",
})
export class AddGuestDetailsDialogComponent {
  guestForm: FormGroup;
  loading = false;
  isEditMode: any;
  packages: any[] = [];
  occupants: any[] = [];
  showOtherPaymentInput = false;
  otherPaymentType = "";
  paymentStatus: string = "";
  minCheckInDate = new Date();
  minCheckOutDate: Date | null = null;
  totalAmountToPay: number = 0;
  roomPrice: number = 0;
  packagePrice: number = 0;
  selectedPackage: any[] = [];
  allAvailableRooms: any[] = [];
  nights: number = 1;
  selectedRoomNos: number[] = [];
  roomBreakdown: {
    room_no: string;
    room_name: string;
    price: number;
    nights: number;
  }[] = [];
  bookedDateRanges: { start: Date; end: Date }[] = [];
  user!: User;
  discountTotal: number = 0

  //Regular guest
  regularGuestTypeForm: FormGroup;
  regularGuests: any[] = [];
  filteredRegularGuests: any[] = [];
  guestSearchText = '';
  savingRegularClient = false;


  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsServiceService,
    private occupancyService: OccupancyService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { room: Occupancy },
    public dialogRef: MatDialogRef<AddGuestDetailsDialogComponent>
  ) {
    this.guestForm = this.fb.group(
      {
        guestInfoGroup: this.fb.group({
          guest_title: [""],
          guest_name: [
            "",
            [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
          ],
          guest_surname: [
            "",
            [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
          ],
          guest_address: [""],
          guest_phone: [
            "",
            [Validators.required, Validators.pattern(/^\d{10}$/)],
          ],
          guest_email: ["", Validators.email],
        }),
        bookingGroup: this.fb.group({
          checkInDate: ["", Validators.required],
          checkOutDate: ["", Validators.required],
          roomNos: [[]],
          package_id: [[]],
          special_requests: [""],
        }),
        payment_status: ["", Validators.required],
        payment_types: [""],
        //  booking_status: ['', Validators.required],
        payment_amount: [0],
        guest_invoice: [""],
      },
      {
        validators: this.utilsService.dateRangeValidator(), // ✅ Apply validator here
      }
    );
     // Step 1: Regular guest select
    this.regularGuestTypeForm = this.fb.group({
      isRegularGuest: [null, Validators.required],
      selectedGuestId: [null]
    });


  }
  // ✅ Add these getters below constructor
  get guestInfoForm(): FormGroup {
    return this.guestForm.get("guestInfoGroup") as FormGroup;
  }
  get bookingForm(): FormGroup {
    return this.guestForm.get("bookingGroup") as FormGroup;
  }

  ngOnInit() {
    this.auth.user().pipe(
        tap((user) => (this.user = user)),
        debounceTime(10)).subscribe(() => this.cdr.detectChanges());

    this.getPackages();

    this.fetchRegularGuests();

    // this.getOccupants();
    this.getAvailableRooms();

    this.bookingForm.get("checkInDate")?.valueChanges.subscribe(() => {
      this.checkSelectedDateRange();
    });
    this.bookingForm.get("checkOutDate")?.valueChanges.subscribe(() => {
      this.checkSelectedDateRange();
    });

    //  console.log('ROOM Details', this.data);
    this.guestForm
      .get("bookingGroup.checkInDate")
      ?.valueChanges.subscribe((checkIn) => {
        if (checkIn) {
          this.minCheckOutDate = new Date(checkIn);
          const currentCheckOut = this.guestForm.get(
            "bookingGroup.checkOutDate"
          )?.value;
          if (
            currentCheckOut &&
            new Date(currentCheckOut) < this.minCheckOutDate
          ) {
            this.guestForm.get("bookingGroup.checkOutDate")?.setValue("");
          }
        }
      });

    // Handle room selection
    this.guestForm
      .get("bookingGroup.roomNos")
      ?.valueChanges.subscribe((selected: number[]) => {
        this.selectedRoomNos = [...new Set(selected)]; // deduplicate room numbers
        this.updateBookingSummary();
      });

    // Handle package selection
    this.guestForm
      .get("bookingGroup.package_id")
      ?.valueChanges.subscribe((selectedIds: number[]) => {
        this.selectedPackage = this.packages.filter((pkg) =>
          selectedIds.includes(pkg.id)
        );
        this.updateBookingSummary();
      });

    // Handle date changes
    this.guestForm
      .get("bookingGroup.checkInDate")
      ?.valueChanges.subscribe(() => {
        this.calculateNights();
        this.updateBookingSummary();
      });

    this.guestForm
      .get("bookingGroup.checkOutDate")
      ?.valueChanges.subscribe(() => {
        this.calculateNights();
        this.updateBookingSummary();
      });

    // Initial night count
    this.calculateNights();
    this.updateBookingSummary();

    //  console.log('Room Details', this.data);
    this.guestForm.get("payment_status")?.valueChanges.subscribe((status) => {
      this.paymentStatus = status;

      if (status === "UnPaid") {
        this.showOtherPaymentInput = false;

        // Clear and disable payment type field
        this.guestForm.get("payment_types")?.setValue("");
        this.guestForm.get("payment_types")?.clearValidators();
        this.guestForm.get("payment_types")?.updateValueAndValidity();

        // Also reset other input value if needed
        this.otherPaymentType = "";
      } else if (status === "Paid") {
        // Enable and validate again
        this.guestForm
          .get("payment_types")
          ?.setValidators([Validators.required]);
        this.guestForm.get("payment_types")?.updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    if (this.guestForm.valid) {
      this.loading = true;

      // 🔹 Extract nested group values
      const guestInfo = this.guestForm.get("guestInfoGroup")!.value;
      const bookingInfo = this.guestForm.get("bookingGroup")!.value;
      // 🔹 Extract top-level fields
      const payment_amount = this.guestForm.get("payment_amount")?.value;
      const guest_invoice = this.guestForm.get("guest_invoice")?.value;
      // 🔹 Format dates for MySQL
      const formattedCheckIn = this.utilsService.formatToMySQLDate(
        bookingInfo.checkInDate
      );
      const formattedCheckOut = this.utilsService.formatToMySQLDate(
        bookingInfo.checkOutDate
      );
      const payment_status = this.guestForm.get("payment_status")?.value;

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
        booking_status: "Booked",
        booked_by: this.user?.["full_name"],
        payment_status,
        payment_types:
          this.otherPaymentType || this.guestForm.get("payment_types")?.value,
        //   otherPaymentType: this.showOtherPaymentInput ? this.otherPaymentType : null
        //   booking_status
      };

     // debugger;
      // 🔹 Submit
      this.occupancyService
        .addNewBooking(formattedBookingData)
        .pipe(first())
        .subscribe(
          (data) => {
            if (data.status === "success") {
              this.toastr.success("Booking Added successfully!");
              this.loading = false;
              this.dialogRef.close(); // close and pass value if needed
              // after success
              this.dialogRef.close("refresh");
              this.getAvailableRooms();
              //  location.reload();
            } else {
              this.toastr.error(
                "Something went wrong. Please contact System Admin."
              );
              this.loading = false;
            }
          },
          (error) => {
            // If backend sends JSON with error message, show it
            const errMsg = error?.error?.message || "Booking failed.";
            this.toastr.error(errMsg);
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
      booking_reference:
        this.data.room.guestDetails?.reservationInfo?.bookingReference,
      ...this.guestForm.value,
      guest_invoice: this.guestForm.value.guest_invoice ? 1 : 0,
    };

    //debugger;

    this.loading = true;
    this.occupancyService
      .editGuestPersonalDetails(payload)
      .pipe(first())
      .subscribe(
        (res) => {
          if (res.status === "success") {
            this.toastr.success("Guest info updated");
            this.dialogRef.close(true);
          } else {
            this.toastr.error("Update failed");
          }
          this.loading = false;
        },
        () => {
          this.toastr.error("Server error");
          this.loading = false;
        }
      );
  }

  onPaymentTypeSelect(value: string): void {
    this.showOtherPaymentInput = value === "Other";

    if (!this.showOtherPaymentInput) {
      this.guestForm.patchValue({ payment_types: value });
    } else {
      this.guestForm.patchValue({ payment_types: "" });
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
        if (response.status === "success") {
          this.packages = response.data;
          // console.log('packages', this.packages);
        } else {
          this.toastr.warning("Failed to load packages.");
        }
      },
      (error) => {
        console.error("[ERROR] Failed to fetch packages:", error);
        this.toastr.error(
          "Something went wrong. Please contact the Super Admin."
        );
      }
    );
  }


  fetchRegularGuests(): void {
    this.occupancyService.getRegularGuest().subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.regularGuests = response.data;
          this.filteredRegularGuests = response.data;

           console.log('packages', this.regularGuests);
        } else {
          this.toastr.warning("Failed to load guests.");
        }
      },
      (error) => {
        console.error("[ERROR] Failed to fetch guests:", error);
        this.toastr.error(
          "Something went wrong. Please contact the Super Admin."
        );
      }
    );
  }

  filterRegularGuests() {
    const search = this.guestSearchText.trim().toLowerCase();
    this.filteredRegularGuests = this.regularGuests.filter(g =>
      (`${g.rg_name} ${g.rg_surname} ${g.rg_email}`.toLowerCase().includes(search))
    );
  }

 // In your component
onRegularGuestSelected(guestId: number) {
  const selected = this.regularGuests.find(g => g.id === guestId);
  if (selected) {
    this.guestInfoForm.patchValue({
      guest_title: selected.rg_title,
      guest_name: selected.rg_name,
      guest_surname: selected.rg_surname,
      guest_company: selected.rg_company,
      guest_email: selected.rg_email,
      guest_address: selected.rg_address,
      guest_phone: selected.rg_phone,
      // add more fields if needed
    });
  }
}

onSearchInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.guestSearchText = input.value;
  this.filterRegularGuests();
}



  onGuestDropdownOpen() {
    // Clear search when dropdown opens
    this.guestSearchText = '';
    this.filteredRegularGuests = this.regularGuests;
  }



  getAvailableRooms(): void {
    this.occupancyService.getAvailableRooms().subscribe(
      (res: any) => {
        this.allAvailableRooms = res.data;
         console.log('Available rooms', this.allAvailableRooms);
      },
      (err) => {
        this.toastr.error("Could not fetch rooms");
      }
    );
  }



  saveAsRegularClient() {
    if (!this.guestInfoForm.valid) return;
  
    this.savingRegularClient = true;
  
    const { guest_name, guest_surname, guest_email, guest_phone, guest_address, guest_title, guest_company } = this.guestInfoForm.value;
  
    // Generate rg_account (e.g. LHR JM 071722)
    const now = new Date();
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const month = pad(now.getMonth() + 1);
    const date = pad(now.getDate());
    const hours = pad(now.getHours());
    const mins = pad(now.getMinutes());
    const acc = `LHR${guest_name[0].toUpperCase()}${guest_surname[0].toUpperCase()}${month}${date}${hours}${mins}`;
  
    const data = {
      rg_account: acc,
      rg_title: guest_title,
      rg_name: guest_name,
      rg_surname: guest_surname,
      rg_company: guest_company,
      rg_email: guest_email,
      rg_address: guest_address,
      rg_phone: guest_phone
    };
  
    debugger;

    this.occupancyService.addRegularGuest(data).subscribe(
      (result) => {
        this.savingRegularClient = false;
        if (result.status === 'success') {
          this.toastr.success(result.message || 'Client saved as regular client!');
        } else if (result.status === 'client_exists') {
          this.toastr.warning(result.message || 'A client with this email or phone already exists.');
        } else {
          this.toastr.error(result.message || 'Could not save client. Try again.');
        }
      },
      (err) => {
        this.savingRegularClient = false;
        this.toastr.error('Could not save client. Try again.');
      }
    );
  }

  

  getRoomDetails(roomNo: number): any {
    return this.allAvailableRooms.find((r) => r.room_no === roomNo);
  }

  getSelectedRoomDetails(): any[] {
    return this.allAvailableRooms.filter(
      (room) =>
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
    this.selectedPackage = this.packages.filter((pkg) =>
      selectedPackageIds.includes(pkg.id)
    );
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
    const checkIn = this.guestForm.get("bookingGroup.checkInDate")?.value;
    const checkOut = this.guestForm.get("bookingGroup.checkOutDate")?.value;
    this.nights = this.getNightsBetween(checkIn, checkOut);
  }

  getSelectedRooms(): any[] {
    const selectedIds = this.selectedRoomNos;
    return this.allAvailableRooms.filter((room) =>
      selectedIds.includes(room.room_no)
    );
  }

  getRoomTotal(room: any): number {
    return this.nights * parseFloat(room.price || 0);
  }

  updateBookingSummary(): void {
    const checkIn = this.bookingForm.get("checkInDate")?.value;
    const checkOut = this.bookingForm.get("checkOutDate")?.value;
  
    const nights = this.getNightsBetween(checkIn, checkOut);
    this.nights = nights;
  
    const dateRange = this.getDateRange(checkIn, checkOut);
  
    this.totalAmountToPay = 0;
    this.packagePrice = 0;
    this.roomPrice = 0;
    this.roomBreakdown = [];
  
    let discountTotal = 0; // Track total discount applied
  
    const selectedRooms = this.getSelectedRoomDetails();
  
    const primaryRoom = {
      room_no: this.data.room.roomNo,
      room_name: this.data.room.roomType,
      weekPrice: this.data.room.weekPrice,
      weekendPrice: this.data.room.weekendPrice,
      discountedPrice: this.data.room.discountedPrice
    };
  
    const allRooms = [primaryRoom, ...selectedRooms];
  
    const summaryMap = new Map<
      string,
      { room_no: string; room_name: string; price: number; nights: number }
    >();
    let totalRoomCost = 0;
  
    for (const room of allRooms) {
      for (const day of dateRange) {
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    
        let rate = 0;
        let discountForThisDay = 0;
        const discounted = this.safeParseFloat(room.discountedPrice); 
    
        if (isWeekend) {
          const weekendPrice = this.safeParseFloat(room.weekendPrice);
          if (discounted > 0) {
            rate = weekendPrice - discounted;
            discountForThisDay = discounted;
          } else {
            rate = weekendPrice;
          }
        } else {
          const weekPrice = this.safeParseFloat(room.weekPrice);
          if (discounted > 0) {
            rate = weekPrice - discounted;
            discountForThisDay = discounted;
          } else {
            rate = weekPrice;
          }
        }
  
        totalRoomCost += rate;
        discountTotal += discountForThisDay;
  
        const key = room.room_no;
        if (summaryMap.has(key)) {
          summaryMap.get(key)!.nights += 1;
        } else {
          summaryMap.set(key, {
            room_no: room.room_no,
            room_name: room.room_name,
            price: rate,
            nights: 1,
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
    this.discountTotal = discountTotal; 
  
    this.totalAmountToPay = parseFloat(
      (totalRoomCost + packageTotal).toFixed(2)
    );
    this.guestForm.get("payment_amount")?.setValue(this.totalAmountToPay);
  }
  

  private safeParseFloat(value: any): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  getDateRange(checkIn: any, checkOut: any): Date[] {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const dateArray: Date[] = [];

    while (startDate < endDate) {
      // ✅ strictly less than
      dateArray.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
  }

  getBookedDatesForRoom() {
    const roomNo = this.data.room.roomNo; // or however you get the selected room number
    this.occupancyService.getRoomBookedDates(roomNo).subscribe(
      (res) => {
        if (res.status === "success") {
          this.bookedDateRanges = res.data.map((range) => ({
            start: new Date(range.checkInDate),
            end: new Date(range.checkOutDate),
          }));
          this.toastr.success("Booked dates Updated.");
        } else {
          this.bookedDateRanges = [];
          this.toastr.error(res.message || "Could not load booked dates.");
        }
      },
      (err) => {
        this.bookedDateRanges = [];
        this.toastr.error("Server error. Could not fetch booked dates.");
      }
    );
  }

  checkSelectedDateRange() {
    //debugger;
    const checkIn = this.bookingForm.get("checkInDate")?.value;
    const checkOut = this.bookingForm.get("checkOutDate")?.value;

    if (!checkIn || !checkOut) return;

    // Convert to Date objects
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Loop through each booked range
    const hasOverlap = this.bookedDateRanges.some((range) => {
      // If (selectedEnd > bookedStart) && (selectedStart < bookedEnd), there is an overlap
      return end > range.start && start < range.end;
    });

    if (hasOverlap) {
      this.toastr.error(
        "Selected dates are already booked. Please choose different dates."
      );
      // Optionally clear the invalid selection:
      this.bookingForm.get("checkInDate")?.setValue("");
      this.bookingForm.get("checkOutDate")?.setValue("");
    }
  }

  onStepChange(event: any) {
    // Step index 1 = Booking step (0-based index)
    if (event.selectedIndex === 1) {
      this.getBookedDatesForRoom();
      console.log("we are within sept 2");
    }
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    // True = selectable, False = disabled
    // Disable dates that fall within any booked range
    return !this.bookedDateRanges.some(
      (range) => date >= range.start && date < range.end // CheckIn is inclusive, CheckOut is exclusive
    );
  };

  closeDialog(): void {
    this.dialogRef.close();
  }
}
