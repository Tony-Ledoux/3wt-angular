//app.config.ts
import { routes } from './app.routes';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { RUNTIME_CONFIG } from './core/config.token';



const debugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request naar:', req.url);
  console.log('Headers:', req.headers.get('Authorization'));
  return next(req);
};

export function appConfig(runtimeConfig: any) {
  return {
    providers: [
      { provide: RUNTIME_CONFIG, useValue: runtimeConfig },
      provideBrowserGlobalErrorListeners(),
      provideZonelessChangeDetection(),
      //provideRouter(routes),
      provideRouter(routes, withEnabledBlockingInitialNavigation()),
      provideHttpClient(
        withInterceptors([authHttpInterceptorFn, errorInterceptor])
        //withInterceptors([authHttpInterceptorFn, errorInterceptor,debugInterceptor]) //activeer deze om te debuggen

      ),
      provideAuth0({
        domain: runtimeConfig.auth0.domain,
        clientId: runtimeConfig.auth0.client_id,
        useRefreshTokens: true,
        cacheLocation: 'localstorage',
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: runtimeConfig.auth0.audience,
          scope: 'openid profile email'
        },
        httpInterceptor: {
          allowedList: [{uri:`${runtimeConfig.api.url}/*`,allowAnonymous:true}]
        }
      }),
    ]
  };
}
