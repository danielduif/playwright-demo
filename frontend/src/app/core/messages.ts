/** Zentraler Meldungskatalog. Texte müssen wörtlich mit der Spezifikation übereinstimmen. */
export const Messages = {
  required: (label: string) => `${label} ist ein Pflichtfeld.`,
  lengthBetween: (label: string, min: number, max: number) => `${label} muss zwischen ${min} und ${max} Zeichen lang sein.`,
  lengthMax: (label: string, max: number) => `${label} darf höchstens ${max} Zeichen lang sein.`,

  birthDateFormat: 'Geburtsdatum ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.',
  birthDateFuture: 'Geburtsdatum darf nicht in der Zukunft liegen.',
  birthDateUnderage: 'Der Kunde muss mindestens 18 Jahre alt sein.',

  emailInvalid: 'E-Mail-Adresse ist ungültig.',
  emailDuplicate: 'Diese E-Mail-Adresse wird bereits für einen anderen Kunden verwendet.',

  phoneInvalid: 'Telefonnummer ist ungültig. Erlaubt sind 6 bis 20 Zeichen: Ziffern, Leerzeichen sowie + - / ( ).',

  postalCodeInvalid: 'PLZ muss aus genau 5 Ziffern bestehen.',

  policyNumberFormat: 'Policennummer ist ungültig. Erwartet wird das Format XXX-123456.',
  policyNumberDuplicate: 'Diese Policennummer existiert bereits.',

  contractStartDateFormat: 'Vertragsbeginn ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.',
  contractEndDateFormat: 'Vertragsende ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.',
  endNotAfterStart: 'Das Vertragsende muss nach dem Vertragsbeginn liegen.',

  annualPremiumInvalid: 'Jahresbeitrag ist ungültig. Erlaubt sind Beträge von 0,01 bis 99999,99 (Komma als Dezimaltrenner).',

  licensePlateRequired: 'Amtliches Kennzeichen ist ein Pflichtfeld für die Sparte KFZ.',
  licensePlateFormat: 'Amtliches Kennzeichen ist ungültig. Erwartet wird das Format HH-AB 1234.',

  dialogErrorBanner: 'Bitte korrigieren Sie die markierten Eingaben. Es wurden keine Änderungen gespeichert.',

  customerUpdated: 'Änderungen wurden gespeichert.',
  customerCreated: 'Kunde wurde angelegt.',
  customerDeleted: 'Kunde wurde gelöscht.',

  contractCreated: 'Vertrag wurde angelegt.',
  contractUpdated: 'Vertrag wurde gespeichert.',
  contractDeleted: 'Vertrag wurde gelöscht.',

  customerHasContracts: 'Der Kunde kann nicht gelöscht werden, solange ihm Verträge zugeordnet sind.',

  noCustomersFound: 'Keine Kunden gefunden.',
  noContracts: 'Für diesen Kunden sind keine Verträge vorhanden.',
  noExpiringContracts: 'Keine Verträge laufen in den nächsten 60 Tagen aus.',
  customerNotFound: 'Kunde nicht gefunden.',
  pageNotFound: 'Seite nicht gefunden.',

  contractDeleteConfirm: (policyNumber: string) =>
    `Möchten Sie den Vertrag ${policyNumber} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
  customerDeleteConfirm: (firstName: string, lastName: string, customerNumber: string) =>
    `Möchten Sie den Kunden ${firstName} ${lastName} (${customerNumber}) wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
};

export const FieldLabels = {
  salutation: 'Anrede',
  firstName: 'Vorname',
  lastName: 'Nachname',
  birthDate: 'Geburtsdatum',
  status: 'Status',
  email: 'E-Mail-Adresse',
  phone: 'Telefonnummer',
  street: 'Straße',
  houseNumber: 'Hausnummer',
  postalCode: 'PLZ',
  city: 'Ort',

  line: 'Sparte',
  insurer: 'Versicherer',
  policyNumber: 'Policennummer',
  startDate: 'Vertragsbeginn',
  endDate: 'Vertragsende',
  annualPremium: 'Jahresbeitrag',
  paymentMode: 'Zahlweise',
  licensePlate: 'Amtliches Kennzeichen',
};
