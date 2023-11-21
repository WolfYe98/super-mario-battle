import { Component, OnDestroy } from '@angular/core';
import { InputTextModel, InputTextModelBuilder } from '../shared/models/InputModel';
import { UserService } from '../shared/services/user/user.service';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentWithInputModel } from '../shared/componentCommon/componentWithInputModel';
import { SessionStorageService } from '../shared/services/sessionstorage/session-storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class LoginComponent extends ComponentWithInputModel implements OnDestroy {
  userNameInput: InputTextModel = new InputTextModel();
  passwordInput: InputTextModel = new InputTextModel();
  formControlClass: string = "form-control";
  inputErrorClass: string = this.formControlClass + " border-red";
  userSubscription: Subscription = new Subscription();
  constructor(private userService: UserService, private sessionStorageService: SessionStorageService,
    private toast: CustomToastService, private router: Router) {
    super();
    this.initializeLoginInputs();
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  private initializeLoginInputs(): void {
    this.passwordInput = <InputTextModel>(new InputTextModelBuilder()
      .setClass(this.formControlClass)
      .build()
    );
    this.userNameInput = <InputTextModel>(new InputTextModelBuilder()
      .setClass(this.formControlClass)
      .build()
    );
  }
  login(): void {
    if (this.checkInputs()) {
      this.userSubscription = this.userService
        .login(this.userNameInput.value, this.passwordInput.value)
        .subscribe({
          next: (response) => {
            let authToken: string = response.headers.get('Authorization')!;
            this.sessionStorageService.setAuthTokenToSession(authToken);
            this.router.navigate(['/start']);
          },
          error: err => this.treatError(err)
        });
    }
  }
  private checkInputs(): boolean {
    this.userNameInput.checkValueRequired();
    this.passwordInput.checkValueRequired();
    return !this.userNameInput.invalid && !this.passwordInput.invalid;
  }
  private treatError(err: HttpErrorResponse): void {
    switch (err.status) {
      case 401:
        this.errorMsg = 'User or password not exists';
        break;
      default:
        console.error(err)
        this.toast.showErrorToast({ title: 'Login Error', message: 'Some error occurs during the login process' });
        break;
    }
  }
}
