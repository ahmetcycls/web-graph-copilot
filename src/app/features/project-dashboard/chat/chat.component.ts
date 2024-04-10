import {Component, ElementRef, HostListener, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { KeycloakService } from "keycloak-angular";
import {ChatSettingsComponent} from "./chat-settings/chat-settings.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() projectNodeId: string;
  chatMessages: any[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  graph_translation_for_AI: any[] = [];
  isSettingsVisible = false;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef<HTMLDivElement>;
  @ViewChild('chatContainer') private chatContainer: ElementRef<HTMLDivElement>;

  private isResizing = false;
  private isDragging = false;
  private startY = 0;
  private startX = 0;
  private startHeight = 0;
  private startWidth = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private originalTop = 0;
  private originalLeft = 0;
  private resizeDirection: 'bottom-right' | 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left';

  private readonly MIN_WIDTH = 100; // Minimum width of chat container
  private readonly MIN_HEIGHT = 100; // Minimum height of chat container
  selectedAI: any[] = ['gpt-3.5', 'GPT-4-1104'];
  brainstorming_mode: boolean = false;
  constructor(private socket: Socket, private keycloakService: KeycloakService) { }
  @ViewChild('dynamicInsertionPoint', { read: ViewContainerRef }) dynamicInsertionPoint: ViewContainerRef;

  toggleSettings(){
    const componentRef = this.dynamicInsertionPoint.createComponent(ChatSettingsComponent);
    const instance: ChatSettingsComponent = componentRef.instance;
    instance.isVisible = true;
  }
  updateSettings(settings: { selectedModel: string; brainstormingMode: boolean }) {
    this.selectedAI = [settings.selectedModel]; // Update based on your logic, may need adjustments
    this.brainstorming_mode = settings.brainstormingMode;
  }
  ngOnInit(): void {
    this.socket.on('ai_copilot_response', (data) => {
      console.log(data);
      this.chatMessages = data.response;
      this.graph_translation_for_AI = data.response.graph_translation;
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
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dx = event.clientX - this.dragStartX;
      const dy = event.clientY - this.dragStartY;
      let newTop = this.originalTop + dy;
      let newLeft = this.originalLeft + dx;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Get the current dimensions of the chat container
      const chatRect = this.chatContainer.nativeElement.getBoundingClientRect();

      // Calculate the boundaries to keep the chat container within the viewport
      const leftBoundary = 0;
      const topBoundary = 0;
      const rightBoundary = viewportWidth - chatRect.width;
      const bottomBoundary = viewportHeight - chatRect.height;

      // Apply constraints
      if (newLeft < leftBoundary) newLeft = leftBoundary;
      if (newLeft > rightBoundary) newLeft = rightBoundary;
      if (newTop < topBoundary) newTop = topBoundary;
      if (newTop > bottomBoundary) newTop = bottomBoundary;

      // Set the new position
      this.chatContainer.nativeElement.style.left = `${newLeft}px`;
      this.chatContainer.nativeElement.style.top = `${newTop}px`;
    } else if (this.isResizing) {
      const chatRect = this.chatContainer.nativeElement.getBoundingClientRect();
      let newHeight, newWidth;

      switch (this.resizeDirection) {
        case 'bottom-right':
          newHeight = event.clientY - chatRect.top;
          newWidth = event.clientX - chatRect.left;
          if (newWidth > this.MIN_WIDTH && newHeight > this.MIN_HEIGHT) {
            this.chatContainer.nativeElement.style.width = `${newWidth}px`;
            this.chatContainer.nativeElement.style.height = `${newHeight}px`;
          }
          break;
        case 'top':
          newHeight = this.startHeight - (event.clientY - this.startY);
          if (newHeight > this.MIN_HEIGHT) {
            this.chatContainer.nativeElement.style.height = `${newHeight}px`;
            this.chatContainer.nativeElement.style.top = `${event.clientY}px`;
          }
          break;
        case 'left':
          newWidth = this.startWidth - (event.clientX - this.startX);
          if (newWidth > this.MIN_WIDTH) {
            this.chatContainer.nativeElement.style.width = `${newWidth}px`;
            this.chatContainer.nativeElement.style.left = `${event.clientX}px`;
          }
          break;
        // Add cases for other directions as needed
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
    this.isResizing = false;
  }



  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    const rect = this.chatContainer.nativeElement.getBoundingClientRect();
    this.originalTop = rect.top - window.scrollY;
    this.originalLeft = rect.left - window.scrollX;
    event.preventDefault();
  }

  startResize(event: MouseEvent, direction: 'bottom-right' | 'top' | 'left' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left') {
    this.isResizing = true;
    this.resizeDirection = direction;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.chatContainer.nativeElement.offsetWidth;
    this.startHeight = this.chatContainer.nativeElement.offsetHeight;
    event.preventDefault();
  }

}
