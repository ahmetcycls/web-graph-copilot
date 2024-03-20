import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects = [];

  constructor(private projectService: ProjectService, private router: Router, private keycloakService: KeycloakService) { }

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then(profile => {
      console.log(profile)
      this.projectService.getProjects(profile.id).subscribe({
        next: (data) => {
          this.projects = data.projects;
        },
        error: (err) => console.error(err),
      });
    }).catch(err => console.error('Error loading user profile:', err));
  }

  onCreateNewProject(): void {
    // Or open a modal dialog for creating a new project
    this.router.navigate(['/projects/create']);

  }

  onSelectProject(projectNodeId: string): void {
    this.router.navigate(['/projects', projectNodeId]);
  }
}
