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

  deletePackage(id: number): Observable<any> {
    debugger;
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.deletePackage, { id });
  }

  updatePackage(data: any): Observable<any> {
    debugger;
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.updatePackage,data);
  }

  addPackage(data: any): Observable<any> {
   // debugger;
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.addPackage, data);
  } 

  //Spa Bookings
  updateSpaBooking(formValue: SpaBooking): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.updateSpaBooking,formValue);
  }

  getSpaBookedSlots(date: string) {
    return this.httpClient.get<{ data: any[] }>(this.baseUrl + this.urlEndPoints.getSpaBookedSlots + '?date=' + date);
  } 

  addSpaBooking(formValue: SpaBooking): Observable<any> {
     return this.httpClient.post<{ data: SpaBooking[] }>(this.baseUrl + this.urlEndPoints.addSpaBooking, formValue);
   } 

   getSpaBookings(): Observable<{ data: SpaBooking[] }> {
    return this.httpClient.get<{ data: SpaBooking[] }>(this.baseUrl + this.urlEndPoints.getSpaBookings);
  } 

  deleteSpaBooking(id: number): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.deleteSpaBooking, { id });
  }

  // Therapitst
  addTherapist(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.addTherapist, data);
  } 

  updateTherapist(data: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.updateTherapist,data);
  }

  deleteTherapist(id: number): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.deleteTherapist, { id });
  }

  getSpaTherapists(): Observable<any> {
    return this.httpClient.get<{ data: any[] }>(this.baseUrl + this.urlEndPoints.getSpaTherapists);
  } 

}
