export interface Contract {
  id: number;
  customerId: number;
  line: string;
  insurer: string;
  policyNumber: string;
  startDate: string;
  endDate: string | null;
  annualPremium: number;
  paymentMode: string;
  licensePlate: string | null;
  status: 'Geplant' | 'Aktiv' | 'Abgelaufen';
  isExpiringSoon: boolean;
}

export interface ContractRequest {
  line: string;
  insurer: string;
  policyNumber: string;
  startDate: string;
  endDate: string | null;
  annualPremium: number | null;
  paymentMode: string;
  licensePlate: string | null;
}
