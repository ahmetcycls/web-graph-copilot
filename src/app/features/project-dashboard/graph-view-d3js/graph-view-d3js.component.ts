import {Component, ElementRef, HostListener, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {Subject} from "rxjs";
import {GraphDataService} from "../../../core/services/graph-data.service";
import {NodeDetailService} from "../../../core/services/node-detail.service";
import {Socket} from "ngx-socket-io";
import {takeUntil} from "rxjs/operators";
import {AddNodeComponent} from "../graph-view/node-actions/add-node/add-node.component";
import {RemoveNodeComponent} from "../graph-view/node-actions/remove-node/remove-node.component";
import {GraphDirective} from "./graph-directive.directive";

interface DynamicComponentContext {
  nodeId: string | null;
  projectNodeId: string;
  nodeLabel: string;
  action?: string; // Optional, to be used as needed
}
@Component({
  selector: 'app-graph-view-d3js',
  templateUrl: './graph-view-d3js.component.html',
  styleUrls: ['./graph-view-d3js.component.css']
})


export class GraphViewD3jsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild('graphContainer', { static: true }) graphContainer: ElementRef;

  @ViewChild('dynamicInsertionPoint', { read: ViewContainerRef }) dynamicInsertionPoint: ViewContainerRef;
  @ViewChild('graphDirectiveRef') graphDirective!: GraphDirective;


  saveSvg(): void {
    if (this.graphDirective) {
      this.graphDirective.saveSvg();
    } else {
      console.error('GraphDirective reference not found');
    }
  }
  @Input() projectNodeId: string;
  nodes: any[];
  edges: any[];

  contextMenuPosition = { x: 0, y: 0 };
  showContextMenu = false;
  selectedNodeId: string | null = null;

  //TODO Nodes And Edges should be replaced with the d3js graph

  // nodes: DataSet<Node> = new DataSet([]);
  // edges: DataSet<Edge> = new DataSet([]);
  // network?: Network;

  constructor(private graphDataService: GraphDataService,
              private nodeDetailService: NodeDetailService, private socket: Socket
  ) {}

  ngOnInit(): void {
    this.fetchAndInitializeGraph();
    this.socket.on('graph_update', (data) => {
      this.fetchAndInitializeGraph();
    });

    // this.socket.on('added_node', (data) => {
    //   console.log('Node added:', data);
    //   this.addNodeToGraph(data); // Add the new node to the graph
    // });
    // //TODO realtime updating instead of fetching the whole graph
    // this.socket.on('deleted_node', (data) => {
    //   console.log('Node deleted:', data);
    //   this.deleteNodeFromGraph(data); // Remove the deleted node from the graph
    // });
  }

  // deleteNodeFromGraph(responseData): void {
  //   const nodeId = responseData.data.nodeId;
  //   this.nodes.remove(nodeId);
  //   this.edges.remove(this.edges.getIds().filter(id => id === nodeId));
  //   this.network.setData({ nodes: this.nodes, edges: this.edges });
  // }
  // addNodeToGraph(responseData): void {
  //
  //   const newNodeData = responseData.data;
  //   // Assuming newNodeData has all the necessary properties
  //   // You might need to adjust this based on your actual data structure
  //   this.nodes.add({
  //     id: newNodeData.nodeId,
  //     label: newNodeData.title || "No label",
  //     title: newNodeData.title || 'No title',
  //     group: newNodeData.group || 'task'
  //   });
  //
  //
  //   if (newNodeData.edge) {
  //     this.edges.add({
  //       from: newNodeData.edge.from,
  //       to: newNodeData.edge.to
  //     });
  //   }
  //
  //   // Update the graph to reflect the new node and edge
  //   this.network.setData({ nodes: this.nodes, edges: this.edges });
  // }
  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to signal that the component is being destroyed
    this.destroy$.complete(); // Complete the observable to clean it up
  }

  // ngAfterViewInit(): void {
  //   this.initializeOrUpdateGraph(); // Initial setup of the graph
  // }

  // private fetchAndInitializeGraph(): void {
  //   // Hardcoded data
  //   const data = {
  //     "nodes": [
  //       {
  //         "id": "FNS2HdRcVW",
  //         "label": "5000 potatoes",
  //         "title": "project to ship 5000 potatoes",
  //         "group": "project"
  //       },
  //       {
  //         "id": "7bjFkH7UQ2",
  //         "label": "UX arastirmasi",
  //         "title": "blablabla",
  //         "group": "task",
  //         "status": "",
  //         "assigned_to": "User1"
  //       },
  //       {
  //         "id": "6bzjqcosLd",
  //         "label": "Node name",
  //         "title": "Description",
  //         "group": "task",
  //         "status": "Not Started",
  //         "assigned_to": "assigned_to"
  //       }
  //     ],
  //     "edges": [
  //       {
  //         "from": "FNS2HdRcVW",
  //         "to": "7bjFkH7UQ2"
  //       },
  //       {
  //         "from": "FNS2HdRcVW",
  //         "to": "6bzjqcosLd"
  //       }],
  //
  //     "projectNodeId": "FNS2HdRcVW"
  //   };
  //
  //   // Directly use the hardcoded data instead of fetching it
  //   this.nodes = data.nodes;
  //   this.edges = data.edges;
  //   this.projectNodeId = data.projectNodeId;
  //   // If you have a function to initialize or update your graph based on this data, call it here
  //   // e.g., this.initializeOrUpdateGraph();
  // }
  private fetchAndInitializeGraph(): void {
    // this.graphDataService.getGraphData("FNS2HdRcVW").pipe(
    this.graphDataService.getGraphData("EgCZcapkpa").pipe(
      takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        // Assuming data.nodes and data.edges are already in a format D3 can use
        this.nodes = data.nodes;
        this.edges = data.edges;
        this.projectNodeId = data.projectNodeId;
        // No need to call initializeOrUpdateGraph() as the directive will handle rendering
      },
      error: (err) => console.error('Failed to fetch graph data:', err)
    });
  }
  // private initializeOrUpdateGraph(): void {
  //   const container = this.graphContainer.nativeElement;
  //   const data = { nodes: this.nodes, edges: this.edges };
  //
  //   //TODO get the options from the db but have a default setting
  //
  //   if (!this.network) {
  //     // Initialize the network for the first time
  //     this.network = new Network(container, data, options);
  //   } else {
  //     // Update the network with new data
  //     this.network.setData(data);
  //   }
  //
  //   // Single selection
  //   this.network.on("click", params => {
  //     if (params.nodes.length > 0 && params.nodes.length < 2) {
  //       const targetNodeId = params.nodes[0]; // Get the ID of the clicked node
  //       const nodeData = this.nodes.get(targetNodeId); // Retrieve node data
  //       this.nodeDetailService.updateNodeDetail(nodeData); // Update the node detail using the service
  //     }
  //   });
  //   this.network.on("doubleClick", params => {
  //     //TODO on double click
  //   });
  //   this.network.on("oncontext", (params) => {
  //     params.event.preventDefault(); // Prevent the default context menu
  //     const nodeId = this.network.getNodeAt(params.pointer.DOM);
  //     if (nodeId) {
  //       const {x, y} = params.pointer.DOM;
  //       this.contextMenuPosition = {x, y};
  //       this.selectedNodeId = nodeId.toString();
  //       this.showContextMenu = true; // Call your custom context menu handler
  //     }
  //   });
  //
  // }



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showContextMenu) {
      // Logic to check if the click is outside the context menu
      // This might require accessing the contextMenuComponent's DOM element to check if the click is outside
      // For simplicity, toggle the visibility off for now
      this.showContextMenu = false;
    }
  }



  // onContextMenuActionSelect(event: {action: string, nodeId: string | null}) {
  //   console.log("Action selected:", event.action, "for nodeId:", event.nodeId);
  //   // Example: Dynamically loading AddNodeComponent
  //   const nodeData = this.nodes.get(event.nodeId);
  //   const nodeLabel = nodeData ? nodeData.label : 'No Label';
  //   const context: DynamicComponentContext = {
  //     nodeId: event.nodeId,
  //     projectNodeId: this.projectNodeId,
  //     nodeLabel: nodeLabel,
  //     action: event.action // Include the action here
  //   };
  //   let component: Type<any>;
  //   switch(event.action) {
  //     case 'addNode':
  //       component = AddNodeComponent;
  //       break;
  //     case 'deleteNodeAndSubNodes':
  //     case 'deleteSubNodes':
  //       component = RemoveNodeComponent;
  //       break;
  //     default:
  //       console.error('Unknown action:', event.action);
  //       return;
  //   }
  //
  //   this.loadDynamicComponent(component, context);
  // }
  // private loadDynamicComponent(component: Type<any>, context: DynamicComponentContext) {
  //   const componentRef = this.dynamicInsertionPoint.createComponent(component);
  //   const instance = componentRef.instance;
  //
  //   instance.nodeId = context.nodeId;
  //   instance.isVisible = true; // Make sure the component is visible
  //   instance.projectNodeId = context.projectNodeId;
  //   instance.parentNodeLabel = context.nodeLabel;
  //
  //   if (instance instanceof RemoveNodeComponent && context.action) {
  //     instance.actionType = context.action;
  //   }
  //   // Listen to component's events if needed, or perform additional setup
  // }
}
