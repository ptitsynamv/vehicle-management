import {
  Component,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateVehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-add-vehicle-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-vehicle-modal.html',
  styleUrl: './add-vehicle-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVehicleModal {
  @Input() public errorMessage = '';
  @Input() set isOpen(value: boolean) {
    this.isModalOpen.set(value);
  }

  @Output() public close = new EventEmitter<void>();
  @Output() public save = new EventEmitter<CreateVehicle>();

  public vehicleForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    manufacturer: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    model: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fuel: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vin: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl(null),
    mileage: new FormControl(null, [Validators.min(0)]),
  });
  public isModalOpen = signal(false);

  constructor() {
    effect(() => {
      if (!this.isModalOpen()) {
        this.vehicleForm.reset();
      }
    });
  }

  public onSubmit(): void {
    if (this.vehicleForm.valid) {
      this.save.emit(this.vehicleForm.value as CreateVehicle);
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  public onClose(): void {
    this.close.emit();
  }
}
