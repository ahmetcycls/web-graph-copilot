import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DynamicHostDirective} from "../../core/directives/dynamic-host.directives";
@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
})


export class ProjectDashboardComponent implements OnInit {
  @ViewChild(DynamicHostDirective, { static: true }) dynamicHost!: DynamicHostDirective;
  projectNodeId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectNodeId = params.get('projectNodeId');
    });
  }
}
