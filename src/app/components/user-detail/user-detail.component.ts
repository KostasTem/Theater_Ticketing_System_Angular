import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppUser} from 'src/app/DataClasses/AppUser';
import {Performance} from 'src/app/DataClasses/Performance';
import {AppUserService} from 'src/app/services/app-user.service';
import {AuthService} from 'src/app/services/auth.service';
import {PerformanceService} from 'src/app/services/performance.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{
  @Input() user:AppUser;

  available_performances: Performance[] = [];

  selected_performance:Performance = null;

  edit:boolean;

  oldPass:string;

  newPass:string;

  confirm:string;

  click:boolean = false;

  constructor(private performanceService:PerformanceService,private route:ActivatedRoute,private router:Router,private appUserService:AppUserService,private authService:AuthService){}

  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("SYSTEM_ADMIN")){
      this.router.navigateByUrl("");
      return;
    }
    if(this.router.url.includes("edit")){
      this.appUserService.getUser(this.authService.user.email).subscribe(res =>{
        if(res.status==200){
          this.user = res.body;
          this.edit = true;
        }
      });
    }
    else {
      const email = this.route.snapshot.paramMap.get('email');
      if (email != null || email != "") {
        this.appUserService.getUser(email).subscribe(res => {
          if (res.status == 200) {
            this.edit=false;
            this.user = res.body;
            if (res.body.performance != null) {
              this.selected_performance = res.body.performance;
            }
            this.get_avaiable_performances();
          } else {
            this.router.navigateByUrl("/users");
          }
        });
      }
    }
  }


  get_avaiable_performances(){
    this.performanceService.getPerformances().subscribe(res =>
      {
        if(res.status==200){
          this.available_performances = res.body;
        }
      });
  }

  change_per(event:Event){
    this.selected_performance = this.available_performances.find(performance => performance.name == (event.target as HTMLInputElement).value);
  }

  save_change(){
    this.click = true;
    if(!this.edit) {
      const roles = ["USER"];
      if (this.selected_performance != null) {
        roles.push("ADMIN");
      } else {
        this.selected_performance = new Performance();
        this.selected_performance.id = 0;
      }
      this.appUserService.updateUser(this.user.email, roles, this.selected_performance.id).subscribe(res => {
        if (res.status == 200) {
          alert("Success");
        }
        this.router.navigateByUrl("/users");
      });
    }
    else{
      if(this.newPass==this.confirm && this.newPass!=null && this.newPass.length>0) {
        this.appUserService.updatePassword(this.oldPass, this.newPass).subscribe(res => {
          if (res.status == 200) {
            alert("Success");
            this.router.navigateByUrl("");
          }
        });
      }
      else{
        alert("Passwords don't match")
      }
    }
  }

}
