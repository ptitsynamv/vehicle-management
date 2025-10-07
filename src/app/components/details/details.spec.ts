import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

import { Details } from './details';
import { VehicleService } from '../../services/vehicle';
import { Vehicle } from '../../models/vehicle.model';

describe('Details Component', () => {
  let fixture: ComponentFixture<Details>;
  let component: Details;
  let vehicleService: jasmine.SpyObj<VehicleService>;
  let activatedRoute: ActivatedRoute;

  const mockVehicle: Vehicle = {
    id: '1',
    name: 'Name',
    manufacturer: 'Maker',
    model: 'ModelX',
    fuel: 'Electric',
    type: 'SUV',
    vin: 'VIN123',
    color: 'Red',
    mileage: 1000,
  };

  beforeEach(async () => {
    const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', ['getVehicleById']);
    const activatedRouteStub = {
      params: of({ id: '1' }),
    } as Partial<ActivatedRoute> as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [
        { provide: VehicleService, useValue: vehicleServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    vehicleService = TestBed.inject(VehicleService) as jasmine.SpyObj<VehicleService>;
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init with defaults', () => {
    expect(component.vehicle).toBeNull();
    expect(component.isError).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should load vehicle successfully when route params change', fakeAsync(() => {
    vehicleService.getVehicleById.and.returnValue(of(mockVehicle));
    const detectSpy = spyOn((component as any)['_ref'] as ChangeDetectorRef, 'detectChanges');

    component.ngOnInit();
    tick();

    expect(vehicleService.getVehicleById).toHaveBeenCalledWith('1');
    expect(component.vehicle).toEqual(mockVehicle);
    expect(component.isLoading).toBeFalse();
    expect(component.isError).toBeFalse();
    expect(detectSpy).toHaveBeenCalledTimes(2); // before request and in finalize
  }));

  it('should not set isError on 404 and stop loading', fakeAsync(() => {
    vehicleService.getVehicleById.and.returnValue(throwError(() => ({ status: 404 })));
    const detectSpy = spyOn((component as any)['_ref'] as ChangeDetectorRef, 'detectChanges');

    component.ngOnInit();
    tick();

    expect(vehicleService.getVehicleById).toHaveBeenCalledWith('1');
    expect(component.vehicle).toBeNull();
    expect(component.isError).toBeFalse();
    expect(component.isLoading).toBeFalse();
    expect(detectSpy).toHaveBeenCalledTimes(2);
  }));

  it('should set isError on non-404 errors and stop loading', fakeAsync(() => {
    vehicleService.getVehicleById.and.returnValue(throwError(() => ({ status: 500 })));
    const detectSpy = spyOn((component as any)['_ref'] as ChangeDetectorRef, 'detectChanges');

    component.ngOnInit();
    tick();

    expect(vehicleService.getVehicleById).toHaveBeenCalledWith('1');
    expect(component.vehicle).toBeNull();
    expect(component.isError).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(detectSpy).toHaveBeenCalledTimes(2);
  }));
});
