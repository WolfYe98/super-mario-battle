import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PreferenceType } from '../../models/preferences';
@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private preferenceSubject: Subject<PreferenceType> = new Subject();
  preferenceSubject$: Observable<PreferenceType> = this.preferenceSubject.asObservable();
  constructor() { }
  getIntegerItem(key: string): number | null {
    let item: number = parseInt(localStorage.getItem(key) ?? '');
    if (!isNaN(item)) {
      return item;
    }
    return null;
  }
  setIntegerItem(obj: PreferenceType): void {
    localStorage.setItem(obj.key, obj.value == null ? "" : obj.value.toString());
    this.preferenceSubject.next(obj);
  }
}
