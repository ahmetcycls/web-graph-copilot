// src/app/features/project-dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For routing within the dashboard feature
import { ProjectListComponent } from '../project-list/project-list.component';
import { ProjectDashboardComponent } from './project-dashboard.component';
import { GraphViewComponent } from "./graph-view/graph-view.component"; // Assuming these are standalone or properly declared
import { ChatComponent } from "./chat/chat.component"; // Assuming these are standalone or properly declared

@NgModule({
  declarations: [
    ProjectDashboardComponent,
    ProjectListComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    GraphViewComponent,
    ChatComponent,
    // RouterModule is here for any child routing
  ],
  exports: [
    ProjectDashboardComponent, // Exporting for use in AppRoutingModule or elsewhere
    ProjectListComponent, // If you need to use it outside this module
    // GraphViewComponent and ChatComponent could also be exported if needed elsewhere
  ]
})
export class DashboardModule { }
