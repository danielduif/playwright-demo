# Makler-CRM (Demo)

Schlankes CRM für Versicherungsmakler. Dient ausschließlich als **Testobjekt für eine Demo von
Playwright und dem Playwright MCP Server** – die fachliche Spezifikation liegt unter
[`docs/spezifikation.pdf`](docs/spezifikation.pdf). Alle Daten sind fiktiv.

## Voraussetzungen

- .NET SDK 10 (oder .NET 8, falls 10 nicht verfügbar ist)
- Node.js 20+ und npm

Keine weiteren Installationen (kein Docker, keine externe Datenbank).

## Starten

**Backend** (Port `5080`, SQLite-Datei `makler-crm.db` wird beim ersten Start automatisch
angelegt und mit den Ausgangsdaten befüllt):

```bash
cd backend/MaklerCrm.Api
dotnet run
```

**Frontend** (Port `4200`, leitet `/api` per `proxy.conf.json` an das Backend weiter):

```bash
cd frontend
npm install
npm start
```

Anwendung danach unter <http://localhost:4200> öffnen.

## URLs

| Zweck | URL |
|---|---|
| Frontend | http://localhost:4200 |
| Backend-API | http://localhost:5080/api |
| Swagger/OpenAPI (nur Development) | http://localhost:5080/swagger |
| Datenbank zurücksetzen (nur Development) | `POST http://localhost:5080/api/test/reset` |

`POST /api/test/reset` setzt die Datenbank jederzeit auf den in der Spezifikation definierten
Ausgangsdatenbestand zurück (6 Kunden, 7 Verträge). Vertragsdaten sind relativ zum
Systemdatum berechnet, damit die Kennzahlen der Startseite stabil bleiben.

## Seiten

| Seite | Pfad | Inhalt |
|---|---|---|
| Startseite | `/` | Kennzahlen-Kacheln, Tabelle „Bald auslaufende Verträge", Kunde anlegen |
| Kundenliste | `/kunden` | Suche, Statusfilter, Sortierung, Kunde anlegen |
| Kundendetail | `/kunden/{id}` | Stammdaten, Kontakt & Adresse, Verträge, Bearbeiten/Löschen |
| Nicht gefunden | (alle anderen Routen) | Hinweis mit Link zur Startseite |

Kernszenario der Demo: die Bearbeiten-Dialoge für Stammdaten, Kontakt & Adresse sowie Verträge.
Der Speichern-Button ist immer aktiv; ungültige Eingaben öffnen ein Warnbanner
(`role="alert"`) plus Feldmeldung, gültige Eingaben schließen den Dialog mit einer Snackbar
(`role="status"`, verschwindet nach 4 Sekunden).

## `data-testid`-Konvention

Alle interaktiven Elemente sind zusätzlich zu semantischem HTML und ARIA-Attributen über
`data-testid` (kebab-case) ansprechbar, u. a.:

- `dashboard-tile-{customers-total|customers-active|contracts-active|contracts-expiring|premium-volume}`
- `customer-row-{customerNumber}`, `contract-row-{policyNumber}`
- `card-master-data`, `card-contact`, `btn-edit-master-data`, `btn-edit-contact`
- `dialog-{name}` (z. B. `dialog-master-data`, `dialog-contract`, `dialog-customer-create`)
- `field-{fieldName}`, `error-{fieldName}`, `dialog-error-banner`
- `btn-save`, `btn-cancel`, `btn-close`
- `btn-delete-contract-{policyNumber}`, `btn-delete-customer`
- `snackbar`

Datumsfelder sind bewusst normale Textfelder (Platzhalter `TT.MM.JJJJ`, kein Datepicker), damit
auch ungültige Werte eingegeben werden können. Formulare tragen `novalidate`, damit ausschließlich
die eigenen Meldungstexte erscheinen.

## Architektur

```
docs/                    Fachliche Spezifikation (PDF)
backend/MaklerCrm.Api/    ASP.NET Core Minimal API, EF Core + SQLite
  Models/                 Domänenmodell, Lookups, abgeleiteter Vertragsstatus
  Data/                    DbContext, Seed-/Reset-Logik, Kundennummern-Generator
  Validation/              Zentraler Meldungskatalog + Validatoren (Kunde, Vertrag)
  Dtos/                    Request-/Response-DTOs, Mapping
  Endpoints/               Minimal-API-Endpunkte je Ressource
frontend/                 Angular (Standalone Components, Reactive Forms wo passend)
  src/app/core/            Modelle, Services, zentraler Meldungskatalog, Validierung
  src/app/pages/           Startseite, Kundenliste, Kundendetail, Nicht gefunden
  src/app/dialogs/         Anlegen/Bearbeiten-Dialoge, Bestätigungsdialog
```

Client- und Server-Validierung verwenden dieselben Regeln und wortgleiche Meldungstexte
(`backend/MaklerCrm.Api/Validation/Messages.cs` bzw. `frontend/src/app/core/messages.ts`).
Der Server ist dabei verbindlich: bei jedem Speichern wird — sobald die clientseitige Prüfung
keine Fehler findet — tatsächlich die API aufgerufen; nur so werden serverseitige Prüfungen wie
eindeutige E-Mail-Adressen oder Policennummern zuverlässig erkannt.

## API (Auszug)

```
GET    /api/dashboard
GET    /api/lookups
GET    /api/customers?search=&status=
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}/master-data
PUT    /api/customers/{id}/contact
DELETE /api/customers/{id}                   (409, wenn Verträge vorhanden)
POST   /api/customers/{id}/contracts
PUT    /api/contracts/{id}
DELETE /api/contracts/{id}
POST   /api/test/reset                       (nur Development)
```

Validierungsfehler kommen als `400` mit `errors: { "<feldname>": ["<Meldung>"] }` zurück
(ASP.NET `ValidationProblemDetails`), unbekannte IDs als `404`, blockierte Löschungen als `409`.

## Nur für Demozwecke: `DemoDefects`

Über den Konfigurationsabschnitt `DemoDefects` (in `appsettings.json` oder per Umgebungsvariable,
Standard überall `false`) lassen sich gezielt kleine Abweichungen von der Spezifikation im
**Backend** einschalten, damit sich in der Demo zeigen lässt, dass aus der Spezifikation
abgeleitete Tests echte Fehler finden. Das Frontend liest die aktiven Schalter über
`GET /api/lookups` (Feld `demoDefects`) und lockert die betroffene Clientprüfung entsprechend,
damit der Defekt auch in der UI sichtbar wird.

| Schalter | Auswirkung |
|---|---|
| `DemoDefects__AgeLimitOffByOne` | Kunden mit 17 Jahren werden akzeptiert |
| `DemoDefects__PostalCodeAllowsFourDigits` | PLZ mit 4 Ziffern wird akzeptiert |
| `DemoDefects__EndDateMayEqualStartDate` | Vertragsende am selben Tag wie der Beginn wird akzeptiert |
| `DemoDefects__DeleteIgnoresContracts` | Kunden mit Verträgen werden trotzdem gelöscht |

Beispiel (Linux/macOS):

```bash
DemoDefects__AgeLimitOffByOne=true dotnet run
```

## Nicht-Ziele

Keine Authentifizierung, kein Rollenkonzept, keine E-Mail-Funktionen, kein Dokumentenupload,
kein Mobile-Layout, kein Dark Mode, keine Mehrsprachigkeit. Die Anwendung enthält bewusst keine
automatisierten Tests und keine Playwright-Konfiguration — diese entstehen später in der Demo.
