import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomerContactUpdateRequest,
  CustomerCreateRequest,
  CustomerDetail,
  CustomerListItem,
  CustomerMasterDataUpdateRequest,
} from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/customers';

  list(search: string, status: string): Observable<CustomerListItem[]> {
    const params: Record<string, string> = {};
    if (search) {
      params['search'] = search;
    }
    if (status) {
      params['status'] = status;
    }
    return this.http.get<CustomerListItem[]>(this.baseUrl, { params });
  }

  get(id: number): Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`${this.baseUrl}/${id}`);
  }

  create(request: CustomerCreateRequest): Observable<CustomerDetail> {
    return this.http.post<CustomerDetail>(this.baseUrl, request);
  }

  updateMasterData(id: number, request: CustomerMasterDataUpdateRequest): Observable<CustomerDetail> {
    return this.http.put<CustomerDetail>(`${this.baseUrl}/${id}/master-data`, request);
  }

  updateContact(id: number, request: CustomerContactUpdateRequest): Observable<CustomerDetail> {
    return this.http.put<CustomerDetail>(`${this.baseUrl}/${id}/contact`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
