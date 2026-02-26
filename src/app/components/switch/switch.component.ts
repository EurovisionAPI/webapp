import { Component, EventEmitter, input, output, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  options = input.required<any[]>();
  value = input.required<number>();
  change = output<number>();

  protected changeValue(index: number) {
    this.change.emit(index);
  }
}
