import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoomComponent } from './edit-room.component';

describe('EditRoomComponent', () => {
  let component: EditRoomComponent;
  let fixture: ComponentFixture<EditRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRoomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
