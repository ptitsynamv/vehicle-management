import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddVehicleModal } from './add-vehicle-modal';
import { CreateVehicle } from '../../models/vehicle.model';

describe('AddVehicleModal', () => {
  let fixture: ComponentFixture<AddVehicleModal>;
  let component: AddVehicleModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleModal, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVehicleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit save when form invalid and mark controls as touched', () => {
    spyOn(component.save, 'emit');

    component.onSubmit();

    expect(component.save.emit).not.toHaveBeenCalled();
    expect(component.vehicleForm.touched).toBeTrue();
  });

  it('should emit save with form value when form is valid', () => {
    spyOn(component.save, 'emit');

    component.vehicleForm.patchValue({
      name: 'Name',
      manufacturer: 'Maker',
      model: 'ModelX',
      fuel: 'Electric',
      type: 'SUV',
      vin: 'VIN123',
      color: 'Red',
      mileage: 1000,
    } as any);

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      name: 'Name',
      manufacturer: 'Maker',
      model: 'ModelX',
      fuel: 'Electric',
      type: 'SUV',
      vin: 'VIN123',
      color: 'Red',
      mileage: 1000,
    } as unknown as CreateVehicle);
  });

  it('should emit close on onClose', () => {
    spyOn(component.close, 'emit');

    component.onClose();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should toggle isModalOpen when isOpen input changes', () => {
    expect(component.isModalOpen()).toBeFalse();
    component.isOpen = true;
    expect(component.isModalOpen()).toBeTrue();
    component.isOpen = false;
    expect(component.isModalOpen()).toBeFalse();
  });

  it('should clear form when modal closes (effect)', fakeAsync(() => {
    component.vehicleForm.patchValue({
      name: 'Name',
      manufacturer: 'Maker',
      model: 'ModelX',
      fuel: 'Electric',
      type: 'SUV',
      vin: 'VIN123',
      color: 'Red',
      mileage: 1000,
    } as any);

    component.isOpen = true;
    expect(component.isModalOpen()).toBeTrue();

    component.isOpen = false;
    tick();
    fixture.detectChanges();
    expect(component.isModalOpen()).toBeFalse();

    expect(component.vehicleForm.value).toEqual({
      name: '',
      manufacturer: '',
      model: '',
      fuel: '',
      type: '',
      vin: '',
      color: null,
      mileage: null,
    });
  }));

  it('should enforce required validators', () => {
    const { name, manufacturer, model, fuel, type, vin } = component.vehicleForm.controls;
    expect(name?.hasError('required')).toBeTrue();
    expect(manufacturer?.hasError('required')).toBeTrue();
    expect(model?.hasError('required')).toBeTrue();
    expect(fuel?.hasError('required')).toBeTrue();
    expect(type?.hasError('required')).toBeTrue();
    expect(vin?.hasError('required')).toBeTrue();
  });

  it('should validate mileage min=0', () => {
    const mileage = component.vehicleForm.controls.mileage;
    (mileage as any)?.setValue(-5);
    expect(mileage?.hasError('min')).toBeTrue();
    (mileage as any)?.setValue(0);
    expect(mileage?.valid).toBeTrue();
  });
});
