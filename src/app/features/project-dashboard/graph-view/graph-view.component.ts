import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Network, Node, Edge, DataSet } from 'vis-network/standalone';
import { GraphDataService } from '../../../core/services/graph-data.service';
import { NodeDetailService } from '../../../core/services/node-detail.service';
import { Socket } from 'ngx-socket-io';

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

  constructor(private graphDataService: GraphDataService,
              private nodeDetailService: NodeDetailService, private socket: Socket
  ) {}

  ngOnInit(): void {
    this.fetchAndInitializeGraph();
    this.socket.on('graph_update', (data) => {
      this.fetchAndInitializeGraph();

    });
  }

  ngAfterViewInit(): void {
    this.initializeOrUpdateGraph(); // Initial setup of the graph
  }

  private initializeOrUpdateGraph(): void {
    const container = this.graphContainer.nativeElement;
    const data = { nodes: this.nodes, edges: this.edges };

    //TODO get the options from the db but have a default setting
    const options = {
      // configure: {
      //   enabled: true
      // },
      layout: {
        hierarchical: {
          // randomSeed: 100,
          enabled: true,
          direction: 'UD', // 'UD' for Up-Down, 'LR' for Left-Right
          sortMethod: 'directed', // 'directed' for Directed, 'hubsize' for Hub size
          levelSeparation: 500,
          nodeSpacing: 300,
          shakeTowards: 'roots',
          parentCentralization: true
        },
      },
      manipulation: {
        addNode: true
      },

      interaction: {
        hover: true,
        dragNodes: true,
        dragView: true,
        zoomView: true,
        multiselect: true,
        // navigationButtons: true,
      },
      physics: {
        enabled: false,
      },
      edges: {
        arrows:{
          to: true
        },
        color:{
          color: '#000000',
          highlight: '#ffffff',
          hover: '#ffffff',
          inherit: 'from',
          opacity: 1.0
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5
        },
      },
      nodes: {
        shape: 'box',
        widthConstraint: {
          minimum: 200,
          maximum: 300,
        },
        heightConstraint: {
          minimum: 100,
          maximum: 150,
        },
        font: {
          size: 25,
          face: 'Arial',
          color: '#000000',
        },
        color: {
          border: '#000000', // Optional: Change border color to white for better contrast
          background: '#ec2c2c', // Optional: Adjust node background for better visibility on black
        }
      },
    };

    if (!this.network) {
      // Initialize the network for the first time
      this.network = new Network(container, data, options);
    } else {
      // Update the network with new data
      this.network.setData(data);
    }

    // Single selection
    this.network.on("click", params => {
      if (params.nodes.length > 0 && params.nodes.length < 2) {
        const targetNodeId = params.nodes[0]; // Get the ID of the clicked node
        const nodeData = this.nodes.get(targetNodeId); // Retrieve node data
        this.nodeDetailService.updateNodeDetail(nodeData); // Update the node detail using the service
      }
    });
    this.network.on("doubleClick", params => {
      //TODO on double click
    });


  }

  private fetchAndInitializeGraph(): void {
    this.graphDataService.getGraphData(this.projectNodeId).subscribe({
      next: (data) => {
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(data.nodes);
        this.edges.add(data.edges);
        this.initializeOrUpdateGraph(); // Re-initialize the graph with fetched data
      },
      error: (err) => {
        console.error('Failed to fetch graph data:', err);
      }
    });
  }
}
