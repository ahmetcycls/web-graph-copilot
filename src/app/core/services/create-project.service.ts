import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateProjectService {

  constructor(private http: HttpClient) { }

  createProject(projectData: { user_id: string; name: string; description: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}app/v1/projects/create`, projectData);

  }
}
