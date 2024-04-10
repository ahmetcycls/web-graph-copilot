import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.css']
})
export class ChatSettingsComponent {
  @Input() isVisible = false;
  @Output() settingsChanged = new EventEmitter<{ selectedModel: string; brainstormingMode: boolean }>();

  models: string[] = ['gpt-3.5', 'GPT-4-1104'];
  selectedModel: string = this.models[0];
  brainstormingMode: boolean = false;

  constructor() {}

  saveSettings() {
    this.settingsChanged.emit({
      selectedModel: this.selectedModel,
      brainstormingMode: this.brainstormingMode
    });
    this.isVisible = false;
  }
  cancel() {
    this.isVisible = false;
  }
}
