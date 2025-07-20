import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TherapistDialogData } from '../../spa-bookings/spa.model';


@Component({
  selector: 'app-update-therapist-dialog',
  standalone: true,
  templateUrl: './update-therapist-dialog.component.html',
  styleUrls: ['./update-therapist-dialog.component.scss'],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule
  ]
})
export class UpdateTherapistDialogComponent implements OnInit {
  dialogTitle: string;
  therapistForm: FormGroup;
  action: string;
  therapistData: any;

  constructor(
    public dialogRef: MatDialogRef<UpdateTherapistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TherapistDialogData,
    private fb: FormBuilder
  ) {
    this.action = data.action;
    // Use packageData instead of therapistData
    this.therapistData = data.therapistData || {};
    this.dialogTitle = this.action === 'edit' ? 'Edit Therapist' : 'Add Therapist';
    this.therapistForm = this.createForm();
  }
  

  ngOnInit(): void {
    console.log('Dialog Data:', this.data);
    console.log('Form Before Patch:', this.therapistForm.value);



    if (this.action === 'edit' && this.therapistData) {
    // Log therapistData
    console.log('Therapist Data to Patch:', this.therapistData);

    // Patch it
    this.therapistForm.patchValue(this.therapistData);

    // Log result
    setTimeout(() => {
      console.log('Form After Patch:', this.therapistForm.value);
    });
  }

  }

  createForm(): FormGroup {
    return this.fb.group({
      therapists_title: [this.therapistData.therapists_title || '', Validators.required],
      therapists_name: [this.therapistData.therapists_name || '', Validators.required],
      therapists_surname: [this.therapistData.therapists_surname || '', Validators.required],
      therapists_contacts: [this.therapistData.therapists_contacts || '', Validators.required],
      id: [this.therapistData.id || null]
    });
  }

  submit() {
    if (this.therapistForm.valid) {
      this.dialogRef.close(this.therapistForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
