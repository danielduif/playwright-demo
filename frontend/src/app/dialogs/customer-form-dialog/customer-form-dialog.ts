import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { extractFieldErrors } from '../../core/api-error-utils';
import { CustomerDetail } from '../../core/models/customer.model';
import { Messages } from '../../core/messages';
import { CustomerService } from '../../core/services/customer.service';
import { NotificationService } from '../../core/services/notification.service';
import { germanDateToIso } from '../../core/validation/date-format';
import { CustomerFormRawValues, validateCustomerFields } from '../../core/validation/customer-validation';
import { FormErrorState } from '../../core/validation/form-error-state';
import { LookupsService } from '../../core/services/lookups.service';

@Component({
  selector: 'app-customer-form-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './customer-form-dialog.html',
})
export class CustomerFormDialogComponent {
  private readonly customerService = inject(CustomerService);
  private readonly notifications = inject(NotificationService);
  private readonly lookupsService = inject(LookupsService);

  readonly messages = Messages;
  readonly saving = signal(false);
  private demoDefects: Record<string, boolean> = {};

  salutation = '';
  firstName = '';
  lastName = '';
  birthDate = '';
  status = 'Interessent';
  email = '';
  phone = '';
  street = '';
  houseNumber = '';
  postalCode = '';
  city = '';

  readonly errorState = new FormErrorState<CustomerFormRawValues>((values) =>
    validateCustomerFields(values, {
      ageLimitOffByOne: !!this.demoDefects['ageLimitOffByOne'],
      postalCodeAllowsFourDigits: !!this.demoDefects['postalCodeAllowsFourDigits'],
    }),
  );

  constructor(public dialogRef: MatDialogRef<CustomerFormDialogComponent, CustomerDetail | undefined>) {
    this.lookupsService.get().subscribe((lookups) => (this.demoDefects = lookups.demoDefects));
  }

  private currentValues(): CustomerFormRawValues {
    return {
      salutation: this.salutation,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      status: this.status,
      email: this.email,
      phone: this.phone,
      street: this.street,
      houseNumber: this.houseNumber,
      postalCode: this.postalCode,
      city: this.city,
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
      .create({
        salutation: this.salutation,
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: germanDateToIso(this.birthDate) ?? '',
        status: this.status,
        email: this.email,
        phone: this.phone,
        street: this.street,
        houseNumber: this.houseNumber,
        postalCode: this.postalCode,
        city: this.city,
      })
      .subscribe({
        next: (customer) => {
          this.notifications.success(Messages.customerCreated);
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
