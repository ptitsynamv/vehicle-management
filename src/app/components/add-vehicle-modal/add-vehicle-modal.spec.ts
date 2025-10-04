import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicleModal } from './add-vehicle-modal';

describe('AddVehicleModal', () => {
  let component: AddVehicleModal;
  let fixture: ComponentFixture<AddVehicleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVehicleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
