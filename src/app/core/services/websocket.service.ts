// src/app/core/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket;
  private messageSubject = new BehaviorSubject<any>(null);
  public messages$: Observable<any> = this.messageSubject.asObservable();

  constructor() {}

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageSubject.next(message);
    };

    this.socket.onclose = () => console.log("WebSocket connection closed");
    this.socket.onerror = (error) => console.log("WebSocket error:", error);
  }

  public sendMessage(message: any): void {
    this.socket.send(JSON.stringify(message));
  }
}
