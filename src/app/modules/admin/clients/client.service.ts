import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = environment.baseUrl;
  private urlEndPoints = environment.urlEndPoints;

  constructor(private http: HttpClient) {}


  getRegularClients(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + this.urlEndPoints.getRegularClients);
  }

  
}
