import { Component, effect } from '@angular/core';
import { GlobalErrorService } from '../../services/global-error';

@Component({
  selector: 'app-global-error',
  imports: [],
  templateUrl: './global-error.html',
  styleUrl: './global-error.scss',
})
export class GlobalError {
  constructor(public globalError: GlobalErrorService) {
    effect(() => {
      if (this.globalError.errorMessage()) {
        setTimeout(() => this.globalError.clear(), 5000);
      }
    });
  }

  public clear(): void {
    this.globalError.clear();
  }
}
