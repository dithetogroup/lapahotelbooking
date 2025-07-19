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
  selector: 'app-view-spa-bookings-dialog',
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
    MatOptionModule
  ],
  templateUrl: './view-spa-bookings-dialog.component.html',
  styleUrl: './view-spa-bookings-dialog.component.scss'
})
export class ViewSpaBookingsDialogComponent {

  action: string;
  dialogTitle: string;
  spaBookingForm: FormGroup;
  spaBooking: SpaBooking;
  packages: any[] = [];
  therapists: any;

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
    "Other"
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
    this.getPackages();
    this.loadTherapists();
    if (this.action === "edit" && this.spaBooking) {
      this.spaBookingForm.patchValue({
        ...this.spaBooking,
        package_id: Array.isArray(this.spaBooking.package_id)
          ? this.spaBooking.package_id
          : (this.spaBooking.package_id ? [this.spaBooking.package_id] : [])
      });
    }
  }
  

  createForm(): FormGroup {
    return this.fb.group({
      spbooking_title: [this.spaBooking.spbooking_title || "", Validators.required],
      spbooking_name: [this.spaBooking.spbooking_name || "", Validators.required],
      spbooking_surname: [this.spaBooking.spbooking_surname || "", Validators.required],
      spbooking_email: [
        this.spaBooking.spbooking_email || "",
        [Validators.required, Validators.email],
      ],
      spbooking_contact: [this.spaBooking.spbooking_contact || "", Validators.required],
      spbooking_date: [this.spaBooking.spbooking_date ? new Date(this.spaBooking.spbooking_date) : "", Validators.required],
      spbooking_noofvisitors: [this.spaBooking.spbooking_noofvisitors || 1, Validators.required],
      package_id: [
        Array.isArray(this.spaBooking.package_id)
          ? this.spaBooking.package_id
          : (this.spaBooking.package_id ? [this.spaBooking.package_id] : []),
        Validators.required
      ],
      therapist_id: [this.spaBooking.therapist_id || "", Validators.required],
      spbooking_reason: [this.spaBooking.spbooking_reason || ""],
      spbooking_allergies: [this.spaBooking.spbooking_allergies || ""],
      spbooking_bookedby: [this.spaBooking.spbooking_bookedby || ""],
      id: [this.spaBooking.id || null]
    });
  }
  

  
  getPackages(): void {
    this.occupancyService.getPackages().subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.packages = response.data;
         //  console.log('packages', this.packages);
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


  loadTherapists(): void {
    this.boniSpaServices.getSpaTherapists().subscribe(
      (response: any) => {
        if (response.status === "success") {
          this.therapists = response.data;
           console.log('Therapists', this.therapists);
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

  submit() {
    if (this.spaBookingForm.valid) {
      const formValue = this.spaBookingForm.getRawValue();
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

}
