import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Performance } from '../DataClasses/Performance';
import {AppUser} from "../DataClasses/AppUser";

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private http:HttpClient) { }

  getPerformance(): Observable<HttpResponse<Performance>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = {'Authorization': 'Bearer '+ localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Performance>('https://localhost:8443/api/performance/',{headers, observe:'response'});
    }
    return null;
  }

  getPerformances(): Observable<HttpResponse<Performance[]>>{
    if(localStorage.getItem("access_token")!=null){
      const headers = {'Authorization': 'Bearer '+ localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.get<Performance[]>('https://localhost:8443/api/performance/available/',{headers, observe:'response'});
    }
    return null;
  }

  updatePerformance(performance:Performance):Observable<HttpResponse<Performance>>{
    if(localStorage.getItem("access_token")!=null) {
      const headers = {'Authorization': 'Bearer '+ localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.patch<Performance>('https://localhost:8443/api/performance/'+performance.id,JSON.stringify(performance),{headers, observe:'response'});
    }
    return null;
  }

  savePerformance(performance:Performance,appUser:string):Observable<HttpResponse<Performance>>{
    if(localStorage.getItem("access_token")!=null) {
      const body = {
        "performance": performance,
        "email":appUser
      }
      const headers = {'Authorization': 'Bearer '+ localStorage.getItem("access_token"),'Content-Type': 'application/json; charset=utf-8' };
      return this.http.post<Performance>('https://localhost:8443/api/performance/',JSON.stringify(body),{headers, observe:'response'});
    }
    return null;
  }
}
