export class SpaBooking {
    id: number;
    spbooking_title: string;
    spbooking_name: string;
    spbooking_surname: string;
    spbooking_email: string;
    spbooking_contact: string;
    spbooking_date: string;
    spbooking_noofvisitors: number;
    package_id: number;
    package_name: string;
    therapist_id: number;
    therapist_name: string;
    spbooking_reason: string;
    spbooking_allergies: string;
    spbooking_bookedby: string;
    created_at: string;
    updated_at: string;
    spbooking_time: number;
    package_names: string;
    spbooking_totalprice: number;
  
    constructor(data: Partial<SpaBooking> = {}) {
      this.id = data.id ?? 0;
      this.spbooking_title = data.spbooking_title ?? '';
      this.spbooking_name = data.spbooking_name ?? '';
      this.spbooking_surname = data.spbooking_surname ?? '';
      this.spbooking_email = data.spbooking_email ?? '';
      this.spbooking_contact = data.spbooking_contact ?? '';
      this.spbooking_date = data.spbooking_date ?? '';
      this.spbooking_noofvisitors = data.spbooking_noofvisitors ?? 0;
      this.package_id = data.package_id ?? 0;
      this.package_name = data.package_name ?? '';
      this.therapist_id = data.therapist_id ?? 0;
      this.therapist_name = data.therapist_name ?? '';
      this.spbooking_reason = data.spbooking_reason ?? '';
      this.spbooking_allergies = data.spbooking_allergies ?? '';
      this.spbooking_bookedby = data.spbooking_bookedby ?? '';
      this.created_at = data.created_at ?? '';
      this.updated_at = data.updated_at ?? '';
      this.package_names = data.package_names ?? '';
      this.spbooking_time = data.spbooking_time ?? 0;
      this.spbooking_totalprice = data.spbooking_totalprice ?? 0;
    }
  }

  export interface SpaBookingDialogData {
    spaBooking: SpaBooking;
    action: "edit" | "add";
    packages: any[];      // Array of available packages
    therapists: any[];    // Array of available therapists
  }

  export interface PackageDialogData {
    action: 'edit' | 'add';
    packageData?: any; // { id, package_name, ... }
  }

  export interface TherapistDialogData {
    action: 'edit' | 'add';
    therapistData?: any;
  }

  
  