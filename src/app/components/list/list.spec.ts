import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { List } from './list';
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle.model';
import { ChangeDetectorRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('List Component', () => {
  let fixture: ComponentFixture<List>;
  let component: List;
  let vehicleService: jasmine.SpyObj<VehicleService>;

  const vehicles: Vehicle[] = [
    {
      id: '1',
      name: 'Alpha',
      manufacturer: 'A',
      model: 'A1',
      fuel: 'Gas',
      type: 'Sedan',
      vin: 'V1',
      color: 'Red',
      mileage: 10,
    },
    {
      id: '2',
      name: 'Bravo',
      manufacturer: 'B',
      model: 'B1',
      fuel: 'Gas',
      type: 'SUV',
      vin: 'V2',
      color: 'Blue',
      mileage: 20,
    },
    {
      id: '3',
      name: 'Charlie',
      manufacturer: 'C',
      model: 'C1',
      fuel: 'Gas',
      type: 'Coupe',
      vin: 'V3',
      color: 'Black',
      mileage: 30,
    },
    {
      id: '4',
      name: 'Delta',
      manufacturer: 'D',
      model: 'D1',
      fuel: 'Gas',
      type: 'Sedan',
      vin: 'V4',
      color: 'White',
      mileage: 40,
    },
    {
      id: '5',
      name: 'Echo',
      manufacturer: 'E',
      model: 'E1',
      fuel: 'Gas',
      type: 'SUV',
      vin: 'V5',
      color: 'Green',
      mileage: 50,
    },
    {
      id: '6',
      name: 'Foxtrot',
      manufacturer: 'F',
      model: 'F1',
      fuel: 'Gas',
      type: 'Sedan',
      vin: 'V6',
      color: 'Yellow',
      mileage: 60,
    },
  ];

  beforeEach(async () => {
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', [
      'getVehicles',
      'createVehicle',
    ]);

    await TestBed.configureTestingModule({
      imports: [List, RouterTestingModule],
      providers: [{ provide: VehicleService, useValue: vehicleServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vehicles on init and set pagination', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    const detectSpy = spyOn((component as any)['_ref'] as ChangeDetectorRef, 'detectChanges');

    component.ngOnInit();

    expect(vehicleService.getVehicles).toHaveBeenCalled();
    expect(component.displayedVehicles?.length).toBe(5);
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(Math.ceil(vehicles.length / 5));
    expect(detectSpy).toHaveBeenCalled();
  });

  it('should go to next page when possible', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    component.ngOnInit();

    const firstPageFirstId = component.displayedVehicles?.[0]?.id;
    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(component.displayedVehicles?.[0]?.id).not.toBe(firstPageFirstId);
  });

  it('should not go past last page', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    component.ngOnInit();

    component.currentPage = component.totalPages;
    component.nextPage();

    expect(component.currentPage).toBe(component.totalPages);
  });

  it('should go to previous page when possible', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    component.ngOnInit();

    component.currentPage = 2;
    component.prevPage();

    expect(component.currentPage).toBe(1);
  });

  it('should not go before first page', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    component.ngOnInit();

    component.currentPage = 1;
    component.prevPage();

    expect(component.currentPage).toBe(1);
  });

  it('should toggle sort and sort by key', () => {
    vehicleService.getVehicles.and.returnValue(of(vehicles));
    component.ngOnInit();

    component.onSortChange('name');
    const ascFirst = component.displayedVehicles?.[0]?.name;
    component.onSortChange('name');
    const descFirst = component.displayedVehicles?.[0]?.name;

    expect(ascFirst).not.toBe(descFirst);
  });

  it('should open and close modal, clearing error', () => {
    component.errorMessage = 'x';
    component.openModal();
    expect(component.isModalOpen).toBeTrue();
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should add vehicle successfully: close modal and reload list', () => {
    const newVehicle = {
      name: 'N',
      manufacturer: 'M',
      model: 'X',
      fuel: 'Gas',
      type: 'T',
      vin: 'VIN',
      color: null,
      mileage: null,
    };
    vehicleService.createVehicle.and.returnValue(
      of({
        id: '100',
        ...newVehicle,
      } as Vehicle)
    );
    const loadSpy = spyOn<any>(component, '_loadVehicles');
    const closeSpy = spyOn(component, 'closeModal');

    component.onVehicleAdded(newVehicle);

    expect(vehicleService.createVehicle).toHaveBeenCalledWith(newVehicle);
    expect(closeSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should handle add vehicle error: set errorMessage and trigger detectChanges', fakeAsync(() => {
    const newVehicle = {
      name: 'N',
      manufacturer: 'M',
      model: 'X',
      fuel: 'Gas',
      type: 'T',
      vin: 'VIN',
      color: null,
      mileage: null,
    };
    vehicleService.createVehicle.and.returnValue(throwError(() => new Error('fail')));

    const detectSpy = spyOn((component as any)['_ref'], 'detectChanges');
    const loadSpy = spyOn<any>(component, '_loadVehicles');
    const closeSpy = spyOn(component, 'closeModal');

    try {
      component.onVehicleAdded(newVehicle);
      tick();
    } catch (error) {}

    expect(vehicleService.createVehicle).toHaveBeenCalledWith(newVehicle);
    expect(component.errorMessage).toBe('Failed to add vehicle. Please try again.');
    expect(detectSpy).toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    expect(loadSpy).not.toHaveBeenCalled();
  }));

  it('should update displayedVehicles according to page', () => {
    (component as any)['_vehicles'] = vehicles;
    component.currentPage = 2;
    (component as any)['_updateDisplayedVehicles']();

    expect(component.displayedVehicles?.length).toBe(vehicles.slice(5, 10).length);
    expect(component.displayedVehicles?.[0]?.id).toBe('6');
  });
});
