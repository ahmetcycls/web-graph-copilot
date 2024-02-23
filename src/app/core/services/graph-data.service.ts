// src/app/core/services/graph-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private apiUrl = `${environment.apiUrl}app/v1/projects/get_project_graph/`;

  constructor(private http: HttpClient) {}

  getGraphData(projectNodeId: string): Observable<any> {
    const payload = {
      project_node_id: projectNodeId,
      user_id: "50" // Hardcoded as per your requirement
    };
    return this.http.post<any>(this.apiUrl, payload);
  }
}
