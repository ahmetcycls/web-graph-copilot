import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { DashboardModule } from './features/project-dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppKeycloakService } from './core/services/keycloak.service';
import { LoginComponent } from './login/login.component';
import {AuthInterceptor} from "./auth.interceptor";

const config: SocketIoConfig = { url: 'http://127.0.0.1:8000/', options: {} };

export function initializeKeycloak(appKeycloakService: AppKeycloakService) {
  return (): Promise<void> => appKeycloakService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // Other component declarations
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DashboardModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    KeycloakAngularModule, // Import the KeycloakAngularModule here
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [AppKeycloakService], // Ensure AppKeycloakService is a dependency
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Important for adding multiple interceptors
    },

    AppKeycloakService // Provide your AppKeycloakService if not already provided
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
