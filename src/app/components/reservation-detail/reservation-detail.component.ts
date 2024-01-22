import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Show } from 'src/app/DataClasses/Show';
import { Ticket } from 'src/app/DataClasses/Ticket';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { TicketService } from 'src/app/services/ticket.service';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.css']
})
export class ReservationDetailComponent implements OnInit{

  ticket_list:Ticket[][];

  selected_tickets: string[] = [];

  show:Show;

  price:number = 0;

  emails:string[] = null;

  @ViewChild("myButton") button:ElementRef;
  modalRef;

  constructor(private authService:AuthService,private ticketService:TicketService,private reservationService:ReservationService,private router:Router,private route:ActivatedRoute,private modalService:NgbModal){}

  ngOnInit(): void {
    if(this.authService.user==null){
      this.router.navigateByUrl("/");
      return;
    }
    const id =+ this.route.snapshot.paramMap.get('id');
    if(!Number.isNaN(id)){
      this.ticketService.getTickets(id).subscribe(res =>
        {
          if(res.status==200){
            var a, b, a1, b1, rx=/(\d+)|(\D+)/g, rd=/\d+/;
            const temp = res.body.tickets;
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
            this.ticket_list = this.chunkArrayInGroups(temp,res.body.show.auditorium.seatsPerRow);
            this.show = res.body.show;
            this.show.dateTime = new Date(Date.parse(this.show.dateTime.toString()));
          }
        })
    }
  }

  select_seat(seat:string){
    if(this.selected_tickets.includes(seat)){
      this.selected_tickets.splice(this.selected_tickets.indexOf(seat),1);
      this.price -= this.show.performance.ticketPrice;
    }
    else{
      if(this.selected_tickets.length<10){
        this.selected_tickets.push(seat);
        this.price += this.show.performance.ticketPrice;
      }
      else{
        alert("You can't reserve more than 10 seats.");
      }
    }
    this.price = Math.round(this.price * 10) / 10;
  }

  open(content) {
    this.emails = Array(this.selected_tickets.length-1).fill('');
    this.modalRef = this.modalService.open(content, {modalDialogClass: 'dark-modal'});
    this.modalRef.result.then((result) => {

    }, (reason) => {
      const res = this.getDismissReason(reason);
      if(res != "ESC" && res != ("bd") && res != 'Cross'){
        this.make_reservation();
      }
      else{
        this.emails = null;
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'bd';
    } else {
      return  reason;
    }
  }

  chunkArrayInGroups(arr, size) {
    var myArray = [];
    for(var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i+size));
    }
    return myArray;
  }

  make_reservation(){
    if(this.emails==null && this.selected_tickets.length>1){
      this.button.nativeElement.click();
    }
    else {
      if(this.modalRef!=null) {
        this.modalRef.close();
      }
      if (this.selected_tickets.length < 1) {
        alert("You must select at least one ticket to make a reservation.")
        return;
      }
      this.reservationService.createReservation(this.show.id, this.selected_tickets,this.emails).subscribe(res => {
        if (res.status == 200) {
          this.router.navigateByUrl("/reservations");
        }
      });
    }
  }
  trackByIdx(index: number, obj: any): any {
    return index;
  }
}
