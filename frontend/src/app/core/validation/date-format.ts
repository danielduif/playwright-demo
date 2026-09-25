/** Parst ein TT.MM.JJJJ-Textfeld. Gibt null zurück, wenn das Datum kalendarisch ungültig ist. */
export function parseGermanDate(value: string): Date | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** Wandelt ein Date in einen ISO-Datumsstring (yyyy-MM-dd) für die API. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Wandelt einen ISO-Datumsstring (yyyy-MM-dd) in TT.MM.JJJJ für die Anzeige/Formulare. */
export function isoToGermanDate(iso: string | null): string {
  if (!iso) {
    return '';
  }
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}

/** Wandelt ein TT.MM.JJJJ-Textfeld direkt in einen ISO-Datumsstring um, oder null bei ungültigem Format. */
export function germanDateToIso(value: string): string | null {
  const date = parseGermanDate(value);
  return date ? toIsoDate(date) : null;
}
