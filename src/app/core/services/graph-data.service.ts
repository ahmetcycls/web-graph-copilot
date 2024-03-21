import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KeycloakService } from 'keycloak-angular'; // Import KeycloakService

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private apiUrl = `${environment.apiUrl}app/v1/projects/get_project_graph/`;

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {} // Inject KeycloakService

  async getGraphData(projectNodeId: string): Promise<Observable<any>> {
    try {
      // Fetch the user's profile or the decoded token to get the user ID
      const userDetails = await this.keycloakService.loadUserProfile();
      // Alternatively, if you need the ID directly from the token
      // const tokenParsed = await this.keycloakService.getTokenParsed();
      // const userId = tokenParsed?.sub; // sub is usually the user ID

      const payload = {
        project_node_id: projectNodeId,
        user_id: userDetails.id // Use the dynamically obtained user ID
      };
      console.log('payload', payload);
      return this.http.post<any>(this.apiUrl, payload);
    } catch (error) {
      console.error('Error fetching user details from Keycloak', error);
      // Handle the error appropriately
      // This example returns an Observable that throws an error
      return new Observable(observer => observer.error(error));
    }
  }

  addNode(nodeDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/app/v1/tasks/create`, nodeDetails);
  }

}
