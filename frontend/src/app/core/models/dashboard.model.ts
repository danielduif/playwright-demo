export interface ExpiringContract {
  policyNumber: string;
  line: string;
  customerId: number;
  customerNumber: string;
  customerName: string;
  endDate: string;
}

export interface Dashboard {
  customersTotal: number;
  customersActive: number;
  contractsActive: number;
  contractsExpiring: number;
  premiumVolume: number;
  expiringContracts: ExpiringContract[];
}

export interface Lookups {
  salutations: string[];
  customerStatuses: string[];
  contractLines: string[];
  insurers: string[];
  paymentModes: string[];
  demoDefects: Record<string, boolean>;
}
