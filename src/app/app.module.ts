import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { FormsModule } from '@angular/forms';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ShowComponent } from './components/show/show.component';
import { ShowDetailComponent } from './components/show-detail/show-detail.component';
import { AuditoriumComponent } from './components/auditorium/auditorium.component';
import { AuditoriumDetailComponent } from './components/auditorium-detail/auditorium-detail.component';
import { UserComponent } from './components/user/user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule
} from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule} from "@angular/material/core";
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from './components/register/register.component';
import { MyDateAdapter } from './MyDateAdapter';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, NgxMatDateFormats, NgxMatDateAdapter,NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import {MaterialModule} from "./MaterialModule";
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import {HttpErrorInterceptor} from "./HttpErrorInterceptor";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { PerformanceDetailComponent } from './components/performance-detail/performance-detail.component';


const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ReservationDetailComponent,
    ReservationComponent,
    ShowComponent,
    ShowDetailComponent,
    AuditoriumComponent,
    AuditoriumDetailComponent,
    UserComponent,
    UserDetailComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    PerformanceDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
     FormsModule,
    JwtModule.forRoot({
      config: {tokenGetter: () => {
        return localStorage.getItem('access_token');
      },
      allowedDomains: ['https://localhost:8443/']
      }
    }),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatButtonModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    MaterialModule,
    NgbCarouselModule
  ],
  providers: [{
    provide: NgxMatDateAdapter, useClass: MyDateAdapter
},
{
    provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS
},{
    provide:HTTP_INTERCEPTORS, useClass:HttpErrorInterceptor,multi:true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function tokenGetterFunc() {
  return localStorage.getItem('auth_token');
}
