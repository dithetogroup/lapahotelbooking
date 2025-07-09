export interface PersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  title: string;
  surname: string;
  invoice: string;
}

export interface ReservationInfo {
  checkInDate: string; // Use appropriate date format or type
  checkOutDate: string; // Use appropriate date format or type
  bookingReference: string;
  paymentTypes: string;
  paymentStatus: string;
  paymentAmount: number;
  bookingState: string;
  isBookingCanceled: number;
  cancellation_reason: string;
}

export interface GuestDetails {
  personalInfo: PersonalInfo;
  reservationInfo: ReservationInfo;
  specialRequests: string;
  package: Package;
}

export interface Occupancy {
  id: number;
  roomNo: number;
  weekendPrice: number;
  weekPrice: number;
  discountedPrice: number;
  type: string;
  bed: string;
  occupants: string;
  bedTypeId: number;
  roomType: string;
  bedType: string;
  isAvailable: boolean;
  roomTypeId: number;
  roomPrice: number;
  occupantsTypeId: number;
  bookingReference?: string;
  status: string; // "Booked" or other statuses
  guestDetails?: GuestDetails; // Optional, as not all rooms may have guest details
}

export interface Package {
  name: string;
  price: number;
}
