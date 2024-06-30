import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private dragStartSubject = new Subject<void>();
  private dragMoveSubject = new Subject<{ x: number, y: number }>();
  private dragEndSubject = new Subject<void>();

  dragStart$ = this.dragStartSubject.asObservable();
  dragMove$ = this.dragMoveSubject.asObservable();
  dragEnd$ = this.dragEndSubject.asObservable();

  startDrag(x: number, y: number, offsetX: number, offsetY: number): void {
    this.isDragging = true;
    this.dragOffset = { x: offsetX, y: offsetY };
    this.dragStartSubject.next();
    this.moveDrag(x, y);
  }

  moveDrag(x: number, y: number): void {
    if (this.isDragging) {
      this.dragMoveSubject.next({
        x: x - this.dragOffset.x,
        y: y - this.dragOffset.y
      });
    }
  }

  endDrag(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.dragEndSubject.next();
    }
  }
}
