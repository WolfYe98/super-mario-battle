import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../../models/registerModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseURL: string = "http://fenw.etsisi.upm.es:10000";
  private usersEndPoint: string = "/users"
  private loginEndpoint: string = "/login";
  constructor(private http: HttpClient) { }
  login(username: string, password: string) {
    let params: HttpParams = new HttpParams({ fromString: `username=${username}&password=${password}` });
    return this.http.get(this.baseURL + this.usersEndPoint + this.loginEndpoint,
      { observe: 'response', params: params });
  }
  findUserByUsername(username: string) {
    return this.http.get(this.baseURL + this.usersEndPoint + `/${username}`);
  }
  createUser(register: Register) {
    return this.http.post(this.baseURL + this.usersEndPoint, register);
  }
}
