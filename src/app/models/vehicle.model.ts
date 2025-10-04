export interface Vehicle {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  fuel: string;
  type: string;
  vin: string;
  color: string | null;
  mileage: number | null;
}

export type SortableVehicleKeys = keyof Pick<Vehicle, 'name' | 'manufacturer' | 'model'>;

export type CreateVehicle = Omit<Vehicle, 'id'>;
