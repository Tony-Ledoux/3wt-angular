import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  config = inject(ConfigService);

  get<T>(path: string, params: Record<string, any> = {}): Observable<T> {
    return this.http.get<T>(`${this.config.apiUrl}${path}`, { params: this.http_params(params) });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.config.apiUrl}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.config.apiUrl}${path}`, body);
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiUrl}${path}`);
  }

  private http_params(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

}
