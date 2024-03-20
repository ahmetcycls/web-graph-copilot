import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}app/v1/projects/`;

  constructor(private http: HttpClient) { }

  getProjects(userId: string): Observable<any> {
    // The URL remains the same as you are posting to the same endpoint
    const url = this.apiUrl;

    // Create a body object containing the userId
    // Ensure the property name matches what your backend expects, here it's `user_id`
    const body = { user_id: userId };

    // Use the post method of HttpClient, passing the body as the second argument
    return this.http.post<{projects: any[]}>(url, body);
  }
}
