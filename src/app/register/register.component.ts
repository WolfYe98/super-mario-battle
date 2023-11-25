import { Component, OnDestroy } from '@angular/core';
import { ComponentWithInputModel } from '../shared/componentCommon/componentWithInputModel';
import { InputTextModel } from '../shared/models/InputModel';
import RegExpPatterns from '../shared/models/regExpPatterns';
import { Subscription } from 'rxjs';
import { CustomToastService } from '../shared/services/customtoast/custom-toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../shared/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  host: { class: 'full-screen-component flex-center-row' }
})
export class RegisterComponent extends ComponentWithInputModel implements OnDestroy {
  usernameInput: InputTextModel = new InputTextModel();
  emailInput: InputTextModel = new InputTextModel();
  passwdInput: InputTextModel = new InputTextModel();
  repeatPassWdInput: InputTextModel = new InputTextModel();
  defaultClass: string = "form-control";

  private usernameSubscription: Subscription = new Subscription();
  private registerSubscription: Subscription = new Subscription();
  constructor(private userService: UserService, private toast: CustomToastService) {
    super();
    this.initializeInputs();
  }
  ngOnDestroy(): void {
    this.usernameSubscription.unsubscribe();
    this.registerSubscription.unsubscribe();
  }
  private initializeInputs(): void {
    this.usernameInput = this.createInputTextModelWithDefaultClass(this.defaultClass);
    this.emailInput = this.createInputTextModelWithDefaultClass(this.defaultClass);
    this.passwdInput = this.createInputTextModelWithDefaultClass(this.defaultClass);
    this.repeatPassWdInput = this.createInputTextModelWithDefaultClass(this.defaultClass);
  }
  checkUsernameExists(): void {
    this.usernameSubscription.unsubscribe();
    if (this.usernameInput.value) {
      this.usernameSubscription = this.userService.findUserByUsername(this.usernameInput.value)
        .subscribe({
          next: () => this.usernameInput.addError(`${this.usernameInput.value} already exists!`),
          error: err => {
            if (err.status == 404) {
              this.usernameInput.clearError();
            }
          }
        })
    }
  }
  register(): void {
    this.errorMsg = "";
    if (this.checkInputs()) {
      this.registerSubscription = this.userService.createUser({
        username: this.usernameInput.value,
        email: this.emailInput.value,
        password: this.passwdInput.value
      }).subscribe({
        next: () => this.registerSuccess(),
        error: err => this.treatError(err)
      });
    }
  }
  private registerSuccess() {
    this.toast.showSuccessToast({ title: 'Register Success', message: 'New user has been added' });
    this.clearInputs();
  }
  public clearInputs(): void {
    this.usernameInput.resetInput();
    this.emailInput.resetInput();
    this.passwdInput.resetInput();
    this.repeatPassWdInput.resetInput();
  }
  private treatError(err: HttpErrorResponse) {
    console.error('Register: ', err);
    switch (err.status) {
      case 400:
        this.errorMsg = "The username or email or password field are wrong";
        break;
      case 409:
        this.errorMsg = "The username already exists";
        break;
      case 500:
        this.toast.showErrorToast({ title: 'Error', message: 'Some unknown error happens' });
        break;
    }
  }
  override checkInputs(): boolean {
    let userNameOk: boolean = this.checkUserNameOk();
    let emailOk: boolean = this.checkEmailOk();
    let passwdOk: boolean = this.checkPasswdOk();
    let repeatPassOk: boolean = this.checkRepeatPasswdOk();
    return userNameOk && emailOk && passwdOk && repeatPassOk;
  }
  private checkUserNameOk(): boolean {
    this.usernameInput.checkValueRequired();
    this.usernameInput.checkValueWithRegExp(RegExpPatterns.username, 'The user name should have between 3 and 8 characters');
    return !this.usernameInput.invalid;
  }
  private checkEmailOk(): boolean {
    this.emailInput.checkValueRequired();
    this.emailInput.checkValueWithRegExp(RegExpPatterns.email, 'The email format is incorrect');
    return !this.emailInput.invalid;
  }
  private checkPasswdOk(): boolean {
    this.passwdInput.checkValueRequired();
    this.passwdInput.checkValueWithRegExp(RegExpPatterns.passwd, 'The password should have at least 8 characters');
    return !this.passwdInput.invalid;
  }
  private checkRepeatPasswdOk(): boolean {
    this.repeatPassWdInput.checkValueRequired();
    this.repeatPassWdInput.checkValueIsEqualTo(this.passwdInput.value, 'The passwords is different');
    return !this.repeatPassWdInput.invalid;
  }
}
