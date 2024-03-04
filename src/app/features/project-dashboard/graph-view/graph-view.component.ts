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
import {RemoveNodeComponent} from "./node-actions/remove-node/remove-node.component";

interface DynamicComponentContext {
  nodeId: string | null;
  projectNodeId: string;
  nodeLabel: string;
  action?: string; // Optional, to be used as needed
}
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

    this.socket.on('added_node', (data) => {
      console.log('Node added:', data);
      this.addNodeToGraph(data); // Add the new node to the graph
    });
    //TODO realtime updating instead of fetching the whole graph
    this.socket.on('deleted_node', (data) => {
      console.log('Node deleted:', data);
      this.deleteNodeFromGraph(data); // Remove the deleted node from the graph
    });
  }

  deleteNodeFromGraph(responseData): void {
    const nodeId = responseData.data.nodeId;
    this.nodes.remove(nodeId);
    this.edges.remove(this.edges.getIds().filter(id => id === nodeId));
    this.network.setData({ nodes: this.nodes, edges: this.edges });
  }
  addNodeToGraph(responseData): void {

    const newNodeData = responseData.data;
    // Assuming newNodeData has all the necessary properties
    // You might need to adjust this based on your actual data structure
    this.nodes.add({
      id: newNodeData.nodeId,
      label: newNodeData.title || "No label",
      title: newNodeData.title || 'No title',
      group: newNodeData.group || 'task'
    });


    if (newNodeData.edge) {
      this.edges.add({
        from: newNodeData.edge.from,
        to: newNodeData.edge.to
      });
    }

    // Update the graph to reflect the new node and edge
    this.network.setData({ nodes: this.nodes, edges: this.edges });
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
    const nodeData = this.nodes.get(event.nodeId);
    const nodeLabel = nodeData ? nodeData.label : 'No Label';
    const context: DynamicComponentContext = {
      nodeId: event.nodeId,
      projectNodeId: this.projectNodeId,
      nodeLabel: nodeLabel,
      action: event.action // Include the action here
    };
    let component: Type<any>;
    switch(event.action) {
      case 'addNode':
        component = AddNodeComponent;
        break;
      case 'deleteNodeAndSubNodes':
      case 'deleteSubNodes':
        component = RemoveNodeComponent;
        break;
      default:
        console.error('Unknown action:', event.action);
        return;
    }

    this.loadDynamicComponent(component, context);
  }
  private loadDynamicComponent(component: Type<any>, context: DynamicComponentContext) {
    const componentRef = this.dynamicInsertionPoint.createComponent(component);
    const instance = componentRef.instance;

    instance.nodeId = context.nodeId;
    instance.isVisible = true; // Make sure the component is visible
    instance.projectNodeId = context.projectNodeId;
    instance.parentNodeLabel = context.nodeLabel;

    if (instance instanceof RemoveNodeComponent && context.action) {
      instance.actionType = context.action;
    }
    // Listen to component's events if needed, or perform additional setup
  }
}
