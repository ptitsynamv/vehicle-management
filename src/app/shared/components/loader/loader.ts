import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../services/loader';

@Component({
  selector: 'app-loader',
  imports: [AsyncPipe, NgIf],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  public loading$: Observable<boolean>;

  constructor(private _loaderService: LoaderService) {
    this.loading$ = this._loaderService.loading$;
  }
}
