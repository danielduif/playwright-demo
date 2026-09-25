import { Contract } from './contract.model';

export interface CustomerListItem {
  id: number;
  customerNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  status: string;
  contractsCount: number;
}

export interface CustomerDetail {
  id: number;
  customerNumber: string;
  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  email: string;
  phone: string | null;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  contracts: Contract[];
}

export interface CustomerCreateRequest {
  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

export interface CustomerMasterDataUpdateRequest {
  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
}

export interface CustomerContactUpdateRequest {
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}
