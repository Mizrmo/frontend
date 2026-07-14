import { formatGhanaPhoneNumber } from '../api/utils';

const MIN_DRIVER_AGE = 18;
const MIN_VEHICLE_YEAR = 1990;

export type DriverFormInput = {
  dob: Date;
  emergencyContact: string;
  licenceNumber: string;
  dateIssued: Date;
  expiryDate: Date;
  ghanaCardNumber: string;
};

export type VehicleFormInput = {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
};

export type DriverFormValidationResult =
  | {
      ok: true;
      emergencyContact: string;
      ghanaCardNumber: string;
      licensePlate: string;
    }
  | { ok: false; message: string };

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

export function isValidFormDate(date?: Date): boolean {
  return Boolean(date && !Number.isNaN(date.getTime()) && date.getFullYear() > 1970);
}

export function isValidGhanaPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('233')) {
    return digits.length === 12;
  }

  if (digits.startsWith('0')) {
    return digits.length === 10;
  }

  return digits.length === 9;
}

export function normalizeGhanaCardNumber(value: string): string {
  const upper = value.trim().toUpperCase().replace(/\s/g, '');
  const match = upper.match(/^GHA-?(\d{9})-?(\d)$/);

  if (match) {
    return `GHA-${match[1]}-${match[2]}`;
  }

  return upper;
}

export function isValidGhanaCardNumber(value: string): boolean {
  return /^GHA-\d{9}-\d$/.test(normalizeGhanaCardNumber(value));
}

export function normalizeGhanaLicensePlate(plate: string): string {
  const cleaned = plate.trim().toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^GR-?(\d{1,4})-?(\d{2})$/);

  if (match) {
    return `GR-${match[1]}-${match[2]}`;
  }

  return plate.trim().toUpperCase();
}

export function isValidGhanaLicensePlate(plate: string): boolean {
  return /^GR-\d{1,4}-\d{2}$/.test(normalizeGhanaLicensePlate(plate));
}

export function getDefaultDriverDob(): Date {
  return addYears(new Date(), -25);
}

type StepValidationResult = { ok: true } | { ok: false; message: string };

function validateDob(dob: Date): StepValidationResult {
  const today = startOfDay(new Date());

  if (!isValidFormDate(dob)) {
    return { ok: false, message: 'Enter a valid date of birth.' };
  }

  const value = startOfDay(dob);
  if (value >= today) {
    return { ok: false, message: 'Date of birth must be in the past.' };
  }

  const youngestAllowedDob = startOfDay(addYears(today, -MIN_DRIVER_AGE));
  if (value > youngestAllowedDob) {
    return {
      ok: false,
      message: `You must be at least ${MIN_DRIVER_AGE} years old to register as a driver.`,
    };
  }

  return { ok: true };
}

export function validatePersonalStep(dob: Date, emergencyContact: string): StepValidationResult {
  const dobResult = validateDob(dob);
  if (!dobResult.ok) {
    return dobResult;
  }

  if (!emergencyContact.trim()) {
    return { ok: false, message: 'Enter an emergency contact number.' };
  }

  if (!isValidGhanaPhoneNumber(emergencyContact)) {
    return {
      ok: false,
      message: 'Enter a valid Ghana emergency contact number (e.g. 024 123 4567).',
    };
  }

  return { ok: true };
}

export function validateLicenceStep(
  driver: Pick<DriverFormInput, 'dob' | 'licenceNumber' | 'dateIssued' | 'expiryDate'>,
  hasFrontPhoto: boolean,
  hasBackPhoto: boolean
): StepValidationResult {
  const dobResult = validateDob(driver.dob);
  if (!dobResult.ok) {
    return dobResult;
  }

  const today = startOfDay(new Date());
  const dob = startOfDay(driver.dob);

  if (!driver.licenceNumber.trim()) {
    return { ok: false, message: 'Enter your driver licence number.' };
  }

  if (driver.licenceNumber.trim().length < 5) {
    return { ok: false, message: 'Enter a valid driver licence number.' };
  }

  if (!isValidFormDate(driver.dateIssued)) {
    return { ok: false, message: 'Enter a valid licence issued date.' };
  }

  const issued = startOfDay(driver.dateIssued);
  if (issued > today) {
    return { ok: false, message: 'Licence issued date cannot be in the future.' };
  }

  if (issued < dob) {
    return { ok: false, message: 'Licence issued date cannot be before your date of birth.' };
  }

  if (!isValidFormDate(driver.expiryDate)) {
    return { ok: false, message: 'Enter a valid licence expiry date.' };
  }

  const expiry = startOfDay(driver.expiryDate);
  if (expiry <= today) {
    return { ok: false, message: 'Licence expiry date must be in the future.' };
  }

  if (expiry <= issued) {
    return { ok: false, message: 'Licence expiry date must be after the issued date.' };
  }

  if (!hasFrontPhoto || !hasBackPhoto) {
    return {
      ok: false,
      message: 'Upload front and back photos of your driver licence.',
    };
  }

  return { ok: true };
}

export function validateGhanaCardStep(
  ghanaCardNumber: string,
  hasFrontPhoto: boolean,
  hasBackPhoto: boolean
): StepValidationResult {
  if (!ghanaCardNumber.trim()) {
    return { ok: false, message: 'Enter your Ghana Card number.' };
  }

  if (!isValidGhanaCardNumber(ghanaCardNumber)) {
    return {
      ok: false,
      message: 'Enter a valid Ghana Card number (e.g. GHA-123456789-0).',
    };
  }

  if (!hasFrontPhoto || !hasBackPhoto) {
    return {
      ok: false,
      message: 'Upload front and back photos of your Ghana Card.',
    };
  }

  return { ok: true };
}

export function validateVehicleStep(vehicle: VehicleFormInput): StepValidationResult {
  const today = startOfDay(new Date());

  if (!vehicle.make.trim() || !vehicle.model.trim()) {
    return { ok: false, message: 'Enter your vehicle make and model.' };
  }

  if (!vehicle.licensePlate.trim()) {
    return { ok: false, message: 'Enter your vehicle license plate.' };
  }

  const year = Number(vehicle.year);
  const currentYear = today.getFullYear();
  if (!Number.isInteger(year) || year < MIN_VEHICLE_YEAR || year > currentYear + 1) {
    return {
      ok: false,
      message: `Enter a valid vehicle year between ${MIN_VEHICLE_YEAR} and ${currentYear + 1}.`,
    };
  }

  if (!isValidGhanaLicensePlate(vehicle.licensePlate)) {
    return {
      ok: false,
      message: 'Enter a valid license plate (e.g. GR-4521-20).',
    };
  }

  return { ok: true };
}

export function validateDriverRegistrationForm(
  driver: DriverFormInput,
  vehicle: VehicleFormInput
): DriverFormValidationResult {
  const personal = validatePersonalStep(driver.dob, driver.emergencyContact);
  if (!personal.ok) {
    return personal;
  }

  const licence = validateLicenceStep(driver, true, true);
  if (!licence.ok) {
    return licence;
  }

  const ghanaCard = validateGhanaCardStep(driver.ghanaCardNumber, true, true);
  if (!ghanaCard.ok) {
    return ghanaCard;
  }

  const vehicleResult = validateVehicleStep(vehicle);
  if (!vehicleResult.ok) {
    return vehicleResult;
  }

  return {
    ok: true,
    emergencyContact: formatGhanaPhoneNumber(driver.emergencyContact),
    ghanaCardNumber: normalizeGhanaCardNumber(driver.ghanaCardNumber),
    licensePlate: normalizeGhanaLicensePlate(vehicle.licensePlate),
  };
}
