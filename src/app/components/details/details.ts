import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  public vehicle: Vehicle | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _vehicleService: VehicleService,
    private _router: Router,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;

      this._vehicleService
        .getVehicleById(id)
        .pipe(
          catchError((error) => {
            console.error('Error fetching vehicle:', error);
            throw error;
          })
        )
        .subscribe((data) => {
          this.vehicle = data;
          this._ref.detectChanges();
        });
    });
  }
}
