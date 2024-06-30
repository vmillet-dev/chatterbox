import {Component, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {DragService} from "../../shared/services/drag.service";
import {Subject, takeUntil} from "rxjs";

interface Point {
  x: number;
  y: number;
}

interface Square {
  x: number;
  y: number;
  size: number;
  id: number;
  anchors: Anchor[];
}

interface Anchor {
  id: string;
  squareId: number;
  x: number;
  y: number;
}

interface Line {
  startAnchorId: string;
  endAnchorId: string;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  standalone: true,
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private squares: Square[] = [
    { x: 50, y: 50, size: 50, id: 1, anchors: [] },
    { x: 200, y: 200, size: 50, id: 2, anchors: [] }
  ];
  private anchors: Anchor[] = [];
  private selectedAnchors: Anchor[] = [];
  private lines: Line[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private dragService: DragService) {}

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d')!;
      this.initAnchors();
      this.drawSquaresAndLines();

      this.dragService.dragMove$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(position => {
          const square = this.squares.find(s => s.id === this.dragService.currentDragId);
          if (square) {
            square.x = position.x;
            square.y = position.y;
            this.updateAnchors(square.id, position.x, position.y);
            // this.updateLines();
            this.drawSquaresAndLines();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initAnchors() {
    this.squares.forEach(square => {
      square.anchors = [
        { id: `${square.id}-left`, squareId: square.id, x: square.x, y: square.y + square.size / 2 },
        { id: `${square.id}-right`, squareId: square.id, x: square.x + square.size, y: square.y + square.size / 2 },
        { id: `${square.id}-top`, squareId: square.id, x: square.x + square.size / 2, y: square.y },
        { id: `${square.id}-bottom`, squareId: square.id, x: square.x + square.size / 2, y: square.y + square.size }
      ];
    });
    this.anchors = this.squares.flatMap(square => square.anchors);
  }

  private updateAnchors(squareId: number, newX: number, newY: number) {
    const square = this.squares.find(s => s.id === squareId);
    if (square) {
      const halfSize = square.size / 2;
      square.anchors = [
        { id: `${square.id}-left`, squareId: square.id, x: square.x, y: square.y + square.size / 2 },
        { id: `${square.id}-right`, squareId: square.id, x: square.x + square.size, y: square.y + square.size / 2 },
        { id: `${square.id}-top`, squareId: square.id, x: square.x + square.size / 2, y: square.y },
        { id: `${square.id}-bottom`, squareId: square.id, x: square.x + square.size / 2, y: square.y + square.size }
      ];
      this.anchors = this.squares.flatMap(s => s.anchors);
    }
  }

  // private updateLines() {
  //   this.lines = this.lines.map(line => ({
  //     start: this.findUpdatedAnchor(line.start),
  //     end: this.findUpdatedAnchor(line.end)
  //   }));
  // }

  private findUpdatedAnchor(oldAnchor: Anchor): Anchor {
    const square = this.squares.find(s => s.id === oldAnchor.squareId);
    if (square) {
      return square.anchors.find(anchor =>
        this.getAnchorPosition(anchor, square) === this.getAnchorPosition(oldAnchor, square)
      ) || oldAnchor;
    }
    return oldAnchor;
  }

  private getAnchorPosition(anchor: Anchor, square: Square): string {
    if (anchor.x === square.x) return 'left';
    if (anchor.x === square.x + square.size) return 'right';
    if (anchor.y === square.y) return 'top';
    if (anchor.y === square.y + square.size) return 'bottom';
    return '';
  }

  private isSameAnchor(anchor1: Anchor, anchor2: Anchor): boolean {
    return anchor1.squareId === anchor2.squareId && Math.abs(anchor1.x - anchor2.x) < 1 && Math.abs(anchor1.y - anchor2.y) < 1;
  }

  private drawSquaresAndLines() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.lines.forEach(line => this.drawLine(line));
      this.squares.forEach(square => this.drawSquare(square));
      this.anchors.forEach(anchor => this.drawAnchor(anchor));
    }
  }

  private drawSquare(square: Square) {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(square.x, square.y, square.size, square.size);
  }

  private drawLine(line: Line) {
    const startAnchor = this.anchors.find(a => a.id === line.startAnchorId);
    const endAnchor = this.anchors.find(a => a.id === line.endAnchorId);
    if (startAnchor && endAnchor) {
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(startAnchor.x, startAnchor.y);
      this.ctx.lineTo(endAnchor.x, endAnchor.y);
      this.ctx.stroke();
    }
  }

  private drawAnchor(anchor: Anchor) {
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(anchor.x, anchor.y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  private startDrag(clientX: number, clientY: number) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (const square of this.squares) {
      const offsetX = x - square.x;
      const offsetY = y - square.y;
      if (x > square.x && x < square.x + square.size &&
        y > square.y && y < square.y + square.size) {
        this.dragService.startDrag(x, y, offsetX, offsetY, square.id);
        this.canvas.nativeElement.setPointerCapture((<PointerEvent>event).pointerId);
        return;
      }
    }
  }

  private selectAnchor(clientX: number, clientY: number) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const selectedAnchor = this.anchors.find(anchor =>
      Math.abs(anchor.x - x) < 5 && Math.abs(anchor.y - y) < 5
    );
    if (selectedAnchor) {
      if (this.selectedAnchors.length === 1 && this.selectedAnchors[0].squareId === selectedAnchor.squareId) {
        // Don't allow connecting anchors from the same square
        return;
      }
      this.selectedAnchors.push(selectedAnchor);
      if (this.selectedAnchors.length === 2) {
        this.lines.push({
          startAnchorId: this.selectedAnchors[0].id,
          endAnchorId: this.selectedAnchors[1].id
        });
        this.selectedAnchors = [];
      }
      this.drawSquaresAndLines();
    }
  }

  onPointerDown(event: PointerEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const anchor of this.anchors) {
      if (Math.abs(anchor.x - x) < 5 && Math.abs(anchor.y - y) < 5) {
        this.selectAnchor(event.clientX, event.clientY);
        return;
      }
    }

    this.startDrag(event.clientX, event.clientY);
  }

  onPointerMove(event: PointerEvent) {
    if (this.dragService.isDragging) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      this.dragService.moveDrag(event.clientX - rect.left, event.clientY - rect.top);
    }
  }

  onPointerUp(event: PointerEvent) {
    this.dragService.endDrag();
    this.canvas.nativeElement.releasePointerCapture(event.pointerId);
  }
}
