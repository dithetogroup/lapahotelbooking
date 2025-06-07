import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInvoicesComponent } from './booking-invoices.component';

describe('BookingInvoicesComponent', () => {
  let component: BookingInvoicesComponent;
  let fixture: ComponentFixture<BookingInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
