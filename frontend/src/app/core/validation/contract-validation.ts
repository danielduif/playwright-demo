import { FieldLabels, Messages } from '../messages';
import { parseGermanDate } from './date-format';
import { parseGermanMoney } from './money-format';

export interface ContractFormRawValues {
  line: string;
  insurer: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  annualPremium: string;
  paymentMode: string;
  licensePlate: string;
}

const POLICY_NUMBER_PATTERN = /^[A-Z]{3}-\d{6}$/;
const LICENSE_PLATE_PATTERN = /^[A-Z]{1,3}-[A-Z]{1,2} \d{1,4}$/;

const LINES = ['Haftpflicht', 'Hausrat', 'KFZ', 'Rechtsschutz', 'Berufsunfähigkeit', 'Leben', 'Wohngebäude'];
const INSURERS = ['Nordstern Versicherung', 'Hanseatische Assekuranz', 'Alpen Direkt', 'Rheinland Schutz'];
const PAYMENT_MODES = ['monatlich', 'vierteljährlich', 'halbjährlich', 'jährlich'];

export interface ContractValidationDefects {
  endDateMayEqualStartDate?: boolean;
}

/**
 * Führt dieselben Prüfungen wie das Backend aus (ohne Eindeutigkeit der Policennummer,
 * die serverseitig geprüft wird). Gibt für jedes fehlerhafte Feld genau eine Meldung zurück.
 * `defects` spiegelt nur zu Demozwecken aktivierte Backend-Abweichungen (siehe README).
 */
export function validateContractFields(
  values: ContractFormRawValues,
  defects: ContractValidationDefects = {},
): Record<string, string> {
  const errors: Record<string, string> = {};

  const line = values.line.trim();
  if (!line || !LINES.includes(line)) {
    errors['line'] = Messages.required(FieldLabels.line);
  }

  const insurer = values.insurer.trim();
  if (!insurer || !INSURERS.includes(insurer)) {
    errors['insurer'] = Messages.required(FieldLabels.insurer);
  }

  const policyNumber = values.policyNumber.trim();
  if (!policyNumber) {
    errors['policyNumber'] = Messages.required(FieldLabels.policyNumber);
  } else if (!POLICY_NUMBER_PATTERN.test(policyNumber)) {
    errors['policyNumber'] = Messages.policyNumberFormat;
  }

  const startDateRaw = values.startDate.trim();
  let startDate: Date | null = null;
  if (!startDateRaw) {
    errors['startDate'] = Messages.required(FieldLabels.startDate);
  } else {
    startDate = parseGermanDate(startDateRaw);
    if (!startDate) {
      errors['startDate'] = Messages.contractStartDateFormat;
    }
  }

  const endDateRaw = values.endDate.trim();
  let endDate: Date | null = null;
  if (endDateRaw) {
    endDate = parseGermanDate(endDateRaw);
    if (!endDate) {
      errors['endDate'] = Messages.contractEndDateFormat;
    }
  }

  if (startDate && endDate) {
    const isInvalid = defects.endDateMayEqualStartDate
      ? endDate.getTime() < startDate.getTime()
      : endDate.getTime() <= startDate.getTime();
    if (isInvalid) {
      errors['endDate'] = Messages.endNotAfterStart;
    }
  }

  const annualPremiumRaw = values.annualPremium.trim();
  if (!annualPremiumRaw) {
    errors['annualPremium'] = Messages.required(FieldLabels.annualPremium);
  } else {
    const amount = parseGermanMoney(annualPremiumRaw);
    if (amount === null || amount < 0.01 || amount > 99999.99) {
      errors['annualPremium'] = Messages.annualPremiumInvalid;
    }
  }

  const paymentMode = values.paymentMode.trim();
  if (!paymentMode || !PAYMENT_MODES.includes(paymentMode)) {
    errors['paymentMode'] = Messages.required(FieldLabels.paymentMode);
  }

  if (line === 'KFZ') {
    const licensePlate = values.licensePlate.trim();
    if (!licensePlate) {
      errors['licensePlate'] = Messages.licensePlateRequired;
    } else if (!LICENSE_PLATE_PATTERN.test(licensePlate)) {
      errors['licensePlate'] = Messages.licensePlateFormat;
    }
  }

  return errors;
}
