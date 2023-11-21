import { Component, ElementRef, Renderer2, ViewChild, OnInit } from '@angular/core';
import { NavigationEnd, ResolveEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SessionStorageService } from './shared/services/sessionstorage/session-storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  bombSrc: string = "../assets/imgs/ufo.png";
  marioSrc: string = "../assets/imgs/rightUp.png";
  logoUpmSrc: string = "../assets/imgs/logo-upm.png";
  showLogout: boolean = false;
  constructor(private sessionStorageService: SessionStorageService) {
    this.initializeLoginLogout();
  }
  private initializeLoginLogout() {
    this.showLogout = this.sessionStorageService.sessionHasAuthToken();
    this.sessionStorageService.sessionStorageSubject$
      .subscribe((val) => {
        this.showLogout = false;
        if (val) {
          this.showLogout = true;
        }
      })
  }
}
