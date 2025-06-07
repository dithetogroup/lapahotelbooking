import { formatDate } from '@angular/common';

export class AllBookingslist {
  id: number;
  guest_title: string;
  guest_name: string;
  guest_surname: string;
  guest_email: string;
  package: string;
  checkInDate: string;
  checkOutDate: string;
  guest_phone: string;
  booked_by: string;
  booking_reference: string;
  package_name: string;
  booking_status: string;
  payment_status: string;
  checkInStatus: string;
  booking_state: string;
  room_name: string;
  room_no: number;

  constructor(allBookings: Partial<AllBookingslist>) {
    this.id = allBookings.id ?? 0;
    this.guest_title = allBookings.guest_title ?? '';
    this.guest_name = allBookings.guest_name ?? '';
    this.guest_surname = allBookings.guest_surname ?? '';
    this.guest_email = allBookings.guest_email ?? '';
    this.package = allBookings.package ?? '';
    this.checkInDate = allBookings.checkInDate 
      ? formatDate(allBookings.checkInDate, 'yyyy-MM-dd', 'en') 
      : '';
    this.checkOutDate = allBookings.checkOutDate 
      ? formatDate(allBookings.checkOutDate, 'yyyy-MM-dd', 'en') 
      : '';
    this.guest_phone = allBookings.guest_phone ?? '';
    this.booked_by = allBookings.booked_by ?? '';
    this.booking_reference = allBookings.booking_reference ?? '';
    this.package_name = allBookings.package_name ?? '';
    this.booking_status = allBookings.booking_status ?? '';
    this.payment_status = allBookings.payment_status ?? '';
    this.booking_state = allBookings.booking_state ?? '';
    this.room_name = allBookings.room_name ?? '';
    this.checkInStatus = allBookings.checkInStatus ?? '';
    this.room_no = allBookings.room_no ?? 0;
  }
}


export interface GroupedBooking {
  guest: {
    full_name: string;
    phone: string;
    email: string;
    booked_by: string;
    booking_reference: string;
  };
  rows: AllBookingslist[];
}

export interface BookingRow extends AllBookingslist {
  isFirstRowOfGroup: boolean;
  groupSize: number;
}

