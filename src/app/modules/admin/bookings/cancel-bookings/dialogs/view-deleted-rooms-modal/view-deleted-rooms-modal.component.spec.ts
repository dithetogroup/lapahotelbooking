import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeletedRoomsModalComponent } from './view-deleted-rooms-modal.component';

describe('ViewDeletedRoomsModalComponent', () => {
  let component: ViewDeletedRoomsModalComponent;
  let fixture: ComponentFixture<ViewDeletedRoomsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDeletedRoomsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeletedRoomsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
