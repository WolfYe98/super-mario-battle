import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '../shared/services/record/record.service';
import { Record } from '../shared/models/record';
import { Subscription } from 'rxjs';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';
import { SessionStorageService } from '../shared/services/sessionstorage/session-storage.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
  host: { class: 'full-screen-component flex-center-column' }
})
export class RecordComponent implements OnInit, OnDestroy {
  records: Record[] = [];
  currentUserRecords: Record[] = [];
  hasUserToken: boolean;
  currentUserName: string = "";
  private recordSubscription: Subscription = new Subscription();
  private tokenSubscription: Subscription;
  private userRecordSubscription: Subscription = new Subscription();
  private deleteRecordSubscription: Subscription = new Subscription();
  private tableDivClasses: string = "col-sm-12 col-md-12 col-lg-6 d-flex justify-content-center";
  constructor(private recordService: RecordService, private toast: CustomToastService, private sessionStorageService: SessionStorageService) {
    this.hasUserToken = this.sessionStorageService.sessionHasAuthToken();
    this.tokenSubscription = this.sessionStorageService.tokenSetSubject$.subscribe(
      {
        next: hasToken => this.hasUserToken = hasToken
      }
    );
  }
  ngOnDestroy(): void {
    this.recordSubscription.unsubscribe();
    this.tokenSubscription.unsubscribe();
    this.userRecordSubscription.unsubscribe();
    this.deleteRecordSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getRecordsOfAllUsers();
    if (this.hasUserToken) {
      this.getRecordsOfCurrentUser();
    }
  }

  private getRecordsOfAllUsers(): void {
    this.recordSubscription = this.recordService
      .getRecords()
      .subscribe({
        next: (value: any) => this.records = value,
        error: err => this.onRetrieveError(err)
      });
  }
  private getRecordsOfCurrentUser(): void {
    this.currentUserName = this.sessionStorageService.getUserName();
    this.userRecordSubscription = this.recordService
      .getRecordsOfCurrentUser()
      .subscribe({
        next: (value: any) => { this.currentUserRecords = value; },
        error: err => this.onRetrieveError(err)
      })
  }
  private onRetrieveError(err: any): void {
    console.error('Records: ', err);
    switch (err.status) {
      case 404:
        this.toast.showWarningToast({ title: 'No records found', message: 'There is no stored record for the current user' });
        break;
      case 500:
        this.toast.showErrorToast({ title: 'Unknow Error', message: 'Some error has happend when retrieving the records' });
        break;
    }
  }
  hasRecords(): boolean {
    return this.records.length > 0 || this.currentUserRecords.length > 0;
  }
  getTableClasses(): string {
    if (this.records.length > 0 && this.currentUserRecords.length > 0) {
      return this.tableDivClasses;
    }
    return this.tableDivClasses.replace("col-lg-6", 'col-lg-12');
  }
  deleteRecords(): void {
    this.recordService.deleteRecords()
      .subscribe({
        next: () => {
          this.toast.showSuccessToast({ title: 'Records', message: 'Current user\'s records deleted' });
          this.currentUserRecords = [];
        },
        error: err => this.onRetrieveError(err)
      })
  }
}
