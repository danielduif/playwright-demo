namespace MaklerCrm.Api.Validation;

/// <summary>Zentraler Meldungskatalog. Texte müssen wörtlich mit der Spezifikation übereinstimmen.</summary>
public static class Messages
{
    public static string Required(string label) => $"{label} ist ein Pflichtfeld.";
    public static string LengthBetween(string label, int min, int max) => $"{label} muss zwischen {min} und {max} Zeichen lang sein.";
    public static string LengthMax(string label, int max) => $"{label} darf höchstens {max} Zeichen lang sein.";

    public const string BirthDateFormat = "Geburtsdatum ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.";
    public const string BirthDateFuture = "Geburtsdatum darf nicht in der Zukunft liegen.";
    public const string BirthDateUnderage = "Der Kunde muss mindestens 18 Jahre alt sein.";

    public const string EmailInvalid = "E-Mail-Adresse ist ungültig.";
    public const string EmailDuplicate = "Diese E-Mail-Adresse wird bereits für einen anderen Kunden verwendet.";

    public const string PhoneInvalid = "Telefonnummer ist ungültig. Erlaubt sind 6 bis 20 Zeichen: Ziffern, Leerzeichen sowie + - / ( ).";

    public const string PostalCodeInvalid = "PLZ muss aus genau 5 Ziffern bestehen.";

    public const string PolicyNumberFormat = "Policennummer ist ungültig. Erwartet wird das Format XXX-123456.";
    public const string PolicyNumberDuplicate = "Diese Policennummer existiert bereits.";

    public const string ContractStartDateFormat = "Vertragsbeginn ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.";
    public const string ContractEndDateFormat = "Vertragsende ist ungültig. Bitte im Format TT.MM.JJJJ eingeben.";
    public const string EndNotAfterStart = "Das Vertragsende muss nach dem Vertragsbeginn liegen.";

    public const string AnnualPremiumInvalid = "Jahresbeitrag ist ungültig. Erlaubt sind Beträge von 0,01 bis 99999,99 (Komma als Dezimaltrenner).";

    public const string LicensePlateRequired = "Amtliches Kennzeichen ist ein Pflichtfeld für die Sparte KFZ.";
    public const string LicensePlateFormat = "Amtliches Kennzeichen ist ungültig. Erwartet wird das Format HH-AB 1234.";

    public const string DialogErrorBanner = "Bitte korrigieren Sie die markierten Eingaben. Es wurden keine Änderungen gespeichert.";

    public const string CustomerUpdated = "Änderungen wurden gespeichert.";
    public const string CustomerCreated = "Kunde wurde angelegt.";
    public const string CustomerDeleted = "Kunde wurde gelöscht.";

    public const string ContractCreated = "Vertrag wurde angelegt.";
    public const string ContractUpdated = "Vertrag wurde gespeichert.";
    public const string ContractDeleted = "Vertrag wurde gelöscht.";

    public const string CustomerHasContracts = "Der Kunde kann nicht gelöscht werden, solange ihm Verträge zugeordnet sind.";

    public const string NoCustomersFound = "Keine Kunden gefunden.";
    public const string NoContracts = "Für diesen Kunden sind keine Verträge vorhanden.";
    public const string NoExpiringContracts = "Keine Verträge laufen in den nächsten 60 Tagen aus.";
    public const string CustomerNotFound = "Kunde nicht gefunden.";
    public const string PageNotFound = "Seite nicht gefunden.";

    public static string ContractDeleteConfirm(string policyNumber) =>
        $"Möchten Sie den Vertrag {policyNumber} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.";

    public static string CustomerDeleteConfirm(string firstName, string lastName, string customerNumber) =>
        $"Möchten Sie den Kunden {firstName} {lastName} ({customerNumber}) wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.";
}

public static class FieldLabels
{
    public const string Salutation = "Anrede";
    public const string FirstName = "Vorname";
    public const string LastName = "Nachname";
    public const string BirthDate = "Geburtsdatum";
    public const string Status = "Status";
    public const string Email = "E-Mail-Adresse";
    public const string Phone = "Telefonnummer";
    public const string Street = "Straße";
    public const string HouseNumber = "Hausnummer";
    public const string PostalCode = "PLZ";
    public const string City = "Ort";

    public const string Line = "Sparte";
    public const string Insurer = "Versicherer";
    public const string PolicyNumber = "Policennummer";
    public const string StartDate = "Vertragsbeginn";
    public const string EndDate = "Vertragsende";
    public const string AnnualPremium = "Jahresbeitrag";
    public const string PaymentMode = "Zahlweise";
    public const string LicensePlate = "Amtliches Kennzeichen";
}
