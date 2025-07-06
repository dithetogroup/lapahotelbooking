import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomRates } from './room-rates.model';
import { environment } from '@env/environment';
import { RoomTypeDetails } from './room-rates-all.model';

@Injectable({
  providedIn: 'root',
})
export class RoomRatesService {
  private readonly API_URL = 'assets/data/roomRates.json'; // Update URL to your API or data file path
  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private httpClient: HttpClient) {}

  // getAllRoomRates(): Observable<RoomRates[]> {
  //   return this.httpClient.get<RoomRates[]>(this.API_URL);
  // }

  getAllRoomRates(): Observable<{ data: RoomTypeDetails[] }> {
    return this.httpClient.get<{ data: RoomTypeDetails[] }>(this.baseUrl + this.urlEndPoints.getAllRoomRates);
  }  

  addRoomRates(roomRates: RoomRates): Observable<RoomRates> {
    debugger;
    // Assuming there is an endpoint to handle this operation
    return this.httpClient.post<RoomRates>(
      this.API_URL + '/addRoomRate',
      roomRates
    );
  }

  updateRoomRates(roomRates: RoomTypeDetails): Observable<RoomTypeDetails> {
    debugger;
    console.log('[DEBUG] Full URL:', this.baseUrl + this.urlEndPoints.updateRoomRates);
    console.log('[DEBUG] Payload:', roomRates);

    return this.httpClient.post<RoomTypeDetails>(this.baseUrl + this.urlEndPoints.updateRoomRates,roomRates);
  }


  // updateRoomRates2(roomRates: RoomRates): Observable<RoomRates> {
  //   // Assuming there is an endpoint to handle this operation
  //   return this.httpClient.put<RoomRates>(
  //     this.API_URL + '/updateRoomRate',
  //     roomRates
  //   );
  // }

  deleteRoomRates(id: number): Observable<void> {
    // Assuming there is an endpoint to handle this operation
    return this.httpClient.delete<void>(`${this.API_URL}/deleteRoomRate/${id}`);
  }
}
