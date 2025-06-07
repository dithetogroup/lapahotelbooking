import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AllBookings } from './all-bookings.model';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AllBookingslist } from './all-bookinglist.model';

@Injectable({
  providedIn: 'root',
})
export class AllBookingService {
  private readonly API_URL = 'assets/data/allBookings.json';
  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

    
  constructor(private httpClient: HttpClient) {}


  getAllBookingList(): Observable<AllBookings[]> {
    return this.httpClient.get<AllBookings[]>(this.API_URL);
  }

  // getAllBookingLists(): Observable<any[]> {
  //   return this.httpClient.get<any[]>(this.baseUrl + this.urlEndPoints.getAllBookingLists);
  // }

  bookingStatus(payload: any): Observable<any> {
    const body = payload;
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.bookingStatus, body); 
  }

  getAllBookingLists(): Observable<{ status: string; data: AllBookingslist[] }> {
    return this.httpClient.get<{ status: string; data: AllBookingslist[] }>(this.baseUrl  + this.urlEndPoints.getAllBookingLists);
  }

  
  getAllBookingInvoices(): Observable<{ status: string; data: AllBookingslist[] }> {
    return this.httpClient.get<{ status: string; data: AllBookingslist[] }>(this.baseUrl  + this.urlEndPoints.getAllBookingInvoices);
  }
  
  addBookings(booking: AllBookings) {
    return this.httpClient.post<AllBookings>(
      this.API_URL + '/addBooking',
      booking
    );
  }

  updateAllBookings(booking: AllBookings) {
    return this.httpClient.put<AllBookings>(
      this.API_URL + '/updateBooking',
      booking
    );
  }

  deleteAllBookings(id: number) {
    const urlString: string = this.API_URL + '/deleteBooking' + id;
    return this.httpClient.delete(urlString);
  }
}
