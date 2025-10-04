import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unknown error occurred!';
        if (error.error && error.error.message) {
          message = error.error.message;
        } else if (error.status) {
          message = `Error ${error.status}: ${error.statusText}`;
        }
        // TODO: Log the error to an external service
        console.error('HTTP Error:', message);

        return throwError(() => new Error(message));
      })
    );
  }
}
