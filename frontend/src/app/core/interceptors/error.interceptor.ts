import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotifyService } from '../services/notify/notify-service';
import { inject } from '@angular/core';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(NotifyService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        // Dit is waar "Connection Refused" terechtkomt
        toaster.error('Kan geen verbinding maken met de server. Controleer of de backend draait.',5000,false,'fa fa-cog')
      } else if (error.status === 401) {

        toaster.error('Sessie verlopen, log opnieuw in.',5000,false)
      } 
      
      return throwError(() => error);
    })
  );
};
