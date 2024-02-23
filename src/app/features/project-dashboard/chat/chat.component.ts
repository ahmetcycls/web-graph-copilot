import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { Socket } from 'ngx-socket-io';

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
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<HTMLDivElement>;

  constructor(private socket: Socket) { }

  ngOnInit(): void {
    this.socket.on('ai_copilot_response', (data) => {
      this.chatMessages = data.response;
      this.isLoading = false;

    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      // Copy the newMessage value before clearing it
      const messageContent = this.newMessage.trim();

      // Clear the input field immediately after hitting enter
      this.newMessage = '';
      this.isLoading = true; // Show loading indicator

      // Push the user's message to chatMessages for immediate display
      this.chatMessages.push({ role: 'user', content: messageContent });
      // Prepare payload without the last input (user's message)
      const payload = {
          input: messageContent,
          user_id: "50",
          project_node_id: this.projectNodeId,
          history: this.chatMessages.slice(0,- 1)
      };
      console.log(payload);
      this.socket.emit('AI_copilot_message', payload);
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
