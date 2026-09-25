import { signal } from '@angular/core';

/**
 * Verwaltet Feldfehler und Banner-Sichtbarkeit für einen Dialog. Blur zeigt nur die
 * Meldung des verlassenen Feldes; ein Speicherversuch (Client oder Server) zeigt das
 * Banner und alle betroffenen Feldmeldungen.
 */
export class FormErrorState<TValues> {
  private readonly errorsSignal = signal<Record<string, string>>({});
  private readonly visibleSignal = signal<Set<string>>(new Set());
  private readonly bannerSignal = signal(false);

  constructor(private readonly validate: (values: TValues) => Record<string, string>) {}

  get bannerVisible() {
    return this.bannerSignal;
  }

  errorFor(field: string): string | null {
    if (!this.visibleSignal().has(field)) {
      return null;
    }
    return this.errorsSignal()[field] ?? null;
  }

  hasVisibleError(field: string): boolean {
    return this.errorFor(field) !== null;
  }

  onBlur(field: string, values: TValues): void {
    const allErrors = this.validate(values);
    const current = { ...this.errorsSignal() };
    if (allErrors[field]) {
      current[field] = allErrors[field];
    } else {
      delete current[field];
    }
    this.errorsSignal.set(current);
    const nextVisible = new Set(this.visibleSignal());
    nextVisible.add(field);
    this.visibleSignal.set(nextVisible);
  }

  /** Validiert alle Felder client-seitig. Gibt true zurück, wenn keine Fehler gefunden wurden. */
  validateAll(values: TValues): boolean {
    const allErrors = this.validate(values);
    this.errorsSignal.set(allErrors);
    this.visibleSignal.set(new Set(Object.keys(allErrors)));
    const isValid = Object.keys(allErrors).length === 0;
    this.bannerSignal.set(!isValid);
    return isValid;
  }

  applyServerErrors(serverErrors: Record<string, string>): void {
    this.errorsSignal.set({ ...this.errorsSignal(), ...serverErrors });
    const nextVisible = new Set(this.visibleSignal());
    for (const field of Object.keys(serverErrors)) {
      nextVisible.add(field);
    }
    this.visibleSignal.set(nextVisible);
    this.bannerSignal.set(true);
  }
}
