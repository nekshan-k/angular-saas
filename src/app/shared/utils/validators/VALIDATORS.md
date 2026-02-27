# Validators Guide

This folder contains reusable validator functions.

Use them by importing only what you need.

## Common direct validators

- `urlValidator`
- `requiredValidator`
- `requiredBooleanValidator`
- `emailValidator`
- `lettersOnlyValidator`
- `phoneValidator`
- `telephoneValidator`
- `companyNumberValidator`
- `postcodeValidator`
- `noNumbersValidator`
- `notFutureDateValidator`
- `notPastDateValidator`
- `niNumberValidator`

These are used directly in a control validator array.

## Validator factories

- `fileTypeValidator(allowedTypes)`
- `fileSizeValidator(maxSizeMB)`
- `minLengthValidator(min)`
- `maxLengthValidator(max)`
- `requiredDocumentsValidator(requiredTypes)`
- `patternValidator(pattern, errorName?)`
- `rangeValidator(min, max)`
- `matchValidator(controlName, matchingControlName)`
- `minAgeValidator(minAge)`

These return `ValidatorFn` and are used when configuration is needed.

## Utilities

- `PHONE_MIN_DIGITS`
- `PHONE_MAX_DIGITS`
- `normalizePhone(raw)`

## Example

```ts
import { emailValidator, minLengthValidator } from 'src/app/shared/utils/validators/custom-validators';

email: ['', [emailValidator]],
password: ['', [minLengthValidator(8)]],
```
