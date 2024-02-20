import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() projectNodeId: string;
  @Input() chatMessages: any[]; // Assume a structure for your chat messages
  newMessage: string = ''; // Declare newMessage property

  constructor() { }

  ngOnInit(): void {
    // Initialize chat based on projectNodeId, if necessary
    // You might fetch initial chat messages here or listen for new messages
  }

  sendMessage(): void {
    // Logic to send a new message
    // This would likely involve emitting an event or calling a chat service that interacts with your backend
    console.log(this.newMessage); // For testing purposes
    this.newMessage = ''; // Clear the input field after sending the message
  }
}
