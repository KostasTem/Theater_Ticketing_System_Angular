import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService} from "./services/auth.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor{

  constructor(private router:Router,private authService:AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      let errorMessage = "Couldn't Contact Server";
      console.log(error.message);
      if(this.authService.user!=null && this.authService.user.expiration.getTime()<new Date().getTime()){
        errorMessage = "Your session has expired";
        alert(errorMessage);
        this.router.navigateByUrl("login");
        throw new Error(errorMessage);
      }
      if(error.headers.get("error-message")!=null) {
        errorMessage = error.headers.get("error-message");
        alert(errorMessage);
        throw new Error(errorMessage);
      }
      alert(errorMessage);
      this.router.navigateByUrl("");
      throw new Error(errorMessage);
    }))
  }
}
