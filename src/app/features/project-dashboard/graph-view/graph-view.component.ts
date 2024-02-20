import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Network, Node, Edge, DataSet } from 'vis-network/standalone';
import { GraphDataService } from '../../../core/services/graph-data.service';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'] // Ensure the CSS file path is correct
})
export class GraphViewComponent implements OnInit {
  @Input() projectNodeId: string;
  @ViewChild('graphContainer', { static: true }) graphContainer: ElementRef;

  nodes: DataSet<Node> = new DataSet([]);
  edges: DataSet<Edge> = new DataSet([]);
  network?: Network;

  constructor(private graphDataService: GraphDataService) {}

  ngOnInit(): void {
    this.graphDataService.getGraphData(this.projectNodeId).subscribe({
      next: (data) => {
        console.log(data)
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(data.nodes);
        this.edges.add(data.edges);
        this.initializeOrUpdateGraph(); // Update the graph with fetched data
      },
      error: (err) => {
        console.error('Failed to fetch graph data:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeOrUpdateGraph(); // Initial setup of the graph
  }

  private initializeOrUpdateGraph(): void {
    const container = this.graphContainer.nativeElement;
    const data = { nodes: this.nodes, edges: this.edges };
    const options = {
      layout: {
        hierarchical: {
          randomSeed: 3,
          enabled: true,
          direction: 'UD', // 'UD' for Up-Down, 'LR' for Left-Right
          sortMethod: 'hubsize', // 'directed' for Directed, 'hubsize' for Hub size
          levelSeparation: 400,
          nodeSpacing: 400,
        },
      },
      interaction: {
        hover: true,
        dragNodes: true,
        dragView: true,
        zoomView: true,
      },
      physics: {
        enabled: false, // Disabling for static graphs
      },
      nodes: {
        shape: 'box',
        widthConstraint: {
          minimum: 150,
          maximum: 200,
        },
        heightConstraint: {
          minimum: 100,
          maximum: 150,
        },
        font: {
          size: 12,
          face: 'Arial',
          color: '#000000',
        },
        // Customize additional node properties if needed
      },
      // Include additional options as needed
    };

    if (!this.network) {
      // Initialize the network for the first time
      this.network = new Network(container, data, options);
    } else {
      // Update the network with new data
      this.network.setData(data);
    }
  }
}
