import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';

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

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      // Copy the newMessage value before clearing it
      const messageContent = this.newMessage.trim();

      // Clear the input field immediately after hitting enter
      this.newMessage = '';

      // Push the user's message to chatMessages for immediate display
      this.chatMessages.push({ role: 'user', content: messageContent });

      this.isLoading = true; // Show loading indicator

      // Prepare payload without the last input (user's message)
      const payload = {
        input: messageContent,
        user_id: "50",
        project_node_id: this.projectNodeId,
        // Send the history except the last message
        history: this.chatMessages.slice(0, this.chatMessages.length - 1)
      };

      this.chatService.sendMessage(payload).subscribe(response => {
        // Update the chat history with the response from the backend
        this.chatMessages = response.response.history;
        this.isLoading = false; // Hide loading indicator
        this.newMessage = ''; // Clear the message input field
      }, error => {
        console.error("Failed to send message:", error);
        this.isLoading = false;
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
