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

  // getOccupancyList(startDate?: Date | null, endDate?: Date | null): Observable<Occupancy[]> {
  //   let params: any = {};
  //   if (startDate && endDate) {
  //     params.startDate = startDate.toISOString().slice(0, 10);
  //     params.endDate = endDate.toISOString().slice(0, 10);
  //   }
  // return this.http.get<{ status: string; data: Occupancy[] }>(this.baseUrl + this.urlEndPoints.getoccupancy)
  //   .pipe(map((response) => {
  //     return response.data; 
  //   }));
  // }

  getOccupancyList(startDate: any, endDate: any): Observable<Occupancy[]> {
    let params: any = {};
  
    function toLocalYMD(date: any): string {
      // Handle Moment.js objects
      if (date && typeof date.isValid === 'function' && date.isValid()) {
        // Moment object: convert to JS Date
        date = date.toDate();
      }
      if (date instanceof Date && !isNaN(date.getTime())) {
        return [
          date.getFullYear(),
          (date.getMonth() + 1).toString().padStart(2, '0'),
          date.getDate().toString().padStart(2, '0')
        ].join('-');
      }
      return '';
    }
  
    if (startDate) {
      if (typeof startDate === 'string') {
        params.startDate = startDate;
      //  params.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
      } else {
        params.startDate = toLocalYMD(startDate);
      }
    }
    if (endDate) {
      if (typeof endDate === 'string') {
        params.endDate = endDate;
      } else {
        params.endDate = toLocalYMD(endDate);
      }
    }
  
    return this.http.get<{ status: string, data: Occupancy[] }>(
      this.baseUrl + this.urlEndPoints.getoccupancy,
      { params }
    ).pipe(
      map((response) => response.data)
    );
  }
  

  getRoomBookedDates(roomNo: any) {
    const url = `${this.baseUrl + this.urlEndPoints.getRoomBookedDates}?roomNo=${encodeURIComponent(roomNo)}`;
    return this.http.get<{status: string, data: {checkInDate: string, checkOutDate: string}[], message?: string}>(url);
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

  getRegularGuest(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getRegularGuest);
  }

  addRegularGuest(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + this.urlEndPoints.addRegularGuest, data);
  }
  

  getOccupants(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getOccupants);
  }

  getAvailableRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getAvailableRooms);
  }

  
  
}
