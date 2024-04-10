import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DynamicHostDirective} from "../../core/directives/dynamic-host.directives";
@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})


export class ProjectDashboardComponent implements OnInit {
  @ViewChild(DynamicHostDirective, { static: true }) dynamicHost!: DynamicHostDirective;
  @Input() projectNodeId = '';

  ngOnInit(): void {

  }
}
