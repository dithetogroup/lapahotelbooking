import {
  Component,
  Inject,
  OnInit
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule
} from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { PackageDialogData } from "../../spa-bookings/spa.model";


@Component({
  selector: 'app-package-dialog',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule
  ],
  templateUrl: './package-dialog.component.html',
  styleUrl: './package-dialog.component.scss'
})
export class PackageDialogComponent {
  action: string;
  dialogTitle: string;
  packageForm: FormGroup;
  packageData: any;

  
  constructor(
    public dialogRef: MatDialogRef<PackageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PackageDialogData,
    private fb: FormBuilder
  ) {
    this.action = data.action;
    this.packageData = data.packageData || {};
    this.dialogTitle = this.action === "edit" ? "Edit Package" : "Add Package";
    this.packageForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.action === "edit" && this.packageData) {
      this.packageForm.patchValue(this.packageData);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      package_name: [this.packageData.package_name || '', Validators.required],
      package_type: [this.packageData.package_type || '', Validators.required],
      package_time: [this.packageData.package_time || 30, [Validators.required, Validators.min(1)]],
      package_price: [this.packageData.package_price || 0, [Validators.required, Validators.min(0)]],
      id: [this.packageData.id || null]
    });
  }

  submit() {
    if (this.packageForm.valid) {
      this.dialogRef.close(this.packageForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
