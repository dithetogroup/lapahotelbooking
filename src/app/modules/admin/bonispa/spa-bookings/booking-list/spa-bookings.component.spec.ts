import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaBookingsComponent } from './spa-bookings.component';

describe('SpaBookingsComponent', () => {
  let component: SpaBookingsComponent;
  let fixture: ComponentFixture<SpaBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
