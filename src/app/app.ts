import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Loader } from './core/components/loader/loader';
import { GlobalError } from './core/components/global-error/global-error';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Loader, GlobalError],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Vehicle Management');
}
