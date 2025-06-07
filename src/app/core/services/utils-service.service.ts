import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsServiceService {

  constructor() { }


  /** ✅ Format Date to MySQL Date (YYYY-MM-DD) */
  formatToMySQLDate(date: string | Date): string {
    if (!date) return ''; 
  
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return ''; 
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /** ✅ Format Date for UI Display */
  formatDate(date: string | Date, format: string = 'dd MMM yyyy'): string {
    const options: Intl.DateTimeFormatOptions = this.getDateFormatOptions(format);
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return ''; 
    }

    return parsedDate.toLocaleDateString('en-US', options);
  }


  /** ✅ Map format strings to Intl options */
  private getDateFormatOptions(format: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'dd MMM yyyy':
        return { day: '2-digit', month: 'short', year: 'numeric' };
      case 'MMM dd, yyyy':
        return { month: 'short', day: '2-digit', year: 'numeric' };
      case 'yyyy-MM-dd':
        return { year: 'numeric', month: '2-digit', day: '2-digit' };
      default:
        return { year: 'numeric', month: 'short', day: '2-digit' };
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}${month}${day}`; // Format: YYYYMMDD
  }


  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const checkIn = control.get('checkInDate')?.value;
      const checkOut = control.get('checkOutDate')?.value;

      if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
        return { invalidDateRange: true };
      }

      return null;
    };
  }
}
