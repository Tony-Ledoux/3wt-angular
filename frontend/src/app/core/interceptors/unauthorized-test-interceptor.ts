import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const authInterceptor: (req: any, next: any) => any = (req, next) => {
  
  // --- TEST CONFIGURATIE ---
  const simulateTokenExpired = false; // Zet dit op 'false' om echt te communiceren met de API
  // -------------------------

  if (simulateTokenExpired) {
    console.warn('⚠️ Simulating expired token: returning 401 Unauthorized');
    
    // We maken een fout-object dat precies lijkt op een echte HTTP-fout van de server
    return throwError(() => new HttpErrorResponse({
      error: { message: 'Session expired' },
      status: 401,
      statusText: 'Unauthorized'
    }));
  }

  // Als we niet simuleren, gaan we gewoon door naar de volgende interceptor of de server
  return next(req);
};
