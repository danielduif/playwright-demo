import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract, ContractRequest } from '../models/contract.model';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly http = inject(HttpClient);

  create(customerId: number, request: ContractRequest): Observable<Contract> {
    return this.http.post<Contract>(`/api/customers/${customerId}/contracts`, request);
  }

  update(id: number, request: ContractRequest): Observable<Contract> {
    return this.http.put<Contract>(`/api/contracts/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/contracts/${id}`);
  }
}
