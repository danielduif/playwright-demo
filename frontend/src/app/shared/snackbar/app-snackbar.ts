import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  template: `<span data-testid="snackbar" role="status">{{ message }}</span>`,
})
export class AppSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) {}
}
