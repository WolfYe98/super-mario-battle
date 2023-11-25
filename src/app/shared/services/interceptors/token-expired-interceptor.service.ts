import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SessionStorageService } from '../sessionstorage/session-storage.service';
import { CustomToastService } from '../customtoast/custom-toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenExpiredInterceptorService implements HttpInterceptor {

  constructor(private sessionStorageService: SessionStorageService, private router: Router, private toast: CustomToastService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: val => this.updateToken(val),
        error: err => this.loginIfTokenExpired(err)
      })
    );
  }
  private updateToken(val: HttpEvent<any>) {
    if (val instanceof HttpResponse) {
      let token = (val as HttpResponse<any>).headers.get('Authorization');
      if (token) {
        this.sessionStorageService.setAuthTokenToSession(token);
      }
    }
  }
  private loginIfTokenExpired(err: HttpErrorResponse): void {
    let token = this.sessionStorageService.getToken();
    if (token && err.status == 401) {
      this.sessionStorageService.deleteUserFromSession();
      this.router.navigate(['/login']);
      this.toast.showErrorToast({ title: 'Token expired', message: 'The user token has expired.' });
    }
  }
}
