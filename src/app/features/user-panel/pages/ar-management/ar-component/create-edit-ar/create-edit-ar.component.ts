import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-create-edit-ar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './create-edit-ar.component.html'
})
export class CreateEditArComponent {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  stepIndex = 0;
  steps = ['Company', 'Address', 'Contact', 'Links', 'Documents'];

  readonly principalArOptions = [
    { label: 'David Sharma', value: 'David Sharma' },
    { label: 'Raghav Sharma', value: 'Raghav Sharma' },
    { label: 'Aryan Kundal', value: 'Aryan Kundal' },
    { label: 'Anamika', value: 'Anamika' }
  ];

  form = {
    companyName: '',
    companyTitle: '',
    companyNumber: '',
    principalAr: '',
    credits: '200',
    addressLine1: '',
    city: '',
    postcode: '',
    country: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    linkedIn: '',
    notes: ''
  };

  get stepLabel(): string {
    return this.steps[this.stepIndex];
  }

  get isLastStep(): boolean {
    return this.stepIndex === this.steps.length - 1;
  }

  get completionRatio(): number {
    return (this.stepIndex + 1) / this.steps.length;
  }

  previousStep(): void {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
    }
  }

  nextStep(): void {
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex += 1;
      return;
    }

    this.save.emit({ ...this.form });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
