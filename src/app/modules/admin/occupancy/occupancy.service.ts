import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Occupancy } from './occupancy.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class OccupancyService {
  private apiUrl = 'assets/data/occupancy.json'; // Path to your JSON file
  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private http: HttpClient) {}

  getOccupancy(): Observable<Occupancy[]> {
    return this.http.get<Occupancy[]>(this.apiUrl);
  }

  getOccupancyList(): Observable<Occupancy[]> {
  return this.http.get<{ status: string; data: Occupancy[] }>(this.baseUrl + this.urlEndPoints.getoccupancy)
    .pipe(map((response) => {
      return response.data; 
    }));
  }

  getRoomOccupancyCounts(): Observable<any> {
    return this.http.get<any>(this.baseUrl + this.urlEndPoints.getRoomOccupancyCounts)
      .pipe(map((response) => {
        return response.data; 
      }));
    }

  addNewBooking(formValues: any): Observable<any> {
    const body = formValues;
    return this.http.post<any>(this.baseUrl + this.urlEndPoints.addNewBooking, body); 
  }

  cancelBooking(bookingData: any): Observable<any> {
    const body = bookingData;
    return this.http.post<any>(this.baseUrl + this.urlEndPoints.cancelBooking, body); 
  }

  editGuestPersonalDetails(personalDetails: any): Observable<any> {
    const body = personalDetails;
    return this.http.post<any>(this.baseUrl + this.urlEndPoints.editGuestPersonalDetails, body); 
  }

  getPackages(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getPackages);
  }

  getOccupants(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getOccupants);
  }

  getAvailableRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getAvailableRooms);
  }

  
  
}
