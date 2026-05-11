import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Controleer of de fout een 500 (Internal Server Error) is
      // De API is bereikbaar (want we krijgen een response), maar de server faalt intern (databank)
      if (error.status === 500) {
        router.navigate(['/db-error']);
      }
      
      return throwError(() => error);
    })
  );
};
