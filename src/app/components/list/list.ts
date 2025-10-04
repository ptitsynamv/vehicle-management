import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle';
import { SortableVehicleKeys, Vehicle } from '../../models/vehicle.model';
import { RouterLink } from '@angular/router';
import { SortOrder } from '../../models/common.model';

@Component({
  selector: 'app-list',
  imports: [RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  public displayedVehicles: Vehicle[] = [];
  public currentPage = 1;
  public totalPages = 0;

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

  public onAddVehicle(): void {}

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
