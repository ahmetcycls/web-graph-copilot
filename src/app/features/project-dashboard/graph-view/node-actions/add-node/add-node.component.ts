import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css'],
})
export class AddNodeComponent implements OnInit {
  userId: string; // Assuming user_id might be static or passed from parent
  //TODO: Add the correct type for projectNodeId
  @Input() projectNodeId: string | null = null; // ID of the current project
  @Input() nodeId: string | null = null; // ID of the parent node under which the new node will be added
  @Input() parentNodeLabel: string | null = null; // Label of the parent node under which the new node will be added
  @Output() onAddNode = new EventEmitter<any>();
  isVisible = true;
  nodeName = '';
  nodeDescription = '';
  assignedTo = '';
  status = '';
  skills: string[] = [];
  skillInput = ''; // Temporary input for adding skills

  constructor(private socket: Socket, private keycloakService: KeycloakService) {
  }
  ngOnInit(): void {

    this.keycloakService.loadUserProfile().then(profile => {
      this.userId = profile.id;
    }).catch(err => console.error('Error loading user profile:', err));
  }


  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  addNode(): void {
    if (this.nodeName.trim() && this.nodeDescription.trim()) {
      const skillsArray = this.skillInput.split(',').map(skill => skill.trim());

      const newNode = {
        user_id: this.userId,
        project_node_id: this.projectNodeId,
        parent_node_id: this.nodeId,
        task_details: [{
          label: this.nodeName.trim(),
          title: this.nodeName.trim(),
          description: this.nodeDescription.trim(),
          assigned_to: this.assignedTo.trim(),
          status: this.status.trim(),
          skills: skillsArray // Use the processed array here
        }]
      };

      this.socket.emit('create_task_socket', newNode);

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
