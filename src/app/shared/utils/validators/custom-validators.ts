import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

export const PHONE_MIN_DIGITS = 8;
export const PHONE_MAX_DIGITS = 15;

export function normalizePhone(raw: string): string {
  return raw.toString().trim().replace(/\s+/g, '');
}

export function urlValidator(control: AbstractControl) {
  if (!control.value) return null;
  const value = control.value.trim();
  const urlRegex = /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  if (!urlRegex.test(value)) {
    return { url: true };
  }

  try {
    const urlObj = new URL(value);
    if (!urlObj.hostname.includes('.')) {
      return { url: true };
    }
    return null;
  } catch {
    return { url: true };
  }
}

export function requiredValidator(control: AbstractControl) {
  if (control.value === null || control.value === undefined) {
    return { required: true };
  }

  if (control.value.toString().trim().length === 0) {
    return { required: true };
  }

  return null;
}

export function requiredBooleanValidator(control: AbstractControl) {
  if (control.value === null || control.value === undefined) {
    return { required: true };
  }
  return null;
}

export function emailValidator(control: AbstractControl) {
  if (!control.value) return null;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(control.value.trim()) ? null : { email: true };
}

export function lettersOnlyValidator(control: AbstractControl) {
  if (!control.value) return null;
  const value = control.value.toString().trim();
  const nameRegex = /^[A-Za-z\s'-]+$/;
  return nameRegex.test(value) ? null : { lettersOnly: true };
}

export function phoneValidator(control: AbstractControl) {
  if (!control.value) return null;
  const normalized = normalizePhone(String(control.value));
  const phoneRegex = /^\+?\d{10,14}$/;
  return phoneRegex.test(normalized) ? null : { phone: { format: true } };
}

export function telephoneValidator(control: AbstractControl) {
  if (!control.value) return null;
  const normalized = normalizePhone(String(control.value));
  const phoneRegex = /^\+?\d{10,14}$/;
  return phoneRegex.test(normalized) ? null : { telephone: { format: true } };
}

export function fileTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || !(control.value instanceof File)) return null;

    const file = control.value;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    const isValid = allowedTypes.some((type) => {
      return mimeType.includes(type.replace('.', '')) || (fileExtension && type.toLowerCase().includes(fileExtension));
    });

    return isValid ? null : { fileType: { allowedTypes } };
  };
}

export function fileSizeValidator(maxSizeMB: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || !(control.value instanceof File)) return null;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return control.value.size <= maxSizeBytes ? null : { fileSize: { maxSizeMB } };
  };
}

export function minLengthValidator(min: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const trimmedValue = control.value.toString().trim();
    return trimmedValue.length >= min
      ? null
      : {
          minlength: {
            requiredLength: min,
            actualLength: trimmedValue.length
          }
        };
  };
}

export function maxLengthValidator(max: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const trimmedValue = control.value.toString().trim();
    return trimmedValue.length <= max
      ? null
      : {
          maxlength: {
            requiredLength: max,
            actualLength: trimmedValue.length
          }
        };
  };
}

export function companyNumberValidator(control: AbstractControl) {
  if (!control.value) return null;
  const regex = /^[A-Z0-9]{6,12}$/i;
  return regex.test(control.value.trim()) ? null : { companyNumber: true };
}

export function postcodeValidator(control: AbstractControl) {
  if (!control.value) return null;
  const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  return regex.test(control.value.trim().toUpperCase()) ? null : { postcode: true };
}

export function requiredDocumentsValidator(requiredTypes: string[]): ValidatorFn {
  return (formArray: AbstractControl) => {
    if (!(formArray instanceof FormArray)) return null;

    const uploadedTypes: string[] = [];
    formArray.controls.forEach((control) => {
      const docType = control.get('documentType')?.value?.value;
      if (docType && docType !== 'other') {
        uploadedTypes.push(docType);
      }
    });

    const missingDocuments = requiredTypes.filter((type) => !uploadedTypes.includes(type));

    return missingDocuments.length > 0 ? { requiredDocuments: { missing: missingDocuments } } : null;
  };
}

export function patternValidator(pattern: RegExp, errorName: string = 'pattern'): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    return pattern.test(control.value) ? null : { [errorName]: true };
  };
}

export function noNumbersValidator(control: AbstractControl) {
  if (!control.value) return null;
  const hasNumbers = /[0-9]/.test(control.value);
  return hasNumbers ? { hasNumbers: true } : null;
}

export function rangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const value = Number(control.value);
    if (isNaN(value)) return { range: { min, max } };
    return value >= min && value <= max ? null : { range: { min, max, actual: value } };
  };
}

export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    matchingControl.setErrors(null);
    return null;
  };
}

export function notFutureDateValidator(control: AbstractControl) {
  if (!control.value) return null;
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate <= today ? null : { futureDate: true };
}

export function notPastDateValidator(control: AbstractControl) {
  if (!control.value) return null;
  const inputDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today ? null : { pastDate: true };
}

export function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { minAge: { required: minAge, actual: age } };
  };
}

export function niNumberValidator(control: AbstractControl) {
  if (!control.value) return null;

  const value = control.value.toString().trim().toUpperCase().replace(/\s/g, '');
  const niRegex = /^[ABCEGHJ-PRSTW-Z][ABCEGHJ-NPRSTW-Z]\d{6}[A-D]$/;

  if (!niRegex.test(value)) {
    return { niNumber: true };
  }

  return null;
}
