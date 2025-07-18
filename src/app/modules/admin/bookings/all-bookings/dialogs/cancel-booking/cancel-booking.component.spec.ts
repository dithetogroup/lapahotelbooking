import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingComponent } from './cancel-booking.component';

describe('DeleteComponent', () => {
  let component: CancelBookingComponent;
  let fixture: ComponentFixture<CancelBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelBookingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
