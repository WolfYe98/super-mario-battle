import { Component } from '@angular/core';
import { PreferenceService } from '../shared/services/preference/preference.service';
import { Subscription } from 'rxjs';
import { InputNumberModelBuilder, InputNumberModel, InputModel } from '../shared/models/InputModel';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';
import PREFERENCES, { PreferenceType } from '../shared/models/preferences';
import { ComponentWithInputModel } from '../shared/componentCommon/componentWithInputModel';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class PreferencesComponent extends ComponentWithInputModel {
  title: string = "Preferences";
  bombInput: InputNumberModel;
  timeInput: InputNumberModel;
  private preferenceSubscription: Subscription;
  private defaultInputClass = "preference-number-input";
  private errClass = this.defaultInputClass + " border-red";

  constructor(private preferenceService: PreferenceService, private toast: CustomToastService) {
    super();
    this.preferenceSubscription = this.preferenceService
      .preferenceSubject$.subscribe((obj) => {
        this.changePreferenceValue(obj);
      });
    this.timeInput = <InputNumberModel>(new InputNumberModelBuilder()
      .setMax(3599)
      .setMin(60)
      .setValue(60)
      .setClass(this.defaultInputClass)
      .build());
    this.bombInput = <InputNumberModel>(new InputNumberModelBuilder()
      .setMax(10)
      .setMin(3)
      .setValue(3)
      .setClass(this.defaultInputClass)
      .build());
    this.initializeValues();
  }

  initializeValues(): void {
    let bombNumber = this.preferenceService.getIntegerItem(PREFERENCES.bombNumber);
    let timeNumber = this.preferenceService.getIntegerItem(PREFERENCES.timeNumber);
    this.bombInput.value = bombNumber ?? this.bombInput.value;
    this.timeInput.value = timeNumber ?? this.timeInput.value;
    this.saveAllPreferences();
  }
  changePreferenceValue(obj: PreferenceType): void {
    if (obj.key == PREFERENCES.bombNumber) {
      this.bombInput.value = obj.value ?? this.bombInput.value;
    } else {
      this.timeInput.value = obj.value ?? this.timeInput.value;
    }
  }
  ngOnDestroy(): void {
    this.preferenceSubscription.unsubscribe();
  }
  savePreferences(): void {
    if (this.checkInputs()) {
      this.saveAllPreferences();
      this.toast.showSuccessToast({ title: 'Success', message: 'Preferences stored' });
    } else {
      this.toast.showErrorToast({ title: 'Error', message: 'Please, check the preferences values' })
    }
  }
  private saveAllPreferences(): void {
    this.preferenceService.setIntegerItem({ key: PREFERENCES.bombNumber, value: this.bombInput.value });
    this.preferenceService.setIntegerItem({ key: PREFERENCES.timeNumber, value: this.timeInput.value });
  }
  override checkInputs(): boolean {
    let bombOk: boolean = this.checkInput(this.bombInput);
    let timeOk: boolean = this.checkInput(this.timeInput);
    return bombOk && timeOk;
  }
  checkInput(input: InputNumberModel): boolean {
    input.checkValueRequired();
    input.checkValueInRange();
    return !input.invalid;
  }
  resetPreferences(): void {
    this.bombInput.value = this.bombInput.min;
    this.timeInput.value = this.timeInput.min;
    this.clearAllErrors();
    this.saveAllPreferences();
    this.toast.showWarningToast({ title: 'Warning', message: 'Preferences reseted' });
  }
  private clearAllErrors(): void {
    this.clearError(this.bombInput);
    this.clearError(this.timeInput);
  }
}
