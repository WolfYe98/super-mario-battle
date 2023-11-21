import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private sessionStorageSubject: Subject<any> = new Subject();
  sessionStorageSubject$: Observable<any> = this.sessionStorageSubject.asObservable();
  constructor() { }
  private getSessionStorageItemValue(key: string): string | null {
    return sessionStorage.getItem(key);
  }
  private setSessionStorageItem(obj: { key: string, value: any }) {
    sessionStorage.setItem(obj.key, obj.value);
    this.sessionStorageSubject.next(obj.value);
  }
  setAuthTokenToSession(token: string | null) {
    this.setSessionStorageItem({ key: 'token', value: token });
  }
  sessionHasAuthToken() {
    let token = this.getSessionStorageItemValue('token');
    if (token) {
      return true;
    }
    return false;
  }
}
