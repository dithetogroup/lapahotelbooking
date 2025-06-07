import { formatDate } from '@angular/common';

export class CancelledBooking {
  id?: number;
  booking_id?: number;
  booking_reference?: string;

  guest_title?: string;
  guest_name?: string;
  guest_surname?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_invoice?: boolean;
  special_requests?: string;
  booked_by?: string;

  checkInDate?: string;
  checkOutDate?: string;
  booking_status?: string;
  payment_status?: string;
  booking_state?: string;
  payment_types?: string;
  payment_amount?: number;

  room_no?: string | number;
  room_name?: string;
  package_names?: string;
  package_prices?: string;

  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;

  constructor(data: Partial<CancelledBooking> = {}) {
    this.id = data.id ?? 0;
    this.booking_id = data.booking_id ?? 0;
    this.booking_reference = data.booking_reference || '';

    this.guest_title = data.guest_title || '';
    this.guest_name = data.guest_name || '';
    this.guest_surname = data.guest_surname || '';
    this.guest_email = data.guest_email || '';
    this.guest_phone = data.guest_phone || '';
    this.guest_invoice = data.guest_invoice ?? false;
    this.special_requests = data.special_requests || '';
    this.booked_by = data.booked_by || '';

    this.checkInDate =
      data.checkInDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.checkOutDate =
      data.checkOutDate || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.booking_status = data.booking_status || 'Cancelled';
    this.payment_status = data.payment_status || '';
    this.booking_state = data.booking_state || '';
    this.payment_types = data.payment_types || '';
    this.payment_amount = data.payment_amount ?? 0;

    this.room_no = data.room_no ?? '';
    this.room_name = data.room_name || '';
    this.package_names = data.package_names || '';
    this.package_prices = data.package_prices || '';

    this.cancellation_reason = data.cancellation_reason || '';
    this.cancelled_by = data.cancelled_by || '';
    this.cancelled_at = data.cancelled_at || formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }
}

// 👇 Unique interface for grouped rows in cancelled bookings table
export interface CancelledBookingRow extends CancelledBooking {
  isFirstRowOfGroup: boolean;
  groupSize: number;
}
