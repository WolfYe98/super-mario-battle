import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../sessionstorage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private sessionStorageService: SessionStorageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.sessionStorageService.sessionHasAuthToken()) {
      let token: string = this.sessionStorageService.getToken();
      const modified = req.clone({ setHeaders: { 'Authorization': token } });
      return next.handle(modified);
    }
    return next.handle(req);
  }
}
