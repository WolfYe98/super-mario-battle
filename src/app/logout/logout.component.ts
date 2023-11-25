import { Component } from '@angular/core';
import { SessionStorageService } from '../shared/services/sessionstorage/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '',
  styles: []
})
export class LogoutComponent {
  constructor(private sessionStorageService: SessionStorageService, private router: Router) {
    this.sessionStorageService.deleteUserFromSession();
    this.router.navigate(['/login']);
  }
}
