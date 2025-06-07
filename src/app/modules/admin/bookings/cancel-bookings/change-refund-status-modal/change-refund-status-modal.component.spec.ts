import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRefundStatusModalComponent } from './change-refund-status-modal.component';

describe('ChangeRefundStatusModalComponent', () => {
  let component: ChangeRefundStatusModalComponent;
  let fixture: ComponentFixture<ChangeRefundStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeRefundStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRefundStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
