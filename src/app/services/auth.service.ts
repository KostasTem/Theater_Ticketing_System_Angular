import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppUser } from '../DataClasses/AppUser';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PerformanceService } from './performance.service';
import { Performance } from '../DataClasses/Performance';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: AppUser = null;

  performance: Performance = null;

  constructor(private http:HttpClient,private jwtHelper: JwtHelperService, private performanceService:PerformanceService,private router:Router) { }
  handleGoogleSignIn(response: any) {
    const headers = { 'Content-Type': 'application/json; charset=utf-8' };
    const body = { googleToken: response.credential }
    this.http.post<any>('https://localhost:8443/api/auth/google', JSON.stringify(body), {headers,observe:"response"}).subscribe(response => {
      if(response.status==200) {
        this.logout();
        localStorage.setItem("access_token", response.body.token);
        const dec_data = this.jwtHelper.decodeToken(response.body.token);
        const dt = new Date(0);
        dt.setUTCSeconds(dec_data.exp);
        this.user = new AppUser(dec_data.sub,dec_data.roles.split(" "),dt);
        if(response.body.user.image!=null){
          this.user.image = response.body.user.image;
        }
        localStorage.setItem("expiration",JSON.stringify(dt));
        if(this.user.roles.includes("ADMIN")){
          this.performanceService.getPerformance().subscribe(res =>
          {
            this.performance = res.body;
          });
        }
        this.router.navigateByUrl("");
        setTimeout(
          function (){
            location.reload();
          }, 100
        );
      }
  });
  }
  register(user:AppUser){
    const headers = {"Content-Type":'application/json'};
    return this.http.post<any>('https://localhost:8443/api/auth/register', JSON.stringify(user), {headers, observe: 'response'});
  }
  login(email: string, password: string){
    const data = {
      "username": email,
      "password": password
    };
    const headers = {'access-control-allow-origin': "*","Content-Type":'application/json'};
    return this.http.post<any>('https://localhost:8443/api/auth/login', JSON.stringify(data), {headers, observe:'response'});
  }
  logout(){
    if(localStorage.getItem("access_token")!=null){
        localStorage.removeItem("access_token");
        this.user = null;
        this.performance = null
        this.router.navigateByUrl("");
    }
  }
}
