import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RoomRatesService } from '../../room-rates.service';
import { RoomTypeDetails } from '../../room-rates-all.model';
import { NgIf } from '@angular/common';

export interface DialogData {
  roomRates: RoomTypeDetails;
  action: 'edit' | 'add';
}

@Component({
  selector: 'app-room-rates-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgIf
  ],
})
export class RoomRatesFormDialogComponent {
  action: string;
  dialogTitle: string;
  roomRatesForm: FormGroup;
  roomRates: RoomTypeDetails;

  constructor(
    public dialogRef: MatDialogRef<RoomRatesFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public roomRatesService: RoomRatesService,
    private fb: FormBuilder
  ) {
    this.action = data.action;
    this.roomRates = data.roomRates || {} as RoomTypeDetails;
    this.dialogTitle = this.action === 'edit' ? 'Edit Room Type' : 'New Room Type';
    this.roomRatesForm = this.createForm();

    console.log('[DEBUG] Dialog data:', data);
    console.log('[DEBUG] Action received:', data.action);

  }



  createForm(): FormGroup {
    return this.fb.group({
      roomTypeId: [this.roomRates.roomTypeId || null],
      roomName: [this.roomRates.roomName || '', Validators.required],
      roomCode: [this.roomRates.roomCode || '', Validators.required],
      weekendRate: [this.roomRates.weekendRate || '', Validators.required],
      weekRate: [this.roomRates.weekRate || '', Validators.required],
      discountedRate: [this.roomRates.discountedRate || ''],
      bedType: [this.roomRates.bedType || '', Validators.required],
      totalRooms: [{ value: this.roomRates.totalRooms, disabled: true }],

    });
  } 

  submit() {
    if (this.roomRatesForm.valid) {
      const formValue = this.roomRatesForm.getRawValue();
      console.log('[DEBUG] Submitting form:', formValue);
  
      if (this.action === 'edit') {
        this.roomRatesService.updateRoomRates(formValue).subscribe({
          next: (res) => {
            console.log('[DEBUG] Room updated successfully:', res);
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            console.error('[ERROR] Failed to update room:', err);
          }
        });
      } else {
        this.roomRatesService.addRoomRates(formValue).subscribe({
          next: (res) => {
            console.log('[DEBUG] Room added successfully:', res);
            this.dialogRef.close(formValue);
          },
          error: (err) => {
            console.error('[ERROR] Failed to add room:', err);
          }
        });
      }
    }
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
