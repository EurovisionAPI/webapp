import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  @Input() options: any[];
  @Input() value: number = 0;
  @Output() change = new EventEmitter<number>;

  protected changeValue(value: number) {
    this.value = value;
    this.change.emit(this.value);
  }
}
