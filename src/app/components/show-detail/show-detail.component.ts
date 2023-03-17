import { AfterViewInit, Component,Input,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auditorium } from 'src/app/DataClasses/Auditorium';
import { Show } from 'src/app/DataClasses/Show';
import { AuthService } from 'src/app/services/auth.service';
import { ShowService } from 'src/app/services/show.service';



@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent implements OnInit{
  @Input() show: Show;
  available_auditoriums: Auditorium[]=null;
  show_date_time:Date = new Date();
  click:boolean = false;
  today:Date = new Date();

  constructor(private route:ActivatedRoute,private showService:ShowService,private authService:AuthService,private router: Router){}

  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("ADMIN")){
      this.router.navigateByUrl("/");
      return;
    }
    const id =+ this.route.snapshot.paramMap.get('id');
    if(!Number.isNaN(id)){
      this.showService.getShow(id).subscribe(res => {
        if(res.status==200){
          this.show = res.body;
          this.show_date_time = new Date(Date.parse(this.show.dateTime.toString()));
        }
      })
    }
    else{
      this.show = new Show(null,null,this.authService.performance,null);
    }
  }

  update_show(id:number,newShowTime: Date){
    if(this.show.auditorium==null){
      alert("You have to select an auditorium.");
      return;
    }
    const newShow = new Show(null,newShowTime,null,this.show.auditorium);
    this.showService.updateShow(id, newShow).subscribe(res => {
      if(res.status==200){
        console.log(res.body);
        this.router.navigateByUrl("/shows");
      }
    });
  }

  change_aud(event:Event){
    if((event.target as HTMLInputElement).value == "None"){
      this.show.auditorium = null;
      return;
    }
    this.show.auditorium = this.available_auditoriums.find(auditorium => auditorium.name == (event.target as HTMLInputElement).value);
  }

  save_show(){
    if(this.show.id == null){
      if(this.show.auditorium!=null){
        this.showService.createShow(this.show).subscribe(res => {
          if(res.status==200){
            console.log(res.body);
            this.router.navigateByUrl("/shows");
          }
        });
      }
      else{
        alert("You Must Select An Auditorium Before Saving This Show");
      }
    }
    else {
      this.update_show(this.show.id,this.show_date_time);
    }
  }

  get_available_auditoriums(){
    this.show_date_time = new Date(this.convert_time(this.show_date_time))
    this.show.dateTime = this.show_date_time;
    this.showService.getAvailableAuditoriums(this.show_date_time).subscribe(res =>
      {
        if(res.status==200){
          if(res.body.length==0){
            alert("No Available Auditoriums For This Time");
          }
          else{
            this.available_auditoriums = res.body;
          }
        }
      })
  }


  convert_time(date:Date){
    const year = date.getFullYear();
    const month = date.getMonth() + 1<10 ? "0"+(date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return `${year}-${month}-${day}T${hour}:${minute}`;
  }
}
