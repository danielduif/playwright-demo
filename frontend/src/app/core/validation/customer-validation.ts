import { FieldLabels, Messages } from '../messages';
import { parseGermanDate } from './date-format';

export interface CustomerFormRawValues {
  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  status: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
}

const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_PATTERN = /^[0-9 +\-/()]{6,20}$/;

const SALUTATIONS = ['Herr', 'Frau', 'Divers'];
const STATUSES = ['Interessent', 'Aktiv', 'Inaktiv'];

export interface CustomerValidationDefects {
  ageLimitOffByOne?: boolean;
  postalCodeAllowsFourDigits?: boolean;
}

/**
 * Führt dieselben Prüfungen wie das Backend aus (ohne Eindeutigkeit, die serverseitig
 * geprüft wird). Gibt für jedes fehlerhafte Feld genau eine Meldung zurück.
 * `defects` spiegelt nur zu Demozwecken aktivierte Backend-Abweichungen (siehe README).
 */
export function validateCustomerFields(
  values: CustomerFormRawValues,
  defects: CustomerValidationDefects = {},
): Record<string, string> {
  const errors: Record<string, string> = {};

  const salutation = values.salutation.trim();
  if (!salutation || !SALUTATIONS.includes(salutation)) {
    errors['salutation'] = Messages.required(FieldLabels.salutation);
  }

  const firstName = values.firstName.trim();
  if (!firstName) {
    errors['firstName'] = Messages.required(FieldLabels.firstName);
  } else if (firstName.length < 2 || firstName.length > 50) {
    errors['firstName'] = Messages.lengthBetween(FieldLabels.firstName, 2, 50);
  }

  const lastName = values.lastName.trim();
  if (!lastName) {
    errors['lastName'] = Messages.required(FieldLabels.lastName);
  } else if (lastName.length < 2 || lastName.length > 50) {
    errors['lastName'] = Messages.lengthBetween(FieldLabels.lastName, 2, 50);
  }

  const birthDateRaw = values.birthDate.trim();
  if (!birthDateRaw) {
    errors['birthDate'] = Messages.required(FieldLabels.birthDate);
  } else {
    const birthDate = parseGermanDate(birthDateRaw);
    if (!birthDate) {
      errors['birthDate'] = Messages.birthDateFormat;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (birthDate.getTime() > today.getTime()) {
        errors['birthDate'] = Messages.birthDateFuture;
      } else {
        const minAge = defects.ageLimitOffByOne ? 17 : 18;
        const latestValidBirthDate = new Date(today);
        latestValidBirthDate.setFullYear(latestValidBirthDate.getFullYear() - minAge);
        if (birthDate.getTime() > latestValidBirthDate.getTime()) {
          errors['birthDate'] = Messages.birthDateUnderage;
        }
      }
    }
  }

  const status = values.status.trim();
  if (!status || !STATUSES.includes(status)) {
    errors['status'] = Messages.required(FieldLabels.status);
  }

  const email = values.email.trim();
  if (!email) {
    errors['email'] = Messages.required(FieldLabels.email);
  } else if (!EMAIL_PATTERN.test(email)) {
    errors['email'] = Messages.emailInvalid;
  } else if (email.length > 100) {
    errors['email'] = Messages.lengthMax(FieldLabels.email, 100);
  }

  const phone = values.phone.trim();
  if (phone.length > 0 && !PHONE_PATTERN.test(phone)) {
    errors['phone'] = Messages.phoneInvalid;
  }

  const street = values.street.trim();
  if (!street) {
    errors['street'] = Messages.required(FieldLabels.street);
  } else if (street.length > 80) {
    errors['street'] = Messages.lengthMax(FieldLabels.street, 80);
  }

  const houseNumber = values.houseNumber.trim();
  if (!houseNumber) {
    errors['houseNumber'] = Messages.required(FieldLabels.houseNumber);
  } else if (houseNumber.length > 10) {
    errors['houseNumber'] = Messages.lengthMax(FieldLabels.houseNumber, 10);
  }

  const postalCode = values.postalCode.trim();
  if (!postalCode) {
    errors['postalCode'] = Messages.required(FieldLabels.postalCode);
  } else if (!(defects.postalCodeAllowsFourDigits ? /^\d{4,5}$/ : /^\d{5}$/).test(postalCode)) {
    errors['postalCode'] = Messages.postalCodeInvalid;
  }

  const city = values.city.trim();
  if (!city) {
    errors['city'] = Messages.required(FieldLabels.city);
  } else if (city.length > 50) {
    errors['city'] = Messages.lengthMax(FieldLabels.city, 50);
  }

  return errors;
}
