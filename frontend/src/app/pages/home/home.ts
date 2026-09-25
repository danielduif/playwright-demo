import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormDialogComponent } from '../../dialogs/customer-form-dialog/customer-form-dialog';
import { Dashboard } from '../../core/models/dashboard.model';
import { Messages } from '../../core/messages';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  readonly dashboard = signal<Dashboard | null>(null);
  readonly messages = Messages;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.dashboardService.get().subscribe((dashboard) => this.dashboard.set(dashboard));
  }

  openCustomer(customerId: number): void {
    this.router.navigate(['/kunden', customerId]);
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
