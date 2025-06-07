import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CancelledBookings } from './cancel-bookings.model';
import { environment } from '@env/environment';
import { CancelledBooking } from './cancel-booking.model';

@Injectable({
  providedIn: 'root',
})
export class CancelBookingsService {
  private readonly API_URL = 'assets/data/cancelBookings.json';
  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private httpClient: HttpClient) {}

  getAllCancelBookings(): Observable<CancelledBookings[]> {
    return this.httpClient.get<CancelledBookings[]>(this.API_URL);
  }

  getCanceledBookingsLists(): Observable<{ status: string; data: CancelledBooking[] }> {
    return this.httpClient.get<{ status: string; data: CancelledBooking[] }>(this.baseUrl  + this.urlEndPoints.getCanceledBookingsLists);
  }

  addCancelBooking(
    cancelBooking: CancelledBookings
  ): Observable<CancelledBookings> {
    return this.httpClient.post<CancelledBookings>(
      this.API_URL + '/addCancelBooking',
      cancelBooking
    );
  }

  updateCancelBooking(
    cancelBooking: CancelledBookings
  ): Observable<CancelledBookings> {
    return this.httpClient.put<CancelledBookings>(
      this.API_URL + '/updateCancelBooking',
      cancelBooking
    );
  }

  deleteCancelBooking(id: number): Observable<void> {
    const urlString: string = this.API_URL + '/deleteCancelBooking/' + id;
    return this.httpClient.delete<void>(urlString);
  }

  updateBookingStatus(refundStatusData: any): Observable<any> {
    const body = refundStatusData;
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.updateBookingStatus, body); 
  }

}
