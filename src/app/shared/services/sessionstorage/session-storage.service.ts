import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private sessionStorageSubject: Subject<any> = new Subject();
  private tokenSetSubject: Subject<boolean> = new Subject();
  sessionStorageSubject$: Observable<any> = this.sessionStorageSubject.asObservable();
  tokenSetSubject$: Observable<boolean> = this.tokenSetSubject.asObservable();
  constructor() { }
  private getSessionStorageItemValue(key: string): string | null {
    return sessionStorage.getItem(key);
  }
  private setSessionStorageItem(obj: { key: string, value: any }) {
    sessionStorage.setItem(obj.key, obj.value);
    this.sessionStorageSubject.next(obj.value);
  }
  private deleteSessionStorageItem(key: string): void {
    sessionStorage.removeItem(key);
    this.sessionStorageSubject.next(null);
  }
  setUsernameToSession(username: string) {
    this.setSessionStorageItem({ key: 'username', value: username });
  }
  setAuthTokenToSession(token: string) {
    this.setSessionStorageItem({ key: 'token', value: token });
    if (token) {
      this.tokenSetSubject.next(true);
    } else {
      this.tokenSetSubject.next(false);
    }
  }
  private deleteAuthTokenInSession() {
    this.deleteSessionStorageItem('token');
  }
  private deleteUserNameInSession() {
    this.deleteSessionStorageItem('username');
  }
  deleteUserFromSession() {
    this.deleteAuthTokenInSession();
    this.deleteUserNameInSession();
  }
  sessionHasAuthToken() {
    let token = this.getSessionStorageItemValue('token');
    return token ? true : false;
  }
  getToken(): string {
    return this.getSessionStorageItemValue('token') ?? "";
  }
  getUserName(): string {
    return this.getSessionStorageItemValue('username') ?? "";
  }
}
