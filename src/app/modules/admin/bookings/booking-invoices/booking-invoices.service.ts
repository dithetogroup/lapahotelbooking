import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { BookingInvoices } from './booking-invoices.model';

@Injectable({
  providedIn: 'root',
})
export class BookingInvoicesService {
  private readonly API_URL = 'assets/data/allBookings.json';
  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

    
  constructor(private httpClient: HttpClient) {}

  
  getAllBookingInvoices(): Observable<{ status: string; data: BookingInvoices[] }> {
    return this.httpClient.get<{ status: string; data: BookingInvoices[] }>(this.baseUrl  + this.urlEndPoints.getAllBookingInvoices);
  }


  
}
