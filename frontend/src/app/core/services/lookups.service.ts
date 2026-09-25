import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Lookups } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class LookupsService {
  private readonly http = inject(HttpClient);
  private cached$: Observable<Lookups> | null = null;

  get(): Observable<Lookups> {
    if (!this.cached$) {
      this.cached$ = this.http.get<Lookups>('/api/lookups').pipe(shareReplay(1));
    }
    return this.cached$;
  }
}
