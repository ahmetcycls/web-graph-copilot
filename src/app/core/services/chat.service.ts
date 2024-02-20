import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust as necessary

export interface ChatMessage {
  // Define the structure based on your backend response
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) { }

  getChatMessages(projectNodeId: string): Observable<ChatMessage[]> {
    // Implementation, adjust URL and return type as necessary
    return this.http.get<ChatMessage[]>(`${environment.apiUrl}/chat-messages/${projectNodeId}`);
  }
}
