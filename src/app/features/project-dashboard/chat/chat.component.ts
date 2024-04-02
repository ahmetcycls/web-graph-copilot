import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() projectNodeId: string;
  chatMessages: any[] = [];
  newMessage: string = '';
  isLoading: boolean = false; // Flag for loading indicator
  graph_translation_for_AI: any[] = [];
  selectedAI: string = 'gpt-3.5';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<HTMLDivElement>;

  // ... (Other methods)


  constructor(private socket: Socket,private keycloakService: KeycloakService ) { }

  ngOnInit(): void {
    this.socket.on('ai_copilot_response', (data) => {
      this.chatMessages = data.response.chat;
      this.graph_translation_for_AI = data.response.graph_translation
      this.isLoading = false;

    });
  }


  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageContent = this.newMessage.trim();
      this.newMessage = '';
      this.isLoading = true;
      this.chatMessages.push({ role: 'user', content: messageContent });

      this.keycloakService.loadUserProfile().then(profile => {
        const payload = {
          input: messageContent,
          user_id: profile.id,
          project_node_id: this.projectNodeId,
          history: this.chatMessages.slice(0, -1),
          graph_information: this.graph_translation_for_AI
        };
        console.log(payload);
        this.socket.emit('AI_copilot_message', payload);
      }).catch(err => {
        console.error('Error loading user profile:', err);
        // Handle the error case, e.g., show an error message or use a default user_id
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
