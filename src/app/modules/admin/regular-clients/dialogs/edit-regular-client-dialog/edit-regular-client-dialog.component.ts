import {
  MAT_DIALOG_DATA,
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
import { RegularClients } from "../../regular.model";
import { RegularClientsService } from "../../regular-clients.service";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";

export interface DialogData {
  regularClient: RegularClients;
  action: "edit" | "add";
}

@Component({
  selector: "app-edit-regular-client-dialog",
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
    MatCheckboxModule,
  ],
  templateUrl: "./edit-regular-client-dialog.component.html",
  styleUrl: "./edit-regular-client-dialog.component.scss",
})
export class EditRegularClientDialogComponent {
  action: string;
  dialogTitle: string;
  regularClientForm: FormGroup;
  regularClient: RegularClients;

  constructor(
    public dialogRef: MatDialogRef<EditRegularClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public regularClientService: RegularClientsService,
    private fb: FormBuilder
  ) {
    this.action = data.action;
    this.regularClient = data.regularClient || ({} as RegularClients);
    this.dialogTitle =
      this.action === "edit" ? "Edit Regular Client" : "New Regular Client";
    this.regularClientForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.action === "edit" && this.regularClient) {
      this.regularClientForm.patchValue(this.regularClient);
    }
    if (this.action === "add") {
      // Watch name and surname fields to auto-generate account
      this.regularClientForm
        .get("rg_name")!
        .valueChanges.subscribe(() => this.updateAccount());
      this.regularClientForm
        .get("rg_surname")!
        .valueChanges.subscribe(() => this.updateAccount());
    }
    // Dynamically update company field validators
    this.regularClientForm
      .get("rg_isliable")!
      .valueChanges.subscribe((value) => {
        this.toggleCompanyValidators(value === "Company");
      });
    this.toggleCompanyValidators(
      this.regularClientForm.get("rg_isliable")!.value === "Company"
    );
  }

  toggleCompanyValidators(isRequired: boolean) {
    const companyFields = [
      "rg_company",
      "rg_company_phone",
      "rg_company_person",
      "rg_company_type",
    ];
    companyFields.forEach((field) => {
      const control = this.regularClientForm.get(field);
      if (control) {
        if (isRequired) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  updateAccount() {
    const name = this.regularClientForm.get("rg_name")!.value || "";
    const surname = this.regularClientForm.get("rg_surname")!.value || "";
    if (name && surname) {
      const account = this.generateAccountNumber(name, surname);
      this.regularClientForm
        .get("rg_account")!
        .setValue(account, { emitEvent: false });
    }
  }

  createForm(): FormGroup {
    const namePattern = "^[A-Za-z\\s'-]{1,50}$";
    return this.fb.group({
      rg_account: [
        { value: this.regularClient.rg_account || "", disabled: true },
      ],
      rg_title: [this.regularClient.rg_title || "", Validators.required],
      rg_name: [
        this.regularClient.rg_name || "",
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(50),
        ],
      ],
      rg_surname: [
        this.regularClient.rg_surname || "",
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(50),
        ],
      ],
      rg_company: [
        this.regularClient.rg_company || "",
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(50),
        ],
      ],
      rg_company_phone: [this.regularClient.rg_company_phone || ""],
      rg_company_person: [
        this.regularClient.rg_company_person || "",
        [
          Validators.required,
          Validators.pattern(namePattern),
          Validators.maxLength(50),
        ],
      ],
      rg_email: [
        this.regularClient.rg_email || "",
        [Validators.required, Validators.email],
      ],
      rg_address: [this.regularClient.rg_address || ""],
      rg_company_website: [this.regularClient.rg_company_website || ""],
      rg_phone: [this.regularClient.rg_phone || ""],
      rg_isliable: [this.regularClient.rg_isliable || ""],
      rg_company_vat: [this.regularClient.rg_company_vat || ""],
      rg_company_type: [this.regularClient.rg_company_type || ""],
    });
  }

  // Helper function for padding
  private pad(n: number): string {
    return n < 10 ? "0" + n : n.toString();
  }

  // Call this when adding a new guest
  private generateAccountNumber(name: string, surname: string): string {
    const now = new Date();
    const month = this.pad(now.getMonth() + 1);
    const date = this.pad(now.getDate());
    const hours = this.pad(now.getHours());
    const mins = this.pad(now.getMinutes());
    return `LHR${name[0]?.toUpperCase() || ""}${
      surname[0]?.toUpperCase() || ""
    }${month}${date}${hours}${mins}`;
  }

  submit() {
    if (this.regularClientForm.valid) {
      debugger;
      const formValue = this.regularClientForm.getRawValue();
      if (this.action === "edit") {
        this.regularClientService.updateRegularClient(formValue).subscribe({
          next: (res) => {
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            console.error("[ERROR] Failed to update client:", err);
          },
        });
      } else {
        debugger;
        this.regularClientService.addRegularClient(formValue).subscribe({
          next: (res) => {
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            console.error("[ERROR] Failed to add client:", err);
          },
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
