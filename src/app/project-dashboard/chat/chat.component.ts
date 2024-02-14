import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core'; // Import necessary modules
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Output() sendMessage = new EventEmitter<string>(); // Change the type 'string' if you're emitting a different data type

  onMessageSend(message: string) { // Example function where the message is finalized
    this.sendMessage.emit(message);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
