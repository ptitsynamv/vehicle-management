import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  public vehicle: Vehicle | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _vehicleService: VehicleService,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;

      this._vehicleService.getVehicleById(id).subscribe((data) => {
        this.vehicle = data;
        this._ref.detectChanges();
      });
    });
  }
}
