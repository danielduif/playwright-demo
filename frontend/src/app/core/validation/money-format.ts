const MONEY_PATTERN = /^(\d{1,5})(,(\d{1,2}))?$/;

/** Parst ein Betragsfeld mit Komma als Dezimaltrenner (z. B. "612,00"). Gibt null bei ungültigem Format zurück. */
export function parseGermanMoney(value: string): number | null {
  const match = MONEY_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }
  const integerPart = match[1];
  const decimalPart = (match[3] ?? '').padEnd(2, '0');
  return Number(`${integerPart}.${decimalPart}`);
}

/** Formatiert einen Betrag als TT.MM.JJJJ-analoges Komma-Format für Formularfelder (z. B. 612 -> "612,00"). */
export function formatGermanMoneyInput(value: number): string {
  return value.toFixed(2).replace('.', ',');
}
