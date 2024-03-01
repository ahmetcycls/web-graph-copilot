// src/app/features/project-dashboard/graph-view/graph-context-menu/graph-context-menu.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-graph-context-menu',
  templateUrl: './graph-context-menu.component.html',
  styleUrls: ['./graph-context-menu.component.css']
})

export class GraphContextMenuComponent {
  @Input() position = { x: 0, y: 0 };
  @Input() isVisible = false;
  @Input() nodeId: string | null = null;
  @Output() actionSelected = new EventEmitter<{ action: string, nodeId: string | null }>();

  selectAction(action: string): void {
    console.log("Action selected in GraphContextMenuComponent")
    console.log(action)
    this.actionSelected.emit({ action, nodeId: this.nodeId });
    this.isVisible = false; // Optionally hide the context menu after selection
  }
}
