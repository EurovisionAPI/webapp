import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  readonly options = input.required<any[]>();
  readonly value = input.required<number>();
  readonly change = output<number>();

  protected changeValue(index: number) {
    this.change.emit(index);
  }
}
