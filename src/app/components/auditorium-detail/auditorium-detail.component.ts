import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auditorium } from 'src/app/DataClasses/Auditorium';
import { AuditoriumService } from 'src/app/services/auditorium.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auditorium-detail',
  templateUrl: './auditorium-detail.component.html',
  styleUrls: ['./auditorium-detail.component.css']
})
export class AuditoriumDetailComponent {
  @Input() auditorium:Auditorium;
  click:boolean = false;


  constructor(private auditoriumService:AuditoriumService,private authService:AuthService,private route:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("SYSTEM_ADMIN")){
      this.router.navigateByUrl("/");
      return;
    }
    const id =+ this.route.snapshot.paramMap.get('id');
    if(!Number.isNaN(id)){
      this.auditoriumService.getAuditorium(id).subscribe(res => {
        if(res.status==200){
          this.auditorium = res.body;
        }
      });
    }
    else{
      this.auditorium = new Auditorium();
    }
  }
  save_auditorium(){
    this.click = true;
    if(this.auditorium.seatsPerRow>5 && this.auditorium.rows>5 && this.auditorium.name!=null && this.auditorium.name.length > 0) {
      if (this.auditorium.id == null) {
        this.auditoriumService.createAuditorium(this.auditorium).subscribe(res => {
          if (res.status == 200) {
            this.router.navigateByUrl("/auditoriums");
          }
        });
      } else {
        this.auditoriumService.updateAuditorium(this.auditorium.id, this.auditorium).subscribe(res => {
          if (res.status == 200) {
            this.router.navigateByUrl("/auditoriums");
          }
        });
      }
    }
    else{
      alert("You need to fill in all the fields!");
    }
  }

}
