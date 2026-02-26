import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-flag',
  imports: [],
  templateUrl: './flag.component.html',
  styleUrl: './flag.component.css'
})
export class FlagComponent {
  countryCode = input.required<string>();
  protected lowerCountryCode = computed(() => this.countryCode().toLowerCase());
}
