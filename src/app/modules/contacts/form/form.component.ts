import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ContactsService } from '../contacts.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Contacts } from '../contacts.model';
import { formatDate, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';

export interface DialogData {
  id: number;
  action: string;
  contacts: Contacts;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCardModule,
    DatePipe,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  providers: [],
})
export class FormComponent {
  action: string;
  dialogTitle?: string;
  isDetails = false;
  contactsForm?: FormGroup;
  contacts: Contacts;
  constructor(
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public contactsService: ContactsService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.isDetails = false;
      this.dialogTitle = data.contacts.name;
      this.contacts = data.contacts;
      this.contactsForm = this.createContactForm();
    } else if (this.action === 'details') {
      this.contacts = data.contacts;
      this.isDetails = true;
    } else {
      this.isDetails = false;
      this.dialogTitle = 'New Contacts';
      const blankObject = {} as Contacts;
      this.contacts = new Contacts(blankObject);
      this.contactsForm = this.createContactForm();
    }
  }
  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.contacts.id],
      img: [this.contacts.img],
      name: [this.contacts.name],
      email: [
        this.contacts.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      birthDate: [
        formatDate(this.contacts.birthDate, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      address: [this.contacts.address],
      mobile: [this.contacts.mobile],
      note: [this.contacts.note],
    });
  }
  submit() {
    this.contactsService.addContacts(this.contactsForm?.getRawValue());
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
