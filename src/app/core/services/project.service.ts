// src/app/core/services/project.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}app/v1/projects/`;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    console.log(this.apiUrl)
    return this.http.get<{projects: any[]}>(this.apiUrl);
  }
}
