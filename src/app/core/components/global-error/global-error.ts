import { Component } from '@angular/core';
import { GlobalErrorService } from '../../services/global-error';

@Component({
  selector: 'app-global-error',
  imports: [],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
})
export class GlobalError {
  constructor(public globalError: GlobalErrorService) {}

  public clear(): void {
    this.globalError.clear();
  }
}
