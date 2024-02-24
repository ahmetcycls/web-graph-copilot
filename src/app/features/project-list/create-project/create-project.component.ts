import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { CreateProjectService } from '../../../core/services/create-project.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent {
  projectName = '';
  projectDescription = '';

  constructor(
    private createProjectService: CreateProjectService,
    private router: Router // Inject Router
  ) { }

  onSubmit(): void {
    const projectData = {
      user_id: "50", // Static user_id as per requirement
      name: this.projectName,
      description: this.projectDescription
    };
    this.createProjectService.createProject(projectData).subscribe({
      next: (response) => {
        console.log('Project created successfully', response);
        // Assuming the response structure matches your example
        if (response && response.data && response.data.length > 0 && response.data[0].length > 0) {
          const projectNodeId = response.data[0][0]; // Get the projectNodeId
          this.router.navigate(['/projects', projectNodeId]); // Navigate to the project dashboard
        }
      },
      error: (error) => console.error('Error creating project', error)
    });
  }
}
