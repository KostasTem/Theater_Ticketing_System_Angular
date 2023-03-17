import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ReservationDetailComponent } from './components/reservation-detail/reservation-detail.component';
import { ShowComponent } from './components/show/show.component';
import { ShowDetailComponent } from './components/show-detail/show-detail.component';
import { AuditoriumComponent } from './components/auditorium/auditorium.component';
import { AuditoriumDetailComponent } from './components/auditorium-detail/auditorium-detail.component';
import { UserComponent } from './components/user/user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { RegisterComponent } from './components/register/register.component';
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {PerformanceDetailComponent} from "./components/performance-detail/performance-detail.component";


const routes: Routes = [
  {path:'reservations',component:ReservationComponent},
  {path:'reservations/new/:id',component:ReservationDetailComponent},
  {path:'shows',component:ShowComponent},
  {path:'shows/:id',component:ShowDetailComponent},
  {path:'auditoriums',component:AuditoriumComponent},
  {path:'auditoriums/:id',component:AuditoriumDetailComponent},
  {path:'users',component:UserComponent},
  {path:'users/:email',component:UserDetailComponent},
  {path:'register',component:RegisterComponent},
  {path:'shows/new',component:ShowDetailComponent},
  {path:'auditoriums/new',component:AuditoriumDetailComponent},
  {path:'login',component:LoginComponent},
  {path:'performance/new',component:PerformanceDetailComponent},
  {path:'performance/edit',component:PerformanceDetailComponent},
  {path:'user/edit',component:UserDetailComponent},
  {path:'',component:MainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
