import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL: string = "http://wd.etsisi.upm.es:10000";
  private usersEndPoint: string = "/users"
  private loginEndpoint: string = "/login";
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    let params: HttpParams = new HttpParams({ fromString: `username=${username}&password=${password}` });
    return this.http.get(this.baseURL + this.usersEndPoint + this.loginEndpoint,
      { observe: 'response', params: params });
  }
}
