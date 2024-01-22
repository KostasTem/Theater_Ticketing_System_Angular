import {
  AfterViewInit,
  Component,
  ElementRef,
  SecurityContext,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";
import {Show} from "../../DataClasses/Show";
import {Router} from "@angular/router";
import {ShowService} from "../../services/show.service";
import {ShowList} from "../../DataClasses/ShowList";
import {DomSanitizer} from "@angular/platform-browser";
import {MatButton} from "@angular/material/button";
import {NgbModal,ModalDismissReasons} from "@ng-bootstrap/ng-bootstrap";
import {TicketService} from "../../services/ticket.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements AfterViewInit{
  selectedDate:Date=null;
  selectedPer:number = null;
  selectedShow:Show = null;
  datesWithShows:string[] = [];
  uniquePerformances = [];
  randomPerformances = [];
  show_list:ShowList[];
  selectedShowTicketSum:number = null;
  selectedShowTicketsReserved:number = null;
  selectedShowTicketsCheckedIn:number = null;
  @ViewChild("myButton") button:ElementRef;
  modalRef;

  constructor(private router:Router,private showService:ShowService,private modalService:NgbModal,private ticketService:TicketService) {
  }

  ngAfterViewInit() {
    if(localStorage.getItem("tempShowID")!=null && localStorage.getItem("access_token")!=null){
      const showID = localStorage.getItem("tempShowID");
      localStorage.removeItem("tempShowID");
      this.router.navigateByUrl("/reservations/new/"+String(showID));
      return;
    }
    localStorage.removeItem("tempShowID");
    this.showService.getShows().subscribe(res => {
      if(res.status==200){
        this.show_list=res.body;
        this.show_list.forEach(showD =>
        {
          showD.date = new Date(Date.parse(showD.date.toString()))
          showD.date.setHours(0);
          this.datesWithShows.push(showD.date.toISOString());
          showD.shows.forEach(show =>{
            if(!this.uniquePerformances.find(per => show.performance.id == per.id)){
              this.uniquePerformances.push(show.performance);
            }
          });
        });
        const shuffled = this.uniquePerformances.sort(() => 0.5 - Math.random());
        this.randomPerformances = shuffled.slice(0, Math.min(shuffled.length,5));
      }
    });
  }



  select_date(){
    if(this.selectedPer==null || this.selectedShow!=null){
      const showDay = this.show_list.find(showD => showD.date.getTime() == this.selectedDate.getTime());
      if(showDay!=null){
        this.uniquePerformances = [];
        showDay.shows.forEach(show => this.uniquePerformances.push(show.performance));
      }
    }
    else{
      this.select_show()
    }
  }
  select_performance(event){
    this.selectedPer = Number(event.source.value);
    if(this.selectedDate==null || this.show_list.find(showD => showD.date.getTime()==this.selectedDate.getTime())==null || this.selectedShow!=null){
      this.datesWithShows = [];
      this.show_list.forEach(showDay =>{
        if(showDay.shows.find(show => show.performance.id==this.selectedPer)){
          this.datesWithShows.push(showDay.date.toISOString());
        }
      });
    }
    else{
      this.select_show()
    }
  }

  select_show(){
    const showDay = this.show_list.find(showD => new Date(Date.parse(showD.date.toString())).getTime() == this.selectedDate.getTime());
    if(showDay!=null) {
      this.selectedShow = showDay.shows.find(show => show.performance.id == this.selectedPer);
      this.selectedShow.dateTime = new Date(Date.parse(this.selectedShow.dateTime.toString()));
      this.ticketService.getTicketInfo(this.selectedShow.id).subscribe(res => {
        if(res.status==200){
          this.selectedShowTicketSum = res.body.ticketsSum;
          this.selectedShowTicketsReserved = res.body.ticketsReserved;
          this.selectedShowTicketsCheckedIn = res.body.ticketsCheckedIn;
        }
      });
      this.button.nativeElement.click();
    }
  }
  open(content) {
    this.modalRef = this.modalService.open(content, {modalDialogClass: 'dark-modal'});
    this.modalRef.result.then((result) => {
      this.clearSelection();
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  reservation_redirect(){
    this.modalRef.close();
    if(localStorage.getItem("access_token")==null){
      alert("You need to sign in before making a reservation");
      localStorage.setItem("tempShowID",String(this.selectedShow.id));
      this.router.navigateByUrl("login");
    }
    else{
      this.router.navigateByUrl("/reservations/new/"+this.selectedShow.id);
    }
  }

  clearSelection(){
    this.selectedShow=null;
    this.selectedDate=null;
    this.selectedPer=null;
    this.datesWithShows = [];
    this.uniquePerformances = [];
    this.show_list.forEach(showD=>{
      this.datesWithShows.push(showD.date.toISOString());
      showD.shows.forEach(show =>{
        if(!this.uniquePerformances.find(per => show.performance.id == per.id)){
          this.uniquePerformances.push(show.performance);
        }
      });
    });
  }

  dateClass:MatCalendarCellClassFunction<Date> = (cellDate,view ) => {
    const highlightDate = this.datesWithShows
      .map(strDate => new Date(strDate))
      .some(d => d.getDate() === cellDate.getDate() && d.getMonth() === cellDate.getMonth() && d.getFullYear() === cellDate.getFullYear());

    return highlightDate
      ? ["custom-date-class"]
      : undefined;
  };
}
