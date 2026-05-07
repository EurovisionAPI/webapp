import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heart-flag',
  imports: [],
  templateUrl: './heart-flag.component.html',
  styleUrl: './heart-flag.component.css'
})
export class HeartFlagComponent {
  readonly countryCode = input.required<string, string>({
    transform: value => value.toLowerCase()
  });
}
