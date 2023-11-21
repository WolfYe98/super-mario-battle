import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '../shared/services/record/record.service';
import { Record } from '../shared/models/record';
import { Subscription } from 'rxjs';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class RecordComponent implements OnInit, OnDestroy {
  records: Record[] = [];
  currentUserRecords: Record[] = [];
  recordSubscription: Subscription = new Subscription();
  private tableDivClasses: string = "col-sm-12 col-md-12 col-lg-6 col-6 d-flex justify-content-center";
  constructor(private recordService: RecordService, private toast: CustomToastService) {

  }
  ngOnDestroy(): void {
    this.recordSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.getRecordsOfAllUsers();
  }
  private getRecordsOfAllUsers(): void {
    this.recordSubscription = this.recordService
      .getRecords()
      .subscribe({
        next: (value: any) => {
          this.records = value;
        },
        error: err => this.onRetrieveError(err)
      });
  }
  private onRetrieveError(err: any): void {
    this.toast.showErrorToast({ title: 'Unknow Error', message: 'Some error has happend when retrieving the records' });
  }
  hasRecords(): boolean {
    return this.records.length > 0;
  }
  getTableClasses(): string {
    if (this.records.length > 0 && this.currentUserRecords.length > 0) {
      return this.tableDivClasses;
    }
    return this.tableDivClasses.replace("col-lg-6", 'col-lg-12');
  }
}
