import {Component, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {DragService} from "../../shared/services/drag.service";
import {Subject, takeUntil} from "rxjs";
import {CanvasService} from "../../shared/services/canvas.service";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  standalone: true,
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private dragService: DragService,
    private canvasService: CanvasService
  ) {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.canvasService.initCanvas(this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.canvasService.initAnchors();
      this.canvasService.drawAll();

      this.dragService.dragMove$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(position => {
          this.canvasService.updateSquarePosition(this.dragService.currentDragId!, position.x, position.y);
          this.canvasService.drawAll();
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPointerDown(event: PointerEvent): void {
    const { x, y } = this.getCanvasCoordinates(event);
    const clickedAnchor = this.canvasService.findClickedAnchor(x, y);

    if (clickedAnchor) {
      this.canvasService.startLineDrag(clickedAnchor, x, y);
    } else {
      const square = this.canvasService.findClickedSquare(x, y);
      if (square) {
        const offsetX = x - square.x;
        const offsetY = y - square.y;
        this.dragService.startDrag(x, y, offsetX, offsetY, square.id);
        this.canvas.nativeElement.setPointerCapture(event.pointerId);
      }
    }
  }

  onPointerMove(event: PointerEvent): void {
    const { x, y } = this.getCanvasCoordinates(event);

    if (this.dragService.isDragging) {
      this.dragService.moveDrag(x, y);
    } else if (this.canvasService.isLineDragging) {
      this.canvasService.updateTempLine(x, y);
      this.canvasService.drawAll();
    }
  }

  onPointerUp(event: PointerEvent): void {
    const { x, y } = this.getCanvasCoordinates(event);

    if (this.canvasService.isLineDragging) {
      const endAnchor = this.canvasService.findClickedAnchor(x, y);
      if (endAnchor) {
        this.canvasService.createLine(endAnchor);
      }
      this.canvasService.endLineDrag();
      this.canvasService.drawAll();
    } else {
      this.dragService.endDrag();
    }

    this.canvas.nativeElement.releasePointerCapture(event.pointerId);
  }

  private getCanvasCoordinates(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
