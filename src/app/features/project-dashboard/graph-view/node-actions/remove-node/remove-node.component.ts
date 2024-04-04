import {Component, Input, OnInit} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-remove-node',
  templateUrl: './remove-node.component.html',
  styleUrls: ['./remove-node.component.css']
})
export class RemoveNodeComponent implements OnInit {
  userId: string; // Assuming user_id might be static or passed from parent
  @Input() projectNodeId: string | null = null; // ID of the current project
  @Input() nodeId: string | null = null; // ID of the parent node under which the nodes and its sub-nodes will be deleted
  @Input() parentNodeLabel: string | null = null; // Label of the parent node
  isVisible = true;
  @Input() actionType: string;
  constructor(private socket: Socket, private keycloakService: KeycloakService) { }

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then(profile => {
      this.userId = profile.id;
    }).catch(err => console.error('Error loading user profile:', err));
  }


  handleDeletion(): void {
    if (!this.nodeId) {
      console.log('Node ID is required');
      return;
    }

    const data = {
      user_id: this.userId,
      project_node_id: this.projectNodeId,
      node_id: this.nodeId
    };

    // Decide action based on actionType
    switch (this.actionType) {
      case 'deleteSubNodes':
        console.log('Deleting sub-nodes');
        // Check if project_node_id and node_id are the same, pop one out.
        this.socket.emit('delete_subnodes_and_their_relationships_socket', data);
        break;
      case 'deleteNodeAndSubNodes':
        console.log('Deleting node and sub-nodes');
        this.socket.emit('delete_node_and_subnodes_socket', data);
        break;
      default:
        console.error('Unknown action type');
    }

    this.isVisible = false; // Hide after action
  }

  cancel(): void {
    this.isVisible = false; // Hide component
  }
}
