import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicComponent } from './basic.component';

describe('BasicComponent', () => {
  let component: BasicComponent;
  let fixture: ComponentFixture<BasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BasicComponent],
    });
    fixture = TestBed.createComponent(BasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
