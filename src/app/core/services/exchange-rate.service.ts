import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, interval, switchMap, throwError } from 'rxjs';
import { ExchangeRates } from './exchange-rate.model';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl = 'https://api.freecurrencyapi.com/v1/latest';
  private apiKey = 'fca_live_n8IlHm4ES1yxPCpFGzAey44cKcFKTwgJ1bHM6hyK'; // Buraya kendi API anahtarınızı ekleyin

  constructor(private http: HttpClient) {}

  getExchangeRates(base: string = 'USD'): Observable<any> {
    const headers = { apikey: this.apiKey };
    return this.http.get(`${this.apiUrl}?base_currency=${base}`, { headers });
  }
}