import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistsListComponent } from './therapists-list.component';

describe('TherapistsListComponent', () => {
  let component: TherapistsListComponent;
  let fixture: ComponentFixture<TherapistsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
