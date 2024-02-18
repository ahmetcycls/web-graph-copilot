import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Network, Node, Edge, DataSet } from 'vis-network/standalone';

@Component({
  selector: 'app-graph-view',
  template: `<div #graphContainer style="width: 100%; height: 500px;"></div>`,
  standalone: true,
})
export class GraphViewComponent implements OnInit {
  @Input() projectNodeId: string;
  @ViewChild('graphContainer', { static: true }) graphContainer: ElementRef;

  // Initialize DataSet with an explicit type
  nodes: DataSet<Node>;
  edges: DataSet<Edge>;
  network: Network;

  constructor() {
    // Placeholder for nodes and edges initialization
    // Ideally, you fetch this data from your backend using projectNodeId
    this.nodes = new DataSet<Node>([
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
      // Add more nodes as needed
    ]);

    this.edges = new DataSet<Edge>([
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      // Add more edges as needed
    ]);
  }

  ngOnInit(): void {
    // Ensure the container is available
    if (this.graphContainer && this.graphContainer.nativeElement) {
      const container = this.graphContainer.nativeElement;

      const data = {
        nodes: this.nodes,
        edges: this.edges,
      };

      const options = {
        // Customize your network options
        layout: {
          hierarchical: false,
        },
        edges: {
          color: "#000000",
        },
      };

      // Initialize the network
      this.network = new Network(container, data, options);
    }
  }
}
