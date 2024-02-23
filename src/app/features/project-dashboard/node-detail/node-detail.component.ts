import { Component, OnInit } from '@angular/core';
import { NodeDetailService } from '../../../core/services/node-detail.service'; // Import the service

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.css']
})
export class NodeDetailComponent implements OnInit {
  nodeData: any;

  constructor(private nodeDetailService: NodeDetailService) { }

  ngOnInit(): void {
    this.nodeDetailService.currentNodeDetail.subscribe(detail => {
      this.nodeData = detail;
    });
  }
}
