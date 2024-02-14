import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Import the DashboardModule
import { DashboardModule } from './project-dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
    // Remove the ProjectDashboardComponent, GraphViewComponent, and ChatComponent from declarations
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardModule // Correctly import the DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
