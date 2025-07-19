import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegularClientDialogComponent } from './view-regular-client-dialog.component';

describe('ViewRegularClientDialogComponent', () => {
  let component: ViewRegularClientDialogComponent;
  let fixture: ComponentFixture<ViewRegularClientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegularClientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRegularClientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
