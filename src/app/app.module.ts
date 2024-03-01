import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { DashboardModule } from './features/project-dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const config: SocketIoConfig = { url: 'http://127.0.0.1:8000/', options: {} }; // Use your actual backend URL

@NgModule({
  declarations: [
    AppComponent
    // Other component declarations
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Add HttpClientModule here
    DashboardModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
