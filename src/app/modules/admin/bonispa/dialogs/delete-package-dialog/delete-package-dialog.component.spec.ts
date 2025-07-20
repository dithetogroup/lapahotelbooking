import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePackageDialogComponent } from './delete-package-dialog.component';

describe('DeletePackageDialogComponent', () => {
  let component: DeletePackageDialogComponent;
  let fixture: ComponentFixture<DeletePackageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePackageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePackageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
