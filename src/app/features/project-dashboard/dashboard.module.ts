// src/app/features/project-dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { ProjectDashboardComponent } from './project-dashboard.component';
import { ProjectListComponent } from '../project-list/project-list.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { ChatComponent } from './chat/chat.component';
import {NodeDetailComponent} from "./node-detail/node-detail.component"; // Import ChatComponent here
@NgModule({
  declarations: [
    ProjectDashboardComponent,
    ProjectListComponent,
    GraphViewComponent,
    ChatComponent, // Declare ChatComponent here,
    NodeDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // Import FormsModule here
  ],
  exports: [
    ProjectDashboardComponent,
    ProjectListComponent
  ]
})
export class DashboardModule { }
