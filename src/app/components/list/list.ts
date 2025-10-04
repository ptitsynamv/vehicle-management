import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle';
import { CreateVehicle, SortableVehicleKeys, Vehicle } from '../../models/vehicle.model';
import { RouterLink } from '@angular/router';
import { SortOrder } from '../../models/common.model';
import { AddVehicleModal } from '../add-vehicle-modal/add-vehicle-modal';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [RouterLink, AddVehicleModal],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List implements OnInit {
  public displayedVehicles: Vehicle[] = [];
  public currentPage = 1;
  public totalPages = 0;
  public isModalOpen = false;
  public errorMessage = '';

  private _vehicles: Vehicle[] = [];
  private _sortOrder: SortOrder = 'asc';
  private readonly _PAGE_SIZE = 5;

  constructor(private _vehicleService: VehicleService, private _ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._loadVehicles();
  }

  public prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this._updateDisplayedVehicles();
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this._updateDisplayedVehicles();
    }
  }

  public onSortChange(key: SortableVehicleKeys): void {
    this._sortOrder = this._sortOrder === 'asc' ? 'desc' : 'asc';
    this._vehicles.sort((a, b) => {
      const result = a[key].localeCompare(b[key]);
      return this._sortOrder === 'asc' ? result : -result;
    });
    this._updateDisplayedVehicles();
  }

  public openModal(): void {
    this.isModalOpen = true;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  public onVehicleAdded(vehicle: CreateVehicle): void {
    this._vehicleService
      .createVehicle(vehicle)
      .pipe(
        catchError((error) => {
          console.error('Error creating vehicle:', error);
          this.errorMessage = 'Failed to add vehicle. Please try again.';
          this._ref.detectChanges();
          throw error;
        })
      )
      .subscribe(() => {
        this.errorMessage = '';
        this.closeModal();
        this._loadVehicles();
      });
  }

  private _loadVehicles(): void {
    this._vehicleService.getVehicles().subscribe((data) => {
      this._vehicles = data;
      this.totalPages = Math.ceil(this._vehicles.length / this._PAGE_SIZE);
      this._updateDisplayedVehicles();
      this._ref.detectChanges();
    });
  }

  private _updateDisplayedVehicles(): void {
    const startIndex = (this.currentPage - 1) * this._PAGE_SIZE;
    const endIndex = startIndex + this._PAGE_SIZE;
    this.displayedVehicles = this._vehicles.slice(startIndex, endIndex);
  }
}
