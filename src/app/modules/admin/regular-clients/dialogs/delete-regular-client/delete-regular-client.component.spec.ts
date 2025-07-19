import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRegularClientComponent } from './delete-regular-client.component';

describe('DeleteRegularClientComponent', () => {
  let component: DeleteRegularClientComponent;
  let fixture: ComponentFixture<DeleteRegularClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRegularClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRegularClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
