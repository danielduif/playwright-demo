import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { extractFieldErrors } from '../../core/api-error-utils';
import { Contract } from '../../core/models/contract.model';
import { Lookups } from '../../core/models/dashboard.model';
import { Messages } from '../../core/messages';
import { ContractService } from '../../core/services/contract.service';
import { NotificationService } from '../../core/services/notification.service';
import { ContractFormRawValues, validateContractFields } from '../../core/validation/contract-validation';
import { germanDateToIso, isoToGermanDate } from '../../core/validation/date-format';
import { FormErrorState } from '../../core/validation/form-error-state';
import { formatGermanMoneyInput, parseGermanMoney } from '../../core/validation/money-format';

export interface ContractDialogData {
  customerId: number;
  lookups: Lookups;
  contract?: Contract;
}

@Component({
  selector: 'app-contract-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './contract-dialog.html',
})
export class ContractDialogComponent {
  private readonly contractService = inject(ContractService);
  private readonly notifications = inject(NotificationService);

  readonly messages = Messages;
  readonly saving = signal(false);
  readonly isEdit: boolean;

  line = '';
  insurer = '';
  policyNumber = '';
  startDate = '';
  endDate = '';
  annualPremium = '';
  paymentMode = '';
  licensePlate = '';

  readonly errorState = new FormErrorState<ContractFormRawValues>((values) =>
    validateContractFields(values, { endDateMayEqualStartDate: !!this.data.lookups.demoDefects['endDateMayEqualStartDate'] }),
  );

  constructor(
    public dialogRef: MatDialogRef<ContractDialogComponent, Contract | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: ContractDialogData,
  ) {
    this.isEdit = !!data.contract;
    if (data.contract) {
      this.line = data.contract.line;
      this.insurer = data.contract.insurer;
      this.policyNumber = data.contract.policyNumber;
      this.startDate = isoToGermanDate(data.contract.startDate);
      this.endDate = isoToGermanDate(data.contract.endDate);
      this.annualPremium = formatGermanMoneyInput(data.contract.annualPremium);
      this.paymentMode = data.contract.paymentMode;
      this.licensePlate = data.contract.licensePlate ?? '';
    }
  }

  get isKfz(): boolean {
    return this.line === 'KFZ';
  }

  onLineChange(): void {
    if (!this.isKfz) {
      this.licensePlate = '';
    }
  }

  private currentValues(): ContractFormRawValues {
    return {
      line: this.line,
      insurer: this.insurer,
      policyNumber: this.policyNumber,
      startDate: this.startDate,
      endDate: this.endDate,
      annualPremium: this.annualPremium,
      paymentMode: this.paymentMode,
      licensePlate: this.licensePlate,
    };
  }

  errorFor(field: string): string | null {
    return this.errorState.errorFor(field);
  }

  onBlur(field: string): void {
    this.errorState.onBlur(field, this.currentValues());
  }

  save(): void {
    const isValid = this.errorState.validateAll(this.currentValues());
    if (!isValid) {
      return;
    }

    const request = {
      line: this.line,
      insurer: this.insurer,
      policyNumber: this.policyNumber,
      startDate: germanDateToIso(this.startDate) ?? '',
      endDate: this.endDate.trim() ? germanDateToIso(this.endDate) : null,
      annualPremium: parseGermanMoney(this.annualPremium),
      paymentMode: this.paymentMode,
      licensePlate: this.isKfz ? this.licensePlate : null,
    };

    this.saving.set(true);
    const request$ = this.data.contract
      ? this.contractService.update(this.data.contract.id, request)
      : this.contractService.create(this.data.customerId, request);

    request$.subscribe({
      next: (contract) => {
        this.notifications.success(this.data.contract ? Messages.contractUpdated : Messages.contractCreated);
        this.dialogRef.close(contract);
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        if (error.status === 400) {
          this.errorState.applyServerErrors(extractFieldErrors(error));
        }
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
