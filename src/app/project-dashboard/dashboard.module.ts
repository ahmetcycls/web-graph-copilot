import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    ProjectDashboardComponent
  ],
  imports: [
    CommonModule,
    GraphViewComponent,
    ChatComponent
  ],
  exports: [
    ProjectDashboardComponent
    // Export other components if they need to be used outside this module
  ]
})
export class DashboardModule { }
