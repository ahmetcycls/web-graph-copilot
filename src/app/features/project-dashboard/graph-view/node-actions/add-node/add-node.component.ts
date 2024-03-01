import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css'],
})
export class AddNodeComponent implements OnInit {
  @Input() userId: number = 50; // Assuming user_id might be static or passed from parent
  @Input() projectNodeId: string | null = null; // ID of the current project
  @Input() nodeId: string | null = null; // ID of the parent node under which the new node will be added

  @Output() onAddNode = new EventEmitter<any>();
  isVisible = true;
  nodeName = '';
  nodeDescription = '';
  assignedTo = '';
  status = '';
  skills: string[] = [];
  skillInput = ''; // Temporary input for adding skills

  constructor(private socket: Socket) {
  }
  ngOnInit(): void {}

  addSkill(): void {
    if (this.skillInput.trim()) {
      this.skills.push(this.skillInput.trim());
      this.skillInput = ''; // Reset skill input
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  addNode(): void {
    if (this.nodeName.trim() && this.nodeDescription.trim()) {
      const newNode = {
        user_id: this.userId,
        project_node_id: this.projectNodeId,
        parent_node_id: this.nodeId,
        task_details: [{
          title: this.nodeName.trim(),
          description: this.nodeDescription.trim(),
          assigned_to: this.assignedTo.trim(),
          status: this.status.trim(),
          skills: this.skills
        }]
      };
      this.onAddNode.emit(newNode);

      this.socket.emit('add_node', newNode);

      this.resetForm();
      this.isVisible = false;

    } else {
      console.log('Node name and description are required');
    }
  }

  cancel(): void {
    this.resetForm();
    this.isVisible = false;
  }

  private resetForm(): void {
    this.nodeName = '';
    this.nodeDescription = '';
    this.assignedTo = '';
    this.status = '';
    this.skills = [];
  }
}
