import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSpaBookingDialogComponent } from './delete-spa-booking-dialog.component';

describe('DeleteSpaBookingDialogComponent', () => {
  let component: DeleteSpaBookingDialogComponent;
  let fixture: ComponentFixture<DeleteSpaBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSpaBookingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSpaBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
