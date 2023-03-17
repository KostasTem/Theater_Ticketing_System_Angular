import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShowService } from 'src/app/services/show.service';
import { Show } from 'src/app/DataClasses/Show';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit{

  show_list:Show[] = null;
  today = new Date();
  performance = null;

  constructor(private showService:ShowService,private authService:AuthService,private router:Router){}

  ngOnInit(): void {
    if(this.authService.user==null || !this.authService.user.roles.includes("ADMIN")){
      this.router.navigateByUrl("/");
      return;
    }
    this.get_shows();
  }
  delete_show(id:number){
    if(confirm("Are you sure you want to delete this show?")==true){
      this.showService.deleteShow(id).subscribe(res => {
        alert(res.body)
        this.get_shows();
      });
    }
  }

  get_shows(){
    this.showService.getShowsForPerformance(this.authService.performance.id).subscribe(res => {
      if(res.status==200){
        this.show_list = res.body;
        this.performance = this.show_list.length>0 ? this.show_list.at(0).performance : this.authService.performance;
        this.show_list.forEach(show => {
          show.dateTime = new Date(Date.parse(show.dateTime.toString()));
        });
      }
    });
  }
}
