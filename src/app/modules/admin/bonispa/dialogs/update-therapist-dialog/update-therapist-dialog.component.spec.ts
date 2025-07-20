import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTherapistDialogComponent } from './update-therapist-dialog.component';

describe('UpdateTherapistDialogComponent', () => {
  let component: UpdateTherapistDialogComponent;
  let fixture: ComponentFixture<UpdateTherapistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTherapistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTherapistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
