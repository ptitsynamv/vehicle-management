import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GlobalError } from './global-error';
import { GlobalErrorService } from '../../services/global-error';
import { Injector, runInInjectionContext } from '@angular/core';

describe('GlobalError Component', () => {
  let fixture: ComponentFixture<GlobalError>;
  let component: GlobalError;
  let service: jasmine.SpyObj<GlobalErrorService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('GlobalErrorService', ['clear', 'setError'], {
      errorMessage: (() => {
        let current: string | null = null;
        const getter = () => current;
        (getter as any).set = (v: string | null) => (current = v);
        return getter as any;
      })(),
    });

    await TestBed.configureTestingModule({
      imports: [GlobalError],
      providers: [{ provide: GlobalErrorService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalError);
    component = fixture.componentInstance;
    service = TestBed.inject(GlobalErrorService) as jasmine.SpyObj<GlobalErrorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should forward clear() to service.clear()', () => {
    component.clear();
    expect(service.clear).toHaveBeenCalled();
  });

  it('should schedule auto-clear when errorMessage is set', fakeAsync(() => {
    (service.errorMessage as any).set('Boom');

    const injector = TestBed.inject(Injector);

    runInInjectionContext(injector, () => {
      component = new GlobalError(service);
    });

    tick(5000);
    expect(service.clear).toHaveBeenCalled();
  }));
});
