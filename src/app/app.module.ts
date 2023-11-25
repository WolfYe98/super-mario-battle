import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayComponent } from './play/play.component';
import { RecordComponent } from './record/record.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AcceptCancelModalComponent } from './modalComponents/accept-cancel-modal/accept-cancel-modal.component';
import { TokenInterceptorService } from './shared/services/interceptors/token-interceptor.service';
import { TokenExpiredInterceptorService } from './shared/services/interceptors/token-expired-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    PreferencesComponent,
    PlayComponent,
    RecordComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    AcceptCancelModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      preventDuplicates: true,
      timeOut: 1500,
      toastClass: 'ngx-toastr toast-opacity '
    }),
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenExpiredInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
