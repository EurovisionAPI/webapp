import { Component, computed, input, Input } from '@angular/core';

@Component({
  selector: 'app-heart-flag',
  imports: [],
  templateUrl: './heart-flag.component.html',
  styleUrl: './heart-flag.component.css'
})
export class HeartFlagComponent {
  countryCode = input.required<string>();
  protected lowerCountryCode = computed(() => this.countryCode().toLowerCase());
}
