import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private baseURL: string = "http://fenw.etsisi.upm.es:10000";
  private recordEndPoint: string = "/records";
  constructor(private http: HttpClient) { }
  getRecords() {
    return this.http.get(this.baseURL + this.recordEndPoint);
  }
}
