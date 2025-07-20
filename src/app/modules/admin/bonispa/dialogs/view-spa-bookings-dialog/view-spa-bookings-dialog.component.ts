import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { SpaBooking, SpaBookingDialogData } from "../../spa-bookings/spa.model";
import { BoniSpaService } from "../../boni-spa.service";
import { CommonModule, NgFor, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ToastrService } from "ngx-toastr";
import { OccupancyService } from "app/modules/admin/occupancy/occupancy.service";
import { MatSelectionList } from "@angular/material/list";
import { MatOptionModule } from "@angular/material/core";
@Component({
  selector: "app-view-spa-bookings-dialog",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: "./view-spa-bookings-dialog.component.html",
  styleUrl: "./view-spa-bookings-dialog.component.scss",
})
export class ViewSpaBookingsDialogComponent {
  action: string;
  dialogTitle: string;
  spaBookingForm: FormGroup;
  spaBooking: SpaBooking;
  packages: any[] = [];
  therapists: any;
  slots: string[] = [];
  bookedSlots: { time: string; duration: number }[] = [];
  selectedDuration: number = 30; // default

  reasonsForSpaBooking: string[] = [
    "Relaxation",
    "Stress Relief",
    "Muscle Pain Relief",
    "Pampering/Self-care",
    "Special Occasion (Birthday, Anniversary)",
    "Gift",
    "Couples Time",
    "Detox",
    "Improve Sleep",
    "Beauty Treatment",
    "Health/Wellness",
    "Other",
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewSpaBookingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SpaBookingDialogData,
    public boniSpaServices: BoniSpaService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private occupancyService: OccupancyService
  ) {
    this.action = data.action;
    this.spaBooking = data.spaBooking || ({} as SpaBooking);
    this.dialogTitle = 
    this.action === "edit" ? "Edit Spa Booking" : "New Spa Booking";
    this.spaBookingForm = this.createForm();
  }

  ngOnInit(): void {
    this.slots = this.generateTimeSlots();
    this.loadTherapists();
    this.getPackages(); // We'll handle patching in getPackages()
  }

  onPackageChange(pkgId: string) {
    const pkg = this.packages.find((p) => p.id == pkgId);
    this.selectedDuration = pkg?.package_time ? +pkg.package_time : 30;
  }

  createForm(): FormGroup {
    return this.fb.group({
      spbooking_title: [this.spaBooking.spbooking_title || "", Validators.required],
      spbooking_name: [this.spaBooking.spbooking_name || "", Validators.required],
      spbooking_surname: [this.spaBooking.spbooking_surname || "", Validators.required],
      spbooking_email: [this.spaBooking.spbooking_email || "", [Validators.required, Validators.email]],
      spbooking_contact: [this.spaBooking.spbooking_contact || "", Validators.required],
      spbooking_date: [this.spaBooking.spbooking_date ? new Date(this.spaBooking.spbooking_date) : "", Validators.required],
      spbooking_noofvisitors: [this.spaBooking.spbooking_noofvisitors || 1, Validators.required],
      package_id: [Array.isArray(this.spaBooking.package_id) ? this.spaBooking.package_id : this.spaBooking.package_id ? [this.spaBooking.package_id] : [], Validators.required],
      therapist_id: [this.spaBooking.therapist_id || "", Validators.required],
      spbooking_reason: [this.spaBooking.spbooking_reason || ""],
      spbooking_allergies: [this.spaBooking.spbooking_allergies || ""],
      package_names: [this.spaBooking.package_names || ""],
      id: [this.spaBooking.id || null],
      spbooking_time: [this.spaBooking.spbooking_time || "", Validators.required],
    });
  }
  

  onDateChange(date: Date) {
    if (!date) {
      this.bookedSlots = [];
      return;
    }
    const dateStr = date.toISOString().slice(0, 10);
    this.boniSpaServices.getSpaBookedSlots(dateStr).subscribe((res: any) => {
      this.bookedSlots =
        res.status === "success" && Array.isArray(res.data) ? res.data : [];
    });
  }


