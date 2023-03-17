import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from 'src/app/DataClasses/Reservation';
import { ReservationResponse } from 'src/app/DataClasses/ReservationResponse';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit{

  reservation_list:ReservationResponse[];

  test_id:number;

  today: Date;

  constructor(private reservationService:ReservationService,private authService:AuthService,private ticketService:TicketService,private router:Router){}

  ngOnInit(): void {
    this.today = new Date();
    if(this.authService.user==null){
      this.router.navigateByUrl("/");
      return;
    }
    this.get_reservations();
  }

  delete_reservation(id: number){
    if(confirm("Are you sure you want to delete this reservation")) {
      this.reservationService.deleteReservation(id).subscribe(res => {
        if (res.status == 200) {
          console.log(res.body);
          this.get_reservations();
        }
      });
    }
  }


  get_reservations(){
    this.reservationService.getReservations().subscribe(res => {
      if(res.status==200){
        this.reservation_list = res.body;
        this.reservation_list.forEach(res => {
          res.show.dateTime = new Date(Date.parse(res.show.dateTime.toString()));
          res.reservation.timestamp = new Date(Date.parse(res.reservation.timestamp.toString()));
        });
        this.reservation_list.sort(function(a,b){
          return a.show.dateTime.getTime() - b.show.dateTime.getTime();
        });
      }
    });
  }

  check_in(id:number){
    this.ticketService.checkIn(id).subscribe(res =>{
      if(res.status==200){
        this.get_reservations();
      }
    });
  }
}
