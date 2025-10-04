import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateVehicle, Vehicle } from '../models/vehicle.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
  }

  public getVehicleById(id: string): Observable<Vehicle | null> {
    return this.http.get<Vehicle | null>(`${this.apiUrl}/vehicles/${id}`);
  }

  public createVehicle(vehicle: CreateVehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/vehicles`, vehicle);
  }
}
