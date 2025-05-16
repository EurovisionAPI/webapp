import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heart-flag',
  imports: [],
  templateUrl: './heart-flag.component.html',
  styleUrl: './heart-flag.component.css'
})
export class HeartFlagComponent {
  @Input()
  countryCode: string;
}
