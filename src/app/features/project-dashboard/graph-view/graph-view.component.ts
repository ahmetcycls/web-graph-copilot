import {Component, Input, OnInit, ElementRef, ViewChild, ViewContainerRef, HostListener, Type} from '@angular/core';
import { Network, Node, Edge, DataSet } from 'vis-network/standalone';
import { GraphDataService } from '../../../core/services/graph-data.service';
import { NodeDetailService } from '../../../core/services/node-detail.service';
import { Socket } from 'ngx-socket-io';
import { takeUntil } from 'rxjs/operators';
import { Subject} from "rxjs";
import { OnDestroy } from '@angular/core';
import {options} from "./graph-config";
import {AddNodeComponent} from "./node-actions/add-node/add-node.component";
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css'] // Ensure the CSS file path is correct
})

export class GraphViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('graphContainer', { static: true }) graphContainer: ElementRef;
  @Input() projectNodeId: string;
  @ViewChild('dynamicInsertionPoint', { read: ViewContainerRef }) dynamicInsertionPoint: ViewContainerRef;


  contextMenuPosition = { x: 0, y: 0 };
  showContextMenu = false;
  selectedNodeId: string | null = null;

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

  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to signal that the component is being destroyed
    this.destroy$.complete(); // Complete the observable to clean it up
  }

  ngAfterViewInit(): void {
    this.initializeOrUpdateGraph(); // Initial setup of the graph
  }

  private initializeOrUpdateGraph(): void {
    const container = this.graphContainer.nativeElement;
    const data = { nodes: this.nodes, edges: this.edges };

    //TODO get the options from the db but have a default setting

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
    this.network.on("oncontext", (params) => {
      params.event.preventDefault(); // Prevent the default context menu
      const nodeId = this.network.getNodeAt(params.pointer.DOM);
      if (nodeId) {
        const {x, y} = params.pointer.DOM;
        this.contextMenuPosition = {x, y};
        this.selectedNodeId = nodeId.toString();
        this.showContextMenu = true; // Call your custom context menu handler
      }
    });

  }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showContextMenu) {
      // Logic to check if the click is outside the context menu
      // This might require accessing the contextMenuComponent's DOM element to check if the click is outside
      // For simplicity, toggle the visibility off for now
      this.showContextMenu = false;
    }
  }
  private fetchAndInitializeGraph(): void {
    this.graphDataService.getGraphData(this.projectNodeId).pipe(
      takeUntil(this.destroy$)).subscribe({

      next: (data) => {
        this.nodes.clear();
        this.edges.clear();
        this.nodes.add(data.nodes);
        this.edges.add(data.edges);
        console.log(data);
        this.initializeOrUpdateGraph(); // Re-initialize the graph with fetched data
      },
      error: (err) => {
        console.error('Failed to fetch graph data:', err);
      }
    });


  }
  onContextMenuActionSelect(event: {action: string, nodeId: string | null}) {
    console.log("Action selected:", event.action, "for nodeId:", event.nodeId);
    // Example: Dynamically loading AddNodeComponent
    if (event.action === 'addNode') {
      this.loadDynamicComponent(AddNodeComponent, event.nodeId);
    }
    // Add other actions as needed
  }
  private loadDynamicComponent(component: Type<any>, nodeId: string | null) {
    const componentRef = this.dynamicInsertionPoint.createComponent(component);
    if (componentRef.instance instanceof AddNodeComponent) {
      componentRef.instance.nodeId = nodeId;
      componentRef.instance.isVisible = true; // Make sure the component is visible
    }
    // Listen to component's events if needed, or perform additional setup
  }
}
