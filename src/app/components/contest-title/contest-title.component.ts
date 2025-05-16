import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contest-title',
  imports: [],
  templateUrl: './contest-title.component.html',
  styleUrl: './contest-title.component.css'
})
export class ContestTitleComponent {
  @Input()
  countryCode: string;

  @Input()
  city: string;

  @Input()
  year: number; 
}
