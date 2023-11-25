import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Result } from '../../models/record';
import { SessionStorageService } from '../sessionstorage/session-storage.service';
@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private baseURL: string = "http://fenw.etsisi.upm.es:10000";
  private recordEndPoint: string = "/records";
  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) { }
  getRecords() {
    return this.http.get(this.baseURL + this.recordEndPoint);
  }
  saveRecord(record: Result) {
    let header = new HttpHeaders('');
    header.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${this.baseURL}${this.recordEndPoint}`, record, {
      headers: header
    });
  }
  getRecordsOfCurrentUser() {
    return this.http.get(`${this.baseURL}${this.recordEndPoint}/${this.sessionStorageService.getUserName()}`);
  }
  deleteRecords() {
    return this.http.delete(this.baseURL + this.recordEndPoint);
  }
}
