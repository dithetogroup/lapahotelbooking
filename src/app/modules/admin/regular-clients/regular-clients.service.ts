import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { RegularClients } from './regular.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegularClientsService {

  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private httpClient: HttpClient) {}

  getRegularGuest(): Observable<{ data: RegularClients[] }> {
    return this.httpClient.get<{ data: RegularClients[] }>(this.baseUrl + this.urlEndPoints.getRegularGuest);
  } 

  // updateRegularClient(formValue: RegularClients): Observable<any> {
  //   return this.httpClient.post<any>(
  //     this.baseUrl + this.urlEndPoints.updateRegularClient,
  //     formValue, // send the data
  //     {
  //       headers: { 'Content-Type': 'application/json' }
  //     }
  //   );
  // }

  updateRegularClient(formValue: RegularClients): Observable<any> {
    return this.httpClient.post<any>( this.baseUrl + this.urlEndPoints.updateRegularClient,formValue);
  }

  addRegularClient(formValue: RegularClients): Observable<any> {
    return this.httpClient.post<{ data: RegularClients[] }>(this.baseUrl + this.urlEndPoints.addRegularClient, formValue);
  } 

  deleteRegularClient(rg_account: string): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.urlEndPoints.deleteRegularClient, { rg_account });
  }

}
