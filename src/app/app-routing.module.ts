// src/app/app-routing.module.ts or a feature-specific routing module

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './features/project-list/project-list.component';
import { ProjectDashboardComponent } from './features/project-dashboard/project-dashboard.component';
import {CreateProjectComponent} from "./features/project-list/create-project/create-project.component";

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/create', component: CreateProjectComponent },
  { path: 'projects/:projectNodeId', component: ProjectDashboardComponent },
  // The ProjectDashboardComponent will include both the GraphViewComponent and ChatComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
