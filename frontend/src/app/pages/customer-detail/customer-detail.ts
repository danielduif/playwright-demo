import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog';
import { ContractDialogComponent } from '../../dialogs/contract-dialog/contract-dialog';
import { ContactDialogComponent } from '../../dialogs/contact-dialog/contact-dialog';
import { MasterDataDialogComponent } from '../../dialogs/master-data-dialog/master-data-dialog';
import { Contract } from '../../core/models/contract.model';
import { CustomerDetail } from '../../core/models/customer.model';
import { Lookups } from '../../core/models/dashboard.model';
import { Messages } from '../../core/messages';
import { extractMessage } from '../../core/api-error-utils';
import { ContractService } from '../../core/services/contract.service';
import { CustomerService } from '../../core/services/customer.service';
import { LookupsService } from '../../core/services/lookups.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly customerService = inject(CustomerService);
  private readonly contractService = inject(ContractService);
  private readonly lookupsService = inject(LookupsService);
  private readonly notifications = inject(NotificationService);

  readonly messages = Messages;
  readonly customer = signal<CustomerDetail | null>(null);
  readonly notFound = signal(false);
  readonly deleteErrorBanner = signal<string | null>(null);
  private lookups: Lookups | null = null;
  private customerId = 0;

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.lookupsService.get().subscribe((lookups) => (this.lookups = lookups));
    this.load();
  }

  private load(): void {
    this.customerService.get(this.customerId).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.notFound.set(false);
      },
      error: () => {
        this.notFound.set(true);
      },
    });
  }

  openMasterDataDialog(): void {
    const customer = this.customer();
    if (!customer) {
      return;
    }
    const ref = this.dialog.open(MasterDataDialogComponent, {
      width: '560px',
      autoFocus: 'first-tabbable',
      data: { customer },
    });
    ref.afterClosed().subscribe((updated) => {
      if (updated) {
        this.customer.set(updated);
      }
    });
  }

  openContactDialog(): void {
    const customer = this.customer();
    if (!customer) {
      return;
    }
    const ref = this.dialog.open(ContactDialogComponent, {
      width: '560px',
      autoFocus: 'first-tabbable',
      data: { customer },
    });
    ref.afterClosed().subscribe((updated) => {
      if (updated) {
        this.customer.set(updated);
      }
    });
  }

  openContractDialog(contract?: Contract): void {
    if (!this.lookups) {
      return;
    }
    const ref = this.dialog.open(ContractDialogComponent, {
      width: '640px',
      autoFocus: 'first-tabbable',
      data: { customerId: this.customerId, lookups: this.lookups, contract },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.load();
      }
    });
  }

  deleteContract(contract: Contract): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      autoFocus: 'first-tabbable',
      data: {
        dialogTestId: 'dialog-delete-contract',
        title: 'Vertrag löschen?',
        message: Messages.contractDeleteConfirm(contract.policyNumber),
        confirmLabel: 'Löschen',
        confirmTestId: `btn-confirm-delete-contract-${contract.policyNumber}`,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.contractService.delete(contract.id).subscribe(() => {
        this.notifications.success(Messages.contractDeleted);
        this.load();
      });
    });
  }

  deleteCustomer(): void {
    const customer = this.customer();
    if (!customer) {
      return;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '480px',
      autoFocus: 'first-tabbable',
      data: {
        dialogTestId: 'dialog-delete-customer',
        title: 'Kunde löschen?',
        message: Messages.customerDeleteConfirm(customer.firstName, customer.lastName, customer.customerNumber),
        confirmLabel: 'Löschen',
        confirmTestId: 'btn-confirm-delete-customer',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      this.deleteErrorBanner.set(null);
      this.customerService.delete(customer.id).subscribe({
        next: () => {
          this.notifications.success(Messages.customerDeleted);
          this.router.navigate(['/kunden']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.deleteErrorBanner.set(extractMessage(error) ?? Messages.customerHasContracts);
          }
        },
      });
    });
  }
}
