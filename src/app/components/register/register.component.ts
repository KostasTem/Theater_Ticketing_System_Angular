import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/DataClasses/AppUser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  @Input() user:AppUser = new AppUser(null,null,null);
  imageFile;
  confirm:string = "";
  click:boolean = false;
  re = /\S+@\S+\.\S+/;

  constructor(private authService:AuthService,private router:Router){}

  ngOnInit() {
    if(this.authService.user!=null){
      this.router.navigateByUrl("");
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
    this.user.image = readerEvent.target.result;
  }

  register(){
    this.click = true;
    if (this.user.email != null && this.user.password != null && this.user.firstName != null && this.user.lastName != null && this.user.age != null) {
    if(this.confirm==this.user.password) {
        this.authService.register(this.user).subscribe(res => {
          if (res.status == 200) {
            this.router.navigateByUrl("/");
          } else {
            alert(res.headers.get("Error-Message"));
          }
        });
      } else {
        alert("Passwords Don't Match");
      }
    }
    else {
      alert("You need to fill in all the required fields!");
    }
  }

}
