import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { catchError, finalize, of } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details implements OnInit {
  public vehicle: Vehicle | null = null;
  public isError = false;
  public isLoading = false;

  constructor(
    private _route: ActivatedRoute,
    private _vehicleService: VehicleService,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;
      this.isLoading = true;

      this._vehicleService
        .getVehicleById(id)
        .pipe(
          catchError((error) => {
            if (error.status !== 404) {
              this.isError = true;
            }
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
            this._ref.detectChanges();
          })
        )
        .subscribe((data) => {
          this.vehicle = data;
        });
    });
  }
}
