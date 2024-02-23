import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AppComponent } from './app.component';
import { DashboardModule } from './features/project-dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

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
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
