import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
})
export class ChatComponent implements OnInit {
  @Input() projectNodeId: string;
  messages: Array<{user: string, message: string}> = [];

  constructor() {}

  ngOnInit(): void {
    // Initialize chat or load existing chat history based on projectNodeId
  }

  sendMessage(message: string): void {
    // Placeholder for sending a message. Implement interaction with your backend here.
    this.messages.push({ user: 'User', message: message });
    // Assume a response from the AI backend
    this.messages.push({ user: 'AI', message: 'Response from AI based on your message' });
  }
}
