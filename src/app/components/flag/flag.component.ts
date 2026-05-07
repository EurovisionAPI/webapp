import { Component, input } from '@angular/core';

@Component({
  selector: 'app-flag',
  imports: [],
  templateUrl: './flag.component.html',
  styleUrl: './flag.component.css'
})
export class FlagComponent {
  readonly countryCode = input.required<string, string>({
    transform: value => value.toLowerCase()
  });
}
