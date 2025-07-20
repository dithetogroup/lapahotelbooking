import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTherapistDialogComponent } from './delete-therapist-dialog.component';

describe('DeleteTherapistDialogComponent', () => {
  let component: DeleteTherapistDialogComponent;
  let fixture: ComponentFixture<DeleteTherapistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTherapistDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTherapistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
