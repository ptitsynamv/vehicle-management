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
    name: new FormControl('', [Validators.required]),
    manufacturer: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    fuel: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    vin: new FormControl('', [Validators.required]),
    color: new FormControl(null),
    mileage: new FormControl(null, [Validators.min(0)]),
  });
  public isModalOpen = signal(false);

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

  private _clearFormEffect = effect(() => {
    if (!this.isModalOpen()) {
      this.vehicleForm.reset();
      this.errorMessage = '';
    }
  });
}
