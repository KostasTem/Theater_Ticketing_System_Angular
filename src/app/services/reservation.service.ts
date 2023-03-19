import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Reservation } from '../DataClasses/Reservation';
import { ReservationResponse } from '../DataClasses/ReservationResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http:HttpClient) { }

  getReservations(): Observable<HttpResponse<ReservationResponse[]>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<ReservationResponse[]>('https://localhost:8443/api/reservation/',{headers, observe:'response'});
    }
    return null;
  }

  createReservation(showID: number, seats: string[],emails:string[]): Observable<HttpResponse<Reservation>>{
    if(localStorage.getItem("access_token")!=null){
      const body = {
        "showID": showID,
        "tickets": seats,
        "emails": emails
      }
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.post<Reservation>('https://localhost:8443/api/reservation/', body ,{headers, observe:'response'});
    }
    return null;
  }

  deleteReservation(id: number): Observable<HttpResponse<string>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = { 'Authorization': "Bearer " + localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.delete<string>('https://localhost:8443/api/reservation/'+id,{headers, observe:'response',responseType:'text' as 'json'});
    }
    return null;
  }
}
