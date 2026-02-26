import { Component, input } from '@angular/core';

@Component({
  selector: 'app-contest-title',
  imports: [],
  templateUrl: './contest-title.component.html',
  styleUrl: './contest-title.component.css'
})
export class ContestTitleComponent {
  countryCode = input.required<string>();
  city = input.required<string>();
  year = input.required<number>();
  isJunior = input<boolean>(false);
}
