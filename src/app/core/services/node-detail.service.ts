// src/app/core/services/node-detail.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodeDetailService {
  private nodeDetailSource = new BehaviorSubject<any>(null);
  currentNodeDetail = this.nodeDetailSource.asObservable();

  constructor() { }

  updateNodeDetail(nodeData: any) {
    this.nodeDetailSource.next(nodeData);
  }
}
