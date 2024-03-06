import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as d3 from "d3";

@Directive({
  selector: '[appGraphDirective]'
})
export class GraphDirective implements OnChanges {
  @Input() nodes: any[];
  @Input() edges: any[];
  @Input() projectNodeId: string;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["nodes"] || changes["edges"] || changes["projectNodeId"]) {
      this.renderGraph();
    }
  }

  private renderGraph(): void {
    // First, clear the existing graph to prevent duplicates
    d3.select(this.el.nativeElement).select('svg').remove();

    const hierarchicalData = this.buildHierarchy(this.nodes, this.edges, this.projectNodeId);
    this.renderTree(hierarchicalData);
  }

  private buildHierarchy(nodes: any[], edges: any[], rootId: string) {
    const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] }]));

    edges.forEach(edge => {
      if (nodeMap.has(edge.from) && nodeMap.has(edge.to)) {
        const parent = nodeMap.get(edge.from);
        const child = nodeMap.get(edge.to);
        if (!parent.children.includes(child)) { // Avoid duplicate children
          parent.children.push(child);
        }
      }
    });

    return nodeMap.get(rootId);
  }

  private renderTree(hierarchicalData: any) {
    const margin = { top: 20, right: 120, bottom: 20, left: 120 },
      width = 1300 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    d3.select(this.el.nativeElement).select('svg').remove();

    const svg = d3.select(this.el.nativeElement).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Define 'g' as the container for the zoomable and pannable elements
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Apply the zoom behavior to the SVG and not the 'g' to capture zoom events on the entire SVG area
    svg.call(d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform); // Apply transformations to 'g'
    }));

    // Adjust tree layout to use nodeSize for fixed spacing
    const treemap = d3.tree()
      .nodeSize([150, 150]) // Adjust nodeSize for vertical and horizontal spacing
      .separation((a, b) => a.parent === b.parent ? 2 : 3); // Adjust separation between nodes

    let nodes = d3.hierarchy(hierarchicalData, (d: any) => d.children);
    nodes = treemap(nodes);

    // Drawing links and nodes within the 'g' to ensure they are affected by zoom and pan
    const links = g.selectAll(".link")
      .data(nodes.links())
      .enter().append("path")
      .attr("class", "link")
      .style("stroke", "#ccc")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

    const rectWidth = 240; // Width of the rectangle
    const rectHeight = 40;

    const node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `translate(${d.x - rectWidth / 2},${d.y - rectHeight / 2})`);

    node.append("rect")
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("fill", "white")
      .style("fill-opacity", 0.5) // Adjust for transparency
      .style("stroke", "steelblue") // Add border color if needed
      .style("stroke-width", "1.5px");

    node.append("text")
      .attr("dy", "1em") // Adjust to vertically align text at the top inside the rectangle
      .attr("x", rectWidth / 2) // Center the text within the rectangle
      .attr("text-anchor", "middle") // Ensure text is centered horizontally
      .text(d => d.data.label);
  }

}
