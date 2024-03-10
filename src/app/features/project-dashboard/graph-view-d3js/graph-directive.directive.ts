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
        width = 1920 - margin.left - margin.right,
        height = 1090 - margin.top - margin.bottom;

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
      .nodeSize([150, 200]) // Adjust nodeSize for vertical and horizontal spacing
      .separation((a, b) => a.parent === b.parent ? 2 : 3); // Adjust separation between nodes

    let nodes = d3.hierarchy(hierarchicalData, (d: any) => d.children);
    nodes = treemap(nodes);
// Define the marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10') // Coordinates of the viewBox
        .attr('refX', 5) // Positioning the arrowhead
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6) // Size of the marker
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5') // Shape of the arrowhead
        .attr('fill', '#ccc')
        .style('stroke','none');
    // Drawing links and nodes within the 'g' to ensure they are affected by zoom and pan
      const links = g.selectAll(".link")
        .data(nodes.links())
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "black")
        .style("stroke-width", "4px") // Adjustable thickness
        .attr("marker-end", "url(#arrowhead)") // Apply the arrow marker
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    const rectWidth = 240; // Width of the rectangle
    const rectHeight = 110;

    let selectedNode = null;
    const node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `translate(${d.x - rectWidth / 2},${d.y - rectHeight / 2})`)
      .on("click", function(event, d) { // Use function to keep 'this' context
        // If there's a previously selected node, remove its highlight
        if (selectedNode) {
          d3.select(selectedNode).select('rect').classed("node-highlight", false);
        }
        // Highlight the current node and update the selectedNode reference
        d3.select(this).select('rect').classed("node-highlight", true);
        selectedNode = this;

        // Optional: Prevent event propagation if necessary
      });
    node.append("rect")
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("rx", 10) // Set the radius for rounded corners here
      .attr("ry", 10) // Same value as rx for uniform rounded corners
      .attr("fill", "white")
      .style("fill-opacity", 0.5) // Adjust for transparency
      .attr("class", "node-rect");
      // .style("stroke", "steelblue") // Add border color if needed
      // .style("stroke-width", "1.5px");

    node.append("text")
      .attr("dy", "1em") // Adjust to vertically align text at the top inside the rectangle
      .attr("x", rectWidth / 2) // Center the text within the rectangle
      .attr("text-anchor", "middle") // Ensure text is centered horizontally
      .attr("class", "node-text")
      .text(d => d.data.label);

      node.each(function(d) {
        d3.select(this)
          .transition()
          .duration(300) // Duration of the shake effect in milliseconds
          .ease(d3.easeLinear) // Linear easing for consistent movement
          .attrTween("transform", function() {
            const x = d.x - rectWidth / 2;
            const y = d.y - rectHeight / 2;
            return function(t) {
              // Calculate a small oscillation (shake) around the original position
              const dx = 2 * Math.sin(t * 2 * Math.PI); // Oscillation magnitude
              return `translate(${x + dx},${y})`; // Apply the oscillation in X direction
            };
          });
      });
  }
  saveSvg(): void {
    // Find the SVG element
    console.log("doing something");
    const svgElement = this.el.nativeElement.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Create a Blob with the SVG string
    const blob = new Blob([svgString], {type: 'image/svg+xml'});

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and set the URL and download filename
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'graph.svg'; // Suggested filename for the download

    // Append the anchor to the body, click it, and then remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }


}
