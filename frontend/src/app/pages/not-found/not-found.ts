import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Messages } from '../../core/messages';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>{{ messages.pageNotFound }}</h2>
    <p><a routerLink="/">Zur Startseite</a></p>
  `,
})
export class NotFoundComponent {
  readonly messages = Messages;
}
