import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  standalone: true,
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit {
  @Input() graphData: any;
  constructor() { }

  ngOnInit(): void {
  }

}
