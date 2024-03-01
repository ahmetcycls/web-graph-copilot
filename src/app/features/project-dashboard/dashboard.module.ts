// src/app/features/project-dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { ProjectDashboardComponent } from './project-dashboard.component';
import { ProjectListComponent } from '../project-list/project-list.component';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { ChatComponent } from './chat/chat.component';
import {NodeDetailComponent} from "./node-detail/node-detail.component";
import {CreateProjectComponent} from "../project-list/create-project/create-project.component";
import {GraphContextMenuComponent} from "./graph-view/graph-context-menu/graph-context-menu.component";
import { NodeActionsComponent } from './graph-view/node-actions/node-actions.component';
import { AddNodeComponent } from './graph-view/node-actions/add-node/add-node.component';
import { RemoveNodeComponent } from './graph-view/node-actions/remove-node/remove-node.component';
import { UpdateNodeComponent } from './graph-view/node-actions/update-node/update-node.component';
import {DynamicHostDirective} from "../../core/directives/dynamic-host.directives";

@NgModule({
  declarations: [
    ProjectDashboardComponent,
    ProjectListComponent,
    GraphViewComponent,
    ChatComponent, // Declare ChatComponent here,
    NodeDetailComponent,
    CreateProjectComponent,
    GraphContextMenuComponent,
    NodeActionsComponent,
    DynamicHostDirective,
    AddNodeComponent,
    RemoveNodeComponent,
    UpdateNodeComponent,


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
