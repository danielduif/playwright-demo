import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { extractFieldErrors } from '../../core/api-error-utils';
import { CustomerDetail } from '../../core/models/customer.model';
import { Messages } from '../../core/messages';
import { CustomerService } from '../../core/services/customer.service';
import { NotificationService } from '../../core/services/notification.service';
import { CustomerFormRawValues, validateCustomerFields } from '../../core/validation/customer-validation';
import { FormErrorState } from '../../core/validation/form-error-state';
import { LookupsService } from '../../core/services/lookups.service';

export interface ContactDialogData {
  customer: CustomerDetail;
}

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './contact-dialog.html',
})
export class ContactDialogComponent {
  private readonly customerService = inject(CustomerService);
  private readonly notifications = inject(NotificationService);
  private readonly lookupsService = inject(LookupsService);

  readonly messages = Messages;
  readonly saving = signal(false);
  private demoDefects: Record<string, boolean> = {};

  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;

  readonly errorState = new FormErrorState<CustomerFormRawValues>((values) => {
    const masterDataPart: Pick<CustomerFormRawValues, 'salutation' | 'firstName' | 'lastName' | 'birthDate' | 'status'> = {
      salutation: this.data.customer.salutation,
      firstName: this.data.customer.firstName,
      lastName: this.data.customer.lastName,
      birthDate: this.data.customer.birthDate,
      status: this.data.customer.status,
    };
    const allErrors = validateCustomerFields({ ...masterDataPart, ...values }, {
      ageLimitOffByOne: !!this.demoDefects['ageLimitOffByOne'],
      postalCodeAllowsFourDigits: !!this.demoDefects['postalCodeAllowsFourDigits'],
    });
    const contactFields: (keyof CustomerFormRawValues)[] = ['email', 'phone', 'street', 'houseNumber', 'postalCode', 'city'];
    const filtered: Record<string, string> = {};
    for (const field of contactFields) {
      if (allErrors[field]) {
        filtered[field] = allErrors[field];
      }
    }
    return filtered;
  });

  constructor(
    public dialogRef: MatDialogRef<ContactDialogComponent, CustomerDetail | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData,
  ) {
    this.email = data.customer.email;
    this.phone = data.customer.phone ?? '';
    this.street = data.customer.street;
    this.houseNumber = data.customer.houseNumber;
    this.postalCode = data.customer.postalCode;
    this.city = data.customer.city;
    this.lookupsService.get().subscribe((lookups) => (this.demoDefects = lookups.demoDefects));
  }

  private currentValues(): CustomerFormRawValues {
    return {
      salutation: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      status: '',
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
      .updateContact(this.data.customer.id, {
        email: this.email,
        phone: this.phone,
        street: this.street,
        houseNumber: this.houseNumber,
        postalCode: this.postalCode,
        city: this.city,
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
