import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpaBookingsDialogComponent } from './view-spa-bookings-dialog.component';

describe('ViewSpaBookingsDialogComponent', () => {
  let component: ViewSpaBookingsDialogComponent;
  let fixture: ComponentFixture<ViewSpaBookingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSpaBookingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSpaBookingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
