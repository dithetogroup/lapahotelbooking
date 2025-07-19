import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRegularClientDialogComponent } from './edit-regular-client-dialog.component';

describe('EditRegularClientDialogComponent', () => {
  let component: EditRegularClientDialogComponent;
  let fixture: ComponentFixture<EditRegularClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRegularClientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRegularClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
