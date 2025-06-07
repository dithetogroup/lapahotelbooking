import { formatDate } from '@angular/common';

export class BookingInvoices {
  filename: string;
  modified: string;
  url: string;
  guest_name?: string;
  guest_surname?: string;
  guest_title?: string;
  guest_email?: string;
  booked_by?: string;
  guest_invoice?: string;

  constructor(allBookingsInvoices: BookingInvoices) {
    this.guest_title = allBookingsInvoices.guest_title ?? '';
    this.guest_name = allBookingsInvoices.guest_name ?? '';
    this.guest_surname = allBookingsInvoices.guest_surname ?? '';
    this.filename = allBookingsInvoices.filename ?? '';
    this.modified = allBookingsInvoices.modified ?? '';
    
    this.modified = allBookingsInvoices.modified 
      ? formatDate(allBookingsInvoices.modified, 'yyyy-MM-dd', 'en') 
      : '';
    this.url = allBookingsInvoices.guest_email ?? '';
    this.url = allBookingsInvoices.booked_by ?? '';
    this.url = allBookingsInvoices.url ?? '';
    this.guest_invoice = allBookingsInvoices.guest_invoice ?? '';
  
  }
}


