import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust as necessary

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}app/v1/ai_copilot/`; // API URL

  constructor(private http: HttpClient) { }

  sendMessage(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
