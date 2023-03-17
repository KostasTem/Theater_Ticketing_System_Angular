import {Component, AfterViewInit, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';

import { AuthService } from './services/auth.service';
import { ShowService } from './services/show.service';
import { Performance } from './DataClasses/Performance';
import { AppUser } from './DataClasses/AppUser';
import { ReservationService } from './services/reservation.service';
import { ReservationResponse } from './DataClasses/ReservationResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auditorium } from './DataClasses/Auditorium';
import { PerformanceService } from './services/performance.service';
import { DomSanitizer } from '@angular/platform-browser';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {ShowList} from "./DataClasses/ShowList";
import {Router} from "@angular/router";
import {Show} from "./DataClasses/Show";
import {AppUserService} from "./services/app-user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  imageFile;
  @ViewChild('fileupload') inputB: ElementRef;
  constructor(private showService:ShowService, private performanceService:PerformanceService,private jwtHelper:JwtHelperService,private authService:AuthService,private appUserService:AppUserService,private router:Router){}

  ngOnInit(): void {
      if(localStorage.getItem("access_token")!=null){
        this.authService.user = JSON.parse(localStorage.getItem("user"));
        this.authService.user.expiration = new Date(Date.parse(this.authService.user.expiration.toString()));
        if(localStorage.getItem("performance")!=null){
          this.authService.performance = JSON.parse(localStorage.getItem("performance"));
        }
      }
  }

  change_image(){
    this.inputB.nativeElement.click();
  }

  check_user(){
    return this.authService.user != null;
  }

  get_user_name(){
    return this.authService.user.email;
  }

  get_user_image(){
    return this.authService.user.image;
  }

  check_user_role(){
    return this.authService.user.roles;
  }

  logout(){
    this.authService.logout();
  }

  load_image(event: Event){
    var eventTarget = (event.target as HTMLInputElement);
    if(eventTarget){
      this.imageFile = eventTarget.files[0];
      var fr = new FileReader();
      fr.onload = this._handleReader.bind(this);
      fr.readAsDataURL(eventTarget.files[0]);
    }
  }
  _handleReader(readerEvent){
    this.appUserService.updateImage(readerEvent.target.result).subscribe(res => {
      if(res.status==200){
        this.authService.user.image = readerEvent.target.result;
        alert("Success");
        this.router.navigateByUrl("");
      }
    });
  }
}
