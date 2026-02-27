import { Component, Input, forwardRef, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { eyeIcon, eyeOffIcon } from '../icon/icons';
import intlTelInput from 'intl-tel-input';

export type InputType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'phone' 
  | 'textarea' 
  | 'first-name' 
  | 'full-name' 
  | 'dropdown';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium mb-1.5 text-label-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>

      <div *ngIf="inputType !== 'textarea' && inputType !== 'dropdown' && inputType !== 'phone'" class="relative">
        <input
          #inputElement
          [id]="id"
          [type]="currentType"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlurHandler()"
          [class]="inputClasses"
        />
        
        <button 
          *ngIf="inputType === 'password'" 
          type="button"
          (click)="togglePasswordVisibility()"
          class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:opacity-70 transition-opacity text-placeholder"
        >
          <app-icon [icon]="showPassword ? eyeOffIcon : eyeIcon" [size]="20" color="currentColor"></app-icon>
        </button>

        <div *ngIf="error && touched && inputType !== 'password'" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <div *ngIf="inputType === 'phone'" class="relative">
        <input
          #phoneInput
          [id]="id"
          type="tel"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlurHandler()"
          [class]="inputClasses"
        />
        <div *ngIf="error && touched" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <div *ngIf="inputType === 'textarea'" class="relative">
        <textarea
          [id]="id"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onTextareaInput($event)"
          (blur)="onBlurHandler()"
          [rows]="rows"
          [class]="textareaClasses"
        ></textarea>
        <div *ngIf="maxWords" class="absolute bottom-2 right-2 text-xs" [class.text-red-500]="wordCount > maxWords" [class.text-placeholder]="wordCount <= maxWords">
          {{ wordCount }} / {{ maxWords }} words
        </div>
      </div>

      <div *ngIf="inputType === 'dropdown'" class="relative">
        <select
          [id]="id"
          [disabled]="disabled"
          [value]="value"
          (change)="onDropdownChange($event)"
          (blur)="onBlurHandler()"
          [class]="inputClasses"
        >
          <option value="" disabled selected>{{ placeholder || 'Select an option' }}</option>
          <option *ngFor="let option of dropdownOptions" [value]="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <p *ngIf="error && touched" class="mt-1 text-sm text-red-500">{{ error }}</p>
      <p *ngIf="hint && !error" class="mt-1 text-sm text-placeholder">{{ hint }}</p>
    </div>
  `,
  styles: [`
    :host ::ng-deep .iti {
      width: 100%;
      display: block;
    }
    :host ::ng-deep .iti__tel-input {
      width: 100%;
      padding-left: 52px;
    }
    :host ::ng-deep .iti__country-list {
      max-width: 350px;
      z-index: 1000;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }
    :host ::ng-deep .iti__country {
      padding: 8px 12px;
    }
    :host ::ng-deep .iti__country:hover {
      background-color: #f3f4f6;
    }
    :host ::ng-deep .iti__selected-country {
      padding: 0;
    }
    :host ::ng-deep .iti__selected-flag {
      padding: 0 0 0 12px;
    }
    :host ::ng-deep .iti__arrow {
      margin-left: 6px;
    }
  `]
})
export class InputComponent implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit {
  @ViewChild('phoneInput') phoneInputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  @Input() id: string = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label: string = '';
  @Input() inputType: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() rows: number = 4;
  @Input() maxWords: number = 0;
  @Input() dropdownOptions: DropdownOption[] = [];

  value: string = '';
  touched: boolean = false;
  showPassword: boolean = false;
  eyeIcon = eyeIcon();
  eyeOffIcon = eyeOffIcon();
  wordCount: number = 0;
  currentType: string = 'text';
  
  private iti: any;

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    this.currentType = this.inputType === 'password' ? 'password' : 
                       this.inputType === 'email' ? 'email' : 'text';
  }

  ngAfterViewInit(): void {
    if (this.inputType === 'phone' && this.phoneInputElement) {
      setTimeout(() => {
        this.initPhoneInput();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.iti) {
      this.iti.destroy();
    }
  }

  private initPhoneInput(): void {
    if (this.phoneInputElement?.nativeElement) {
      this.iti = intlTelInput(this.phoneInputElement.nativeElement, {
        initialCountry: 'in',
        separateDialCode: true,
        formatOnDisplay: true,
        nationalMode: false,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@25.14.1/build/js/utils.js'
      } as any);
      this.phoneInputElement.nativeElement.addEventListener('countrychange', () => {
        this.validatePhone();
      });
    }
  }

  private validatePhone(): void {
    if (this.iti) {
      const isValid = this.iti.isValidNumber();
      if (!isValid && this.value) {
        this.error = 'Invalid phone number for selected country';
      } else {
        this.error = '';
      }
    }
  }

  get inputClasses(): string {
    const baseClasses = 'block w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg'
    };

    const stateClasses = this.error && this.touched
      ? 'border-error focus:border-error'
      : 'border-borderclr focus:border-primary-2';

    const disabledClass = this.disabled ? 'bg-disabled cursor-not-allowed' : 'bg-white';
    const passwordPadding = this.inputType === 'password' ? 'pr-10' : '';

    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${disabledClass} ${passwordPadding}`;
  }

  get textareaClasses(): string {
    const baseClasses = 'block w-full rounded-lg border shadow-sm focus:outline-none transition-all duration-200 resize-none';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg'
    };

    const stateClasses = this.error && this.touched
      ? 'border-error focus:border-error'
      : 'border-borderclr focus:border-primary-2';

    const disabledClass = this.disabled ? 'bg-disabled cursor-not-allowed' : 'bg-white';

    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${disabledClass}`;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.currentType = this.showPassword ? 'text' : 'password';
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    switch (this.inputType) {
      case 'first-name':
        newValue = newValue.replace(/[^a-zA-Z]/g, '');
        input.value = newValue;
        break;
      
      case 'full-name':
        newValue = newValue.replace(/[^a-zA-Z\s]/g, '');
        input.value = newValue;
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (newValue && !emailRegex.test(newValue)) {
          this.error = 'Please enter a valid email address';
        } else {
          this.error = '';
        }
        break;
      
      case 'phone':
        if (this.iti) {
          this.validatePhone();
        }
        break;
    }

    this.value = newValue;
    this.onChange(this.value);
    this.touched = true;
  }

  onTextareaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    let newValue = textarea.value;

    if (this.maxWords > 0) {
      const words = newValue.trim().split(/\s+/).filter(word => word.length > 0);
      this.wordCount = words.length;

      if (this.wordCount > this.maxWords) {
        const limitedWords = words.slice(0, this.maxWords);
        newValue = limitedWords.join(' ');
        textarea.value = newValue;
        this.wordCount = this.maxWords;
      }
    }

    this.value = newValue;
    this.onChange(this.value);
    this.touched = true;
  }

  onDropdownChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.onChange(this.value);
    this.touched = true;
  }

  onBlurHandler(): void {
    this.touched = true;
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
    if (this.inputType === 'textarea' && this.maxWords > 0) {
      const words = this.value.trim().split(/\s+/).filter(word => word.length > 0);
      this.wordCount = words.length;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