  getPackages(): void {
    this.occupancyService.getPackages().subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.packages = response.data;
  
          // Only patch form values after packages are loaded!
          if (this.action === "edit" && this.spaBooking) {
            this.spaBookingForm.patchValue({
              spbooking_title: this.spaBooking.spbooking_title,
              spbooking_name: this.spaBooking.spbooking_name,
              spbooking_surname: this.spaBooking.spbooking_surname,
              spbooking_email: this.spaBooking.spbooking_email,
              spbooking_contact: this.spaBooking.spbooking_contact,
              spbooking_date: this.spaBooking.spbooking_date ? new Date(this.spaBooking.spbooking_date) : "",
              spbooking_noofvisitors: this.spaBooking.spbooking_noofvisitors,
              package_id: Array.isArray(this.spaBooking.package_id)
                ? this.spaBooking.package_id
                : this.spaBooking.package_id
                ? [this.spaBooking.package_id]
                : [],
              therapist_id: this.spaBooking.therapist_id,
              spbooking_reason: this.spaBooking.spbooking_reason,
              spbooking_allergies: this.spaBooking.spbooking_allergies,
              id: this.spaBooking.id,
              spbooking_time: this.spaBooking.spbooking_time,
            });
          }
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
  

  loadTherapists(): void {
    this.boniSpaServices.getSpaTherapists().subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.therapists = response.data;
          console.log("Therapists", this.therapists);
        } else {
          this.toastr.warning("Failed to load Therapists.");
        }
      },
      (error) => {
        console.error("[ERROR] Failed to fetch Therapists:", error);
        this.toastr.error(
          "Something went wrong. Please contact the Super Admin."
        );
      }
    );
  }

  //Calculate total of packages
  get totalAmount(): number {
    const selected = this.spaBookingForm.get("package_id")?.value || [];
    const numVisitors = Number(this.spaBookingForm.get("spbooking_noofvisitors")?.value || 1);
    return selected
      .map((id: string) => {
        const pkg = this.packages.find((p: any) => p.id == id);
        return pkg ? +pkg.package_price : 0;
      })
      .reduce((sum: number, price: number) => sum + price, 0) * numVisitors;
  }
  
  submit() {
    if (this.spaBookingForm.valid) {
      const formValue = this.spaBookingForm.getRawValue();
      formValue.total_amount = this.totalAmount;
      // Convert the JS Date to a YYYY-MM-DD string for your API if needed:
      if (formValue.spbooking_date instanceof Date) {
        formValue.spbooking_date = formValue.spbooking_date
          .toISOString()
          .slice(0, 10);
      }
      if (this.action === "edit") {
        debugger;
        this.boniSpaServices.updateSpaBooking(formValue).subscribe({
          next: (res) => {
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            // handle error
          },
        });
      } else {
        this.boniSpaServices.updateSpaBooking(formValue).subscribe({
          next: (res) => {
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            // handle error
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //generate time slots
  generateTimeSlots(
    start: string = "08:00",
    end: string = "18:00",
    interval: number = 15
  ): string[] {
    const slots: string[] = [];
    let [hour, min] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    while (hour < endHour || (hour === endHour && min <= endMin)) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
      );
      min += interval;
      if (min >= 60) {
        min -= 60;
        hour++;
      }
    }
    return slots;
  }

  // Helper: Add minutes to HH:mm string
  addMinutes(time: string, minsToAdd: number): string {
    const [h, m] = time.split(":").map(Number);
    let date = new Date(2000, 0, 1, h, m); // January is 0!
    date.setMinutes(date.getMinutes() + minsToAdd);
    return date.toTimeString().slice(0, 5);
  }

  getUnavailableSlots(
    booked: { time: string; duration: number }[],
    selectedPackageDuration: number
  ): Set<string> {
    const blocked = new Set<string>();
    for (const b of booked) {
      // Block all times within b.time and b.time + b.duration
      let t = b.time;
      for (let mins = 0; mins < b.duration; mins += 15) {
        blocked.add(this.addMinutes(t, mins));
      }
    }
    return blocked;
  }

  isSlotAvailable(slot: string): boolean {
    for (const b of this.bookedSlots) {
      const slotStart = slot;
      const slotEnd = this.addMinutes(slot, this.selectedDuration);
      const bookedStart = b.time;
      const bookedEnd = this.addMinutes(b.time, b.duration);
      if (slotStart < bookedEnd && slotEnd > bookedStart) {
        return false;
      }
    }
    return true;
  }
  
}
