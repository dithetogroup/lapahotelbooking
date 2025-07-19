import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { RegularClients } from '../regular-clients/regular.model';
import { SpaBooking } from './spa-bookings/spa.model';

@Injectable({
  providedIn: 'root'
})
export class BoniSpaService {


  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private httpClient: HttpClient) {}

  getSpaBookings(): Observable<{ data: SpaBooking[] }> {
    return this.httpClient.get<{ data: SpaBooking[] }>(this.baseUrl + this.urlEndPoints.getSpaBookings);
  } 

  deleteSpaBooking(id: number): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.deleteSpaBooking, { id });
  }

  updateSpaBooking(formValue: SpaBooking): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.updateSpaBooking,formValue);
  }

  addSpaBooking(formValue: SpaBooking): Observable<any> {
    debugger;
    return this.httpClient.post<{ data: SpaBooking[] }>(this.baseUrl + this.urlEndPoints.addSpaBooking, formValue);
  } 


  getSpaTherapists(): Observable<{ data: any[] }> {
    return this.httpClient.get<{ data: any[] }>(this.baseUrl + this.urlEndPoints.getSpaTherapists);
  } 
  

}
