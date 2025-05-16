import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-flag',
  imports: [],
  templateUrl: './flag.component.html',
  styleUrl: './flag.component.css'
})
export class FlagComponent implements OnChanges {
  @Input() countryCode: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryCode']) {
      this.countryCode = this.countryCode.toLowerCase();
    }
  }
}
