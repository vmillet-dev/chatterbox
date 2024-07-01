import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-block',
  template: '',
  standalone: true
})
export class BlockComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() size: number = 50;
  @Input() id: number = 0;
  @Output() anchorClicked = new EventEmitter<{ anchorId: string, x: number, y: number }>();
}
