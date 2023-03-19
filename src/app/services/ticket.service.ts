import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketResponse } from '../DataClasses/TicketResponse';
import { Reservation } from '../DataClasses/Reservation';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http:HttpClient) { }

  getTickets(id: number): Observable<HttpResponse<TicketResponse>>{
    const headers = { 'Authorization': "Bearer "+localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
    return this.http.get<TicketResponse>('https://localhost:8443/api/ticket/' + id,{headers, observe:"response"});
  }

  checkIn(id: number): Observable<HttpResponse<Reservation>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = { 'Authorization': "Bearer "+localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Reservation>('https://localhost:8443/api/ticket/checkIn/' + id,{headers, observe:"response"});
    }
    return null;
  }

  getTicketInfo(id: number): Observable<HttpResponse<any>>{
    const headers = {'Content-Type': 'application/json; charset=utf-8' };
    return this.http.get<any>('https://localhost:8443/api/ticket/info/' + id,{headers, observe:"response"});
  }
}
