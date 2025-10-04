import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorService {
  private _errorMessage = signal<string | null>(null);

  public clear(): void {
    this._errorMessage.set(null);
  }

  public setError(message: string): void {
    this._errorMessage.set(message);
  }

  public get errorMessage() {
    return this._errorMessage;
  }
}
