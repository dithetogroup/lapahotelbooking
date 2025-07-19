import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularClientsComponent } from './regular-clients.component';

describe('RegularClientsComponent', () => {
  let component: RegularClientsComponent;
  let fixture: ComponentFixture<RegularClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegularClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
