import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface DragState {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  squareId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DragService {
  private dragState: DragState = { x: 0, y: 0, offsetX: 0, offsetY: 0, squareId: null };
  private dragMoveSubject = new Subject<{ x: number; y: number }>();
  private isDraggingSubject = new Subject<boolean>();

  get dragMove$(): Observable<{ x: number; y: number }> {
    return this.dragMoveSubject.asObservable();
  }

  get isDragging$(): Observable<boolean> {
    return this.isDraggingSubject.asObservable();
  }

  startDrag(x: number, y: number, offsetX: number, offsetY: number, squareId: number) {
    this.dragState = { x, y, offsetX, offsetY, squareId };
    this.isDraggingSubject.next(true);
  }

  moveDrag(x: number, y: number) {
    if (this.dragState.squareId !== null) {
      const newX = x - this.dragState.offsetX;
      const newY = y - this.dragState.offsetY;
      this.dragMoveSubject.next({ x: newX, y: newY });
    }
  }

  endDrag() {
    this.isDraggingSubject.next(false);
    this.dragState = { x: 0, y: 0, offsetX: 0, offsetY: 0, squareId: null };
  }

  get currentDragId(): number | null {
    return this.dragState.squareId;
  }

  get isDragging(): boolean {
    return this.dragState.squareId !== null;
  }
}
