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
        const rows = {};
        let rowSeats = [];
        const temp = res.body.tickets;
        let a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
        temp.sort(function(as, bs){
          a= String(as.seat).toLowerCase().match(rx);
          b= String(bs.seat).toLowerCase().match(rx);
          while(a.length && b.length){
            a1= a.shift();
            b1= b.shift();
            if(rd.test(a1) || rd.test(b1)){
              if(!rd.test(a1)) return 1;
              if(!rd.test(b1)) return -1;
              if(a1!= b1) return a1-b1;
            }
            else if(a1!= b1) return a1> b1? 1: -1;
          }
          return a.length- b.length;
        });
        const dict = this.groupIt(temp);
        let instruction = "";
        for (const [key, value] of Object.entries(dict)) {
          instruction += "Row " + key.toUpperCase() + " is located " + this.alphabetPosition(key) + " rows from the stage. Your seats in this row are: ";
          const tempSeats = dict[key].map(seat => seat.match(/\d+/g))
          instruction += tempSeats.join(", ");
          instruction += ".\n";
        }
        alert(instruction);
        this.get_reservations();
      }
    });
  }
  alphabetPosition(text) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var code = text.toUpperCase().charCodeAt(i)
      if (code > 64 && code < 91) result += (code - 64) + " ";
    }

    return result.slice(0, result.length - 1);
  }

  groupIt(array){
    let resultObj = {};

    for (let i =0; i < array.length; i++) {
      let currentWord = array[i].seat;
      let firstChar = currentWord[0].toLowerCase();
      let innerArr = [];
      if (resultObj[firstChar] === undefined) {
        innerArr.push(currentWord);
        resultObj[firstChar] = innerArr
      }else {
        resultObj[firstChar].push(currentWord)
      }
    }
    return resultObj
  }
}
