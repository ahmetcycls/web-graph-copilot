import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewD3jsComponent } from './graph-view-d3js.component';

describe('GraphViewD3jsComponent', () => {
  let component: GraphViewD3jsComponent;
  let fixture: ComponentFixture<GraphViewD3jsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphViewD3jsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphViewD3jsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
