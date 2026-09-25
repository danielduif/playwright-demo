import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormDialogComponent } from '../../dialogs/customer-form-dialog/customer-form-dialog';
import { CustomerListItem } from '../../core/models/customer.model';
import { Messages } from '../../core/messages';
import { CustomerService } from '../../core/services/customer.service';

type SortColumn = 'customerNumber' | 'lastName';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [FormsModule, MatButtonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly messages = Messages;
  readonly search = signal('');
  readonly status = signal('Alle');
  readonly customers = signal<CustomerListItem[]>([]);
  readonly sortColumn = signal<SortColumn>('lastName');
  readonly sortDirection = signal<SortDirection>('asc');

  readonly sortedCustomers = computed(() => {
    const list = [...this.customers()];
    const column = this.sortColumn();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      const valueA = column === 'customerNumber' ? a.customerNumber : a.lastName;
      const valueB = column === 'customerNumber' ? b.customerNumber : b.lastName;
      return valueA.localeCompare(valueB, 'de-DE') * direction;
    });
    return list;
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.customerService.list(this.search(), this.status()).subscribe((customers) => this.customers.set(customers));
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.load();
  }

  onStatusChange(value: string): void {
    this.status.set(value);
    this.load();
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  ariaSortFor(column: SortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) {
      return 'none';
    }
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  openCustomer(id: number): void {
    this.router.navigate(['/kunden', id]);
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CustomerFormDialogComponent, { width: '640px', autoFocus: 'first-tabbable' });
    ref.afterClosed().subscribe((customer) => {
      if (customer) {
        this.router.navigate(['/kunden', customer.id]);
      }
    });
  }
}
