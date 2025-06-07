import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingComponent } from '../all-bookings/dialogs/cancel-booking/cancel-booking.component';

describe('CancelBookingsComponent', () => {
  let component: CancelBookingComponent;
  let fixture: ComponentFixture<CancelBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelBookingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
