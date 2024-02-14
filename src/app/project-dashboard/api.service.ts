import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Import for using Observables with your HTTP requests

interface Project {
  name: string;
  description: string;
  projectNodeId: string;
}

@Injectable({ providedIn: 'root' }) // Makes this service available globally
export class ApiService {
  constructor(private http: HttpClient) {}

  fetchProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('http://127.0.0.1:8000/app/v1/projects/');
  }

  fetchProjectGraph(projectNodeId: string): Observable<any> { // Placeholder - Adapt the returned data type later
    return this.http.get(`http://127.0.0.1:8000/app/v1/projects/${projectNodeId}`);
  }
}
