import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // Import the LoginComponent
import { ProjectListComponent } from './features/project-list/project-list.component';
import { ProjectDashboardComponent } from './features/project-dashboard/project-dashboard.component';
import { CreateProjectComponent } from "./features/project-list/create-project/create-project.component";
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // Add the login route
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] }, // Protect the project list route
  {
    path: 'projects/create',
    component: CreateProjectComponent,
    canActivate: [AuthGuard] // Protect the create project route
  },
  {
    path: 'projects/:projectNodeId',
    component: ProjectDashboardComponent,
    canActivate: [AuthGuard] // Protect the project dashboard route
  },
  // The ProjectDashboardComponent will include both the GraphViewComponent and ChatComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
