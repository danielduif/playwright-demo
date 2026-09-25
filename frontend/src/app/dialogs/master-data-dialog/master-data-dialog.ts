import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { extractFieldErrors } from '../../core/api-error-utils';
import { CustomerDetail } from '../../core/models/customer.model';
import { NotificationService } from '../../core/services/notification.service';
import { CustomerService } from '../../core/services/customer.service';
import { isoToGermanDate, germanDateToIso } from '../../core/validation/date-format';
import { CustomerFormRawValues, validateCustomerFields } from '../../core/validation/customer-validation';
import { FormErrorState } from '../../core/validation/form-error-state';
import { Messages } from '../../core/messages';
import { LookupsService } from '../../core/services/lookups.service';

export interface MasterDataDialogData {
  customer: CustomerDetail;
}

@Component({
  selector: 'app-master-data-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './master-data-dialog.html',
})
export class MasterDataDialogComponent {
  private readonly customerService = inject(CustomerService);
  private readonly notifications = inject(NotificationService);
  private readonly lookupsService = inject(LookupsService);

  readonly messages = Messages;
  readonly saving = signal(false);
  private demoDefects: Record<string, boolean> = {};

  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;

  readonly errorState = new FormErrorState<CustomerFormRawValues>((values) => {
    const contactPart: Pick<CustomerFormRawValues, 'email' | 'phone' | 'street' | 'houseNumber' | 'postalCode' | 'city'> = {
      email: this.data.customer.email,
      phone: this.data.customer.phone ?? '',
      street: this.data.customer.street,
      houseNumber: this.data.customer.houseNumber,
      postalCode: this.data.customer.postalCode,
      city: this.data.customer.city,
    };
    const allErrors = validateCustomerFields({ ...values, ...contactPart }, {
      ageLimitOffByOne: !!this.demoDefects['ageLimitOffByOne'],
      postalCodeAllowsFourDigits: !!this.demoDefects['postalCodeAllowsFourDigits'],
    });
    const masterDataFields: (keyof CustomerFormRawValues)[] = ['salutation', 'firstName', 'lastName', 'birthDate', 'status'];
    const filtered: Record<string, string> = {};
    for (const field of masterDataFields) {
      if (allErrors[field]) {
        filtered[field] = allErrors[field];
      }
    }
    return filtered;
  });

  constructor(
    public dialogRef: MatDialogRef<MasterDataDialogComponent, CustomerDetail | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: MasterDataDialogData,
  ) {
    this.salutation = data.customer.salutation;
    this.firstName = data.customer.firstName;
    this.lastName = data.customer.lastName;
    this.birthDate = isoToGermanDate(data.customer.birthDate);
    this.status = data.customer.status;
    this.lookupsService.get().subscribe((lookups) => (this.demoDefects = lookups.demoDefects));
  }

  private currentValues(): CustomerFormRawValues {
    return {
      salutation: this.salutation,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      status: this.status,
      email: '',
      phone: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
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

    this.saving.set(true);
    this.customerService
      .updateMasterData(this.data.customer.id, {
        salutation: this.salutation,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: germanDateToIso(this.birthDate) ?? '',
        status: this.status,
      })
      .subscribe({
        next: (customer) => {
          this.notifications.success(Messages.customerUpdated);
          this.dialogRef.close(customer);
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
