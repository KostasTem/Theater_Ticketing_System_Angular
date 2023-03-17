import {Component, OnInit} from '@angular/core';
import {Show} from "../../DataClasses/Show";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PerformanceService} from "../../services/performance.service";
import {Performance} from "../../DataClasses/Performance";
import {AppUser} from "../../DataClasses/AppUser";
import {AppUserService} from "../../services/app-user.service";

@Component({
  selector: 'app-performance-detail',
  templateUrl: './performance-detail.component.html',
  styleUrls: ['./performance-detail.component.css']
})
export class PerformanceDetailComponent implements OnInit{

  performance:Performance = null;
  imageFile:any;
  available_users:AppUser[] = null;
  selected_user = null;

  constructor(private authService:AuthService,private router:Router,private route:ActivatedRoute,private performanceService:PerformanceService,private appUserService:AppUserService) {
  }

  ngOnInit() {
    if(this.authService.user==null || this.authService.user.roles.length<=1 ||(this.authService.user.roles.includes("ADMIN") && !this.authService.user.roles.includes("SYSTEM_ADMIN") && this.router.url.includes("new")) || (this.authService.user.roles.includes("SYSTEM_ADMIN") && !this.authService.user.roles.includes("ADMIN") && !this.router.url.includes("edit"))){
       this.router.navigateByUrl("/");
       return;
    }
    if(this.router.url.includes("edit")){
      this.performanceService.getPerformance().subscribe(res =>{
        if(res.status==200){
          this.performance = res.body;
        }
      })
    }
    else{
      this.performance = new Performance();
      this.appUserService.getNonAdmins().subscribe(res => {
        if(res.status==200){
          this.available_users = res.body;
        }
      })
    }
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
    this.performance.image = readerEvent.target.result;
  }

  save_change(){
    if(this.performance.id==null){
      console.log(this.selected_user);
      if(this.performance.ticketPrice!=null && this.performance.duration!=null && this.performance.name!=null && this.performance.image!=null) {
        this.performanceService.savePerformance(this.performance,this.selected_user).subscribe(res => {
          if (res.status == 200) {
            alert("Success");
            this.router.navigateByUrl("");
          }
        });
      }
      else{
        alert("You need to fill in all the required fields");
      }
    }
    else{
      if(this.performance.ticketPrice>0 && this.performance.duration>0 && this.performance.name!="" && this.performance.image!=""){
        this.performanceService.updatePerformance(this.performance).subscribe(res => {
          if(res.status==200){
            alert("Success");
            this.router.navigateByUrl("/shows");
          }
        });
      }
      else{
        alert("All the required fields need to have a value")
      }
    }
  }
  change_user(event){
    if((event.target as HTMLInputElement).value!=null) {
      this.selected_user = (event.target as HTMLInputElement).value;
    }
    else{
      this.selected_user = "";
    }
  }
}
