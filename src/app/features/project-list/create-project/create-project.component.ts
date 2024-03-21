import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { CreateProjectService } from '../../../core/services/create-project.service';
import { KeycloakService } from 'keycloak-angular';
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
    private router: Router,
    private keycloakService: KeycloakService


  ) { }

  async onSubmit(): Promise<void> {
    try {
      const userDetails = await this.keycloakService.loadUserProfile();
      // If you specifically need the user ID from the token
      // const keycloakTokenParsed = await this.keycloakService.getTokenParsed();
      // const userId = keycloakTokenParsed?.sub; // 'sub' is typically the user ID in Keycloak's JWT tokens.
      const projectData = {
        user_id: userDetails.id, // Dynamically set user_id from Keycloak user profile
        name: this.projectName,
        description: this.projectDescription
      };

      this.createProjectService.createProject(projectData).subscribe({
        next: (response) => {
          console.log('Project created successfully', response);
          // Navigate based on response logic here
          if (response && response.data && response.data.length > 0 && response.data[0].length > 0) {
            const projectNodeId = response.data[0][0]; // Get the projectNodeId
            this.router.navigate(['/projects', projectNodeId]); // Navigate to the project dashboard
          }
        },
        error: (error) => console.error('Error creating project', error)
      });
    } catch (error) {
      console.error('Error fetching user details from Keycloak', error);
    }
  }
}
